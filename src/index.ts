import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';
export * as k8s from './imports/k8s';

export class ControllerStrategy {
  readonly type?: string;
  readonly maxUnavailable?: string;
  readonly maxSurge?: string;
}

export class SealedSecretsControllerOptions {
  readonly name?: string;
  readonly namespace?: string;
  readonly strategy?: ControllerStrategy;
  readonly args?: string[];
  readonly command?: string[];
  readonly env?: string[];
  readonly image?: string;
  readonly runAsNonRoot?: boolean;
  readonly minReadySeconds?: number;
  readonly replicas?: number;
  readonly selector?: string;
}

export class SealedSecretsTemplate extends Construct {

  private name: string;
  private namespace: string;
  private args: string[];
  private command: string[];
  private env: string[];
  private image: string;
  private runAsNonRoot: boolean;
  private minReadySeconds: number;
  private replicas: number;

  constructor(scope: Construct, id: string, options: SealedSecretsControllerOptions) {
    super(scope, id);

    this.name = options.name ?? 'sealed-secrets-controller';
    this.namespace = options.namespace ?? 'kube-system';
    this.args = [];
    this.command = options.command ?? ['controller'];
    this.env = [];
    this.image = options.image ?? 'quay.io/bitnami/sealed-secrets-controller:v0.9.8';
    this.runAsNonRoot = options.runAsNonRoot ?? true;
    this.minReadySeconds = options.minReadySeconds ?? 30;
    this.replicas = options.replicas ?? 1;

    // ServiceAccount
    new ApiObject(this, 'sealed-secrets-service-account', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        annotations: {},
        labels: {
          name: this.name,
        },
        name: this.name,
        namespace: this.namespace,
      },
    });

    // Deployment
    new ApiObject(this, 'sealed-secrets-controller', {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        annotations: {},
        labels: {
          name: this.name,
        },
        name: this.name,
        namespace: this.namespace,
      },
      spec: {
        minReadySeconds: this.minReadySeconds ?? 30,
        replicas: this.replicas ?? 1,
        revisionHistoryLimit: 10,
        ... options.selector ? {
          selector: {
            matchLabels: {
              name: options.selector,
            },
          },
        }:{
          selector: {
            matchLabels: {
              name: options.name,
            },
          },
        },
        strategy: {
          ... this.getStrategy(),
        },
        template: {
          metadata: {
            annotations: {},
            labels: {
              name: this.name,
            },
          },
          spec: {
            containers: [
              {
                args: this.args ?? [],
                command: this.command ?? ['controller'],
                env: this.env ?? [],
                image: this.image ?? 'quay.io/bitnami/sealed-secrets-controller:v0.9.8',
                imagePullPolicy: 'Always',
                livenessProbe: {
                  httpGet: {
                    path: '/healthz',
                    port: 'http',
                  },
                },
                name: this.name,
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
                  runAsNonRoot: this.runAsNonRoot ?? true,
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
              },
            ],
            initContainers: [],
            imagePullSecrets: [],
            securityContext: {
              fsGroup: 65534,
            },
            serviceAccountName: this.name,
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
          name: this.name,
        },
        name: this.name,
        namespace: this.namespace,
      },
      spec: {
        ports: [
          {
            port: 8080,
            targetPort: 8080,
          },
        ],
        selector: {
          name: this.name,
        },
        type: 'ClusterIP',
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
        namespace: this.namespace,
      },
      rules: [
        {
          apiGroups: [
            '',
          ],
          resourceNames: [
            this.name,
            'http:' + this.name + ':',
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
    new ApiObject(this, 'sealed-secrets-key-admin-clusterrole', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'ClusterRole',
      metadata: {
        annotations: {},
        labels: {
          name: 'sealed-secrets-key-admin',
        },
        name: 'sealed-secrets-key-admin',
        namespace: this.namespace,
      },
      rules: [
        {
          apiGroups: [
            '',
          ],
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
            'sealedsecrets',
          ],
          verbs: [
            'get',
            'list',
            'watch',
            'update',
          ],
        },
        {
          apiGroups: [
            '',
          ],
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
          apiGroups: [
            '',
          ],
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
        namespace: this.namespace,
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
          name: this.name,
        },
        name: this.name,
        namespace: this.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: 'sealed-secrets-key-admin',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: this.name,
          namespace: this.namespace,
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
          name: this.name + '-key-admin',
        },
        name: this.name + '-key-admin',
        namespace: this.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: 'sealed-secrets-key-admin',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: this.name,
          namespace: this.namespace,
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
          name: this.name + '-unsealer',
        },
        name: this.name + '-unsealer',
        namespace: this.namespace,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: 'secrets-unsealer',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: this.name,
          namespace: this.namespace,
        },
      ],
    });
  }

  private getStrategy() {
    return {
      rollingUpdate: {
        maxSurge: '25%',
        maxUnavailable: '25%',
      },
      type: 'RollingUpdate',
    };
  }
}