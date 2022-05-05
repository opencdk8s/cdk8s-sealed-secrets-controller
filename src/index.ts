import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';
export * as k8s from './imports/k8s';
import * as k8s from './imports/k8s';

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
  readonly env?: k8s.EnvVar[];
  readonly image?: string;
  readonly runAsNonRoot?: boolean;
  readonly minReadySeconds?: number;
  readonly replicas?: number;
  readonly labels?: { [key: string]: string };
  readonly resources?: k8s.ResourceRequirements;
}

export class SealedSecretsTemplate extends Construct {

  private name: string;
  private namespace: string;
  private args: string[];
  private command: string[];
  private env: k8s.EnvVar[];
  private image: string;
  private runAsNonRoot: boolean;
  private minReadySeconds: number;
  private replicas: number;
  private labels?: { [key: string]: string };
  private resources?: k8s.ResourceRequirements;

  constructor(scope: Construct, id: string, options: SealedSecretsControllerOptions) {
    super(scope, id);

    this.name = options.name ?? 'sealed-secrets-controller';
    this.namespace = options.namespace ?? 'kube-system';
    this.args = [];
    this.command = options.command ?? ['controller'];
    this.env = [];
    this.image = options.image ?? 'bitnami/sealed-secrets-controller:v0.9.8';
    this.runAsNonRoot = options.runAsNonRoot ?? true;
    this.minReadySeconds = options.minReadySeconds ?? 30;
    this.replicas = options.replicas ?? 1;
    this.labels = options.labels ?? {
      name: this.name,
    };
    this.resources = options.resources ?? {
      limits: {
        cpu: 2,
        memory: '2Gi',
      },
      requests: {
        cpu: '1',
        memory: '1Gi',
      },
    };

    // ServiceAccount
    new ApiObject(this, 'sealed-secrets-service-account', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        labels: this.labels,
        name: this.name,
        namespace: this.namespace,
      },
    });

    // Deployment
    new k8s.KubeDeployment(this, 'sealed-secrets-controller', {
      metadata: {
        labels: this.labels,
        name: this.name,
        namespace: this.namespace,
      },
      spec: {
        minReadySeconds: this.minReadySeconds ?? 30,
        replicas: this.replicas ?? 1,
        revisionHistoryLimit: 10,
        selector: {
          matchLabels: this.labels,
        },
        strategy: {
          ... this.getStrategy(),
        },
        template: {
          metadata: {
            labels: this.labels,
          },
          spec: {
            containers: [
              {
                args: this.args,
                command: this.command,
                env: this.env,
                image: this.image,
                imagePullPolicy: 'Always',
                livenessProbe: {
                  httpGet: {
                    path: '/healthz',
                    port: 'http',
                  },
                },
                resources: this.resources,
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
        labels: this.labels,
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
        selector: this.labels,
        type: 'ClusterIP',
      },
    });

    // service proxier role
    new ApiObject(this, 'sealed-secrets-service-proxier-role', {
      apiVersion: 'rbac.authorization.k8s.io/v1beta1',
      kind: 'Role',
      metadata: {
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
        labels: this.labels,
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
