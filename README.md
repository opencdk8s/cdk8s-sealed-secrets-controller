# cdk8s-sealed-secrets-controller

Extends APIObjects for sealed secrets controller.
## Usage:
```
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { SealedSecretsTemplate } from '@opencdk8s/cdk8s-sealed-secrets-controller';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
      new SealedSecretsTemplate(this, 'example', {});
    }
}

const app = new App();
new MyChart(app, 'example');
app.synth();
```