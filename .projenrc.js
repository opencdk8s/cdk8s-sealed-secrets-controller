const { ConstructLibraryCdk8s, NpmAccess } = require('projen');
const project = new ConstructLibraryCdk8s({
  author: 'Gagan Singh',
  authorAddress: 'gaganpreet.singh@smallcase.com',
  cdk8sVersion: '1.0.0-beta.24',
  cdk8sPlusVersion: '1.0.0-beta.24',
  constructsVersion: '3.3.80',
  defaultReleaseBranch: 'main',
  name: '@opencdk8s/cdk8s-sealed-secrets-controller',
  repositoryUrl: 'https://github.com/opencdk8s/cdk8s-sealed-secrets-controller.git',
  npmAccess: 'public',
  mergify: true,

  npmAccess: NpmAccess.PUBLIC,
  python: {
    distName: 'cdk8s-sealed-secrets-controller',
    module: 'cdk8s_sealed_secrets_controller',
  },


  peerDeps: [
    "constructs@^3.3.80"
  ],
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});
project.synth();