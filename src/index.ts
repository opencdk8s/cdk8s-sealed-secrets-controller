import { ApiObject, GroupVersionKind } from 'cdk8s';
import { Construct } from 'constructs';
export * as k8s from './imports/k8s';

export class ControllerStrategy {
  readonly type: string;
  readonly maxUnavailable?: string;
  readonly maxSurge?: string;
}

export class ControllerSpecs {
  readonly args?: string[];
  readonly command?: string[];
  readonly env?: string[];
  readonly image?: string;
  readonly name?: string;
  readonly runAsNonRoot?: boolean;
  readonly minReadySeconds?: number;
  readonly replicas?: number;
  readonly serviceAccountName?: string;
  readonly selector?: string;
}

export class SealedSecretsControllerOptions {
  readonly name: string;
  readonly namespace: string;
  readonly strategy: ControllerStrategy;
  readonly spec: ControllerSpecs;
}

export class SealedSecretsTemplate extends Construct {
  constructor(scope: Construct, id: string, options: SealedSecretsControllerOptions) {
    super(scope, id);

    // ServiceAccount
    new ApiObject(this, 'sealed-secrets-service-account', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        annotations: {},
        labels: {
          name: options.name,
        },
        name: options.name,
        namespace: options.namespace,
      },
    });

    // Deployment
    new ApiObject(this, 'sealed-secrets-controller', {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        annotations: {},
        labels: {
          name: options.name,
        },
        name: options.name,
        namespace: options.namespace,
      },
      spec: {
        minReadySeconds: options.spec.minReadySeconds ?? 30,
        replicas: options.spec.replicas ?? 1,
        revisionHistoryLimit: 10,
        ... options.spec.selector ? {
          strategy: {
            matchLabels: {
              name: options.name,
            },
          },
        }:{},
        strategy: {
          ... this.getStrategy(options.strategy),
        },
        template: {
          metadata: {
            annotations: {},
            labels: {
              name: options.name,
            },
          },
          spec: {
            containers: [
              {
                args: options.spec.args ?? [],
                command: options.spec.command ?? ['controller'],
                env: options.spec.env ?? [],
                image: options.spec.image ?? 'quay.io/bitnami/sealed-secrets-controller:v0.9.8',
                imagePullPolicy: 'Always',
                livenessProbe: {
                  httpGet: {
                    path: '/healthz',
                    port: 'http',
                  },
                },
                name: options.name,
                ports: [
                  {
                    containerPort: 8080,
                    name: 'http',
                  },
                ],
                readinessProbe: {
                  httpGet: {
                    path: '/healthz',
                    port: 'http',
                  },
                },
                securityContext: {
                  readOnlyRootFilesystem: true,
                  runAsNonRoot: options.spec.runAsNonRoot ?? true,
                  runAsUser: 1001,
                },
                stdin: false,
                tty: false,
                volumeMounts: [
                  {
                    mountPath: '/tmp',
                    name: 'tmp',
                  },
                ],
                imagePullSecrets: [],
                initContainers: [],
              },
            ],
            initContainers: [],
            imagePullSecrets: [],
            securityContext: {
              fsGroup: 65534,
            },
            serviceAccountName: options.name,
            terminationGracePeriodSeconds: 30,
            volumes: [
              {
                emptyDir: {},
                name: 'tmp',
              },
            ],
          },
        },
      },
    });

    // Service
    new ApiObject(this, 'sealed-secrets-service', {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        annotations: {},
        labels: {
          name: options.name,
        },
        name: options.name,
        namespace: options.namespace,
      },
      spec: {
        ports: [
          {
            port: 8080,
            targetPort: 8080,
            selector: {
              name: options.name,
            },
            type: 'ClusterIP',
          },
        ],
      },
    });

    // service proxier role
    new ApiObject(this, 'sealed-secrets-service-proxier-role', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'Role',
      metadata: {
        annotations: {},
        labels: {
          name: 'sealed-secrets-service-proxier',
        },
        name: 'sealed-secrets-service-proxier',
        namespace: options.namespace,
      },
      rules: [
        {
          apiGroups: [],
          resourceNames: [
            options.name,
            'http:' + options.name + ':',
          ],
          resources: [
            'services/proxy',
          ],
          verbs: [
            'create',
            'get',
          ],
        },
      ],
    });

    // Key admin role
    new ApiObject(this, 'sealed-secrets-key-admin-role', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'Role',
      metadata: {
        annotations: {},
        labels: {
          name: 'sealed-secrets-key-admin',
        },
        name: 'sealed-secrets-key-admin',
        namespace: options.namespace,
      },
      rules: [
        {
          apiGroups: [],
          resources: [
            'secrets',
          ],
          verbs: [
            'create',
            'list',
          ],
        },
      ],
    });

    // Cluster Role
    new ApiObject(this, 'sealed-secrets-unsealer-role', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'ClusterRole',
      metadata: {
        annotations: {},
        labels: {
          name: 'secrets-unsealer',
        },
        name: 'secrets-unsealer',
      },
      rules: [
        {
          apiGroups: [
            'bitnami.com',
          ],
          resources: [
            'sealedSecrets',
          ],
          verbs: [
            'get',
            'list',
            'watch',
            'update',
          ],
        },
        {
          apiGroups: [],
          resources: [
            'secrets',
          ],
          verbs: [
            'get',
            'create',
            'update',
            'delete',
          ],
        },
        {
          apiGroups: [],
          resources: [
            'events',
          ],
          verbs: [
            'create',
            'patch',
          ],
        },
      ],
    });

    // Custom Resource Definition
    new ApiObject(this, 'sealed-secrets-crd', {
      apiVersion: 'apiextensions.k8s.io/v1beta1',
      kind: 'CustomResourceDefinition',
      metadata: {
        name: 'sealedsecrets.bitnami.com',
      },
      spec: {
        group: 'bitnami.com',
        names: {
          kind: 'SealedSecret',
          listKind: 'SealedSecretList',
          plural: 'sealedsecrets',
          singular: 'sealedsecret',
        },
        scope: 'Namespaced',
        version: 'v1alpha1',
      },
    });

    // Role binding
    new ApiObject(this, 'sealed-secrets-role-binding-service-proxier', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'RoleBinding',
      metadata: {
        annotations: {},
        labels: {
          name: 'sealed-secrets-service-proxier',
        },
        name: 'sealed-secrets-service-proxier',
        namespace: options.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'Role',
        name: 'sealed-secrets-service-proxier',
      },

      subjects: [
        {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'Group',
          name: 'system:authenticated',
        },
      ],
    });

    // Role binding
    new ApiObject(this, 'sealed-secrets-controller-role-binding', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'RoleBinding',
      metadata: {
        annotations: {},
        labels: {
          name: options.name,
        },
        name: options.name,
        namespace: options.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'Role',
        name: 'sealed-secrets-key-admin',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: options.name,
          namespace: options.namespace,
        },
      ],
    });

    // Role binding
    new ApiObject(this, 'sealed-secrets-key-admin-role-binding', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'ClusterRoleBinding',
      metadata: {
        annotations: {},
        labels: {
          name: options.name,
        },
        name: options.name,
        namespace: options.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'Role',
        name: 'sealed-secrets-key-admin',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: options.name,
          namespace: options.namespace,
        },
      ],
    });

    // Role binding
    new ApiObject(this, 'sealed-secrets-cluster-role-binding', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'ClusterRoleBinding',
      metadata: {
        annotations: {},
        labels: {
          name: options.name,
        },
        name: options.name,
        namespace: options.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: 'secrets-unsealer',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: options.name,
          namespace: options.namespace,
        },
      ],
    });
  }

  private getStrategy(options: ControllerStrategy) {
    if (options.type == 'RollingUpdate') {
      return {
        rollingUpdate: {
          maxSurge: options.maxSurge ?? '25%',
          maxUnavailable: options.maxUnavailable ?? '25%',
        },
      };
    }
  }
}