const { ConstructLibraryCdk8s } = require('projen/lib/cdk8s');
const { NpmAccess } = require('projen/lib/javascript');
const project = new ConstructLibraryCdk8s({
  author: 'Gagan Singh',
  authorAddress: 'gaganpreet.singh@smallcase.com',
  cdk8sVersion: '2.2.74',
  constructsVersion: '10.0.5',
  defaultReleaseBranch: 'main',
  name: '@opencdk8s/cdk8s-sealed-secrets-controller',
  repositoryUrl: 'https://github.com/opencdk8s/cdk8s-sealed-secrets-controller.git',
  npmAccess: NpmAccess.PUBLIC,
  mergify: true,
  python: {
    distName: 'cdk8s-sealed-secrets-controller',
    module: 'cdk8s_sealed_secrets_controller',
  },

  depsUpgrade: false,
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});
project.synth();
