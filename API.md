# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### SealedSecretsTemplate <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate"></a>

#### Initializer <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate.Initializer"></a>

```typescript
import { SealedSecretsTemplate } from '@opencdk8s/cdk8s-sealed-secrets-controller'

new SealedSecretsTemplate(scope: Construct, id: string, options: SealedSecretsControllerOptions)
```

##### `scope`<sup>Required</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate.parameter.id"></a>

- *Type:* `string`

---

##### `options`<sup>Required</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate.parameter.options"></a>

- *Type:* [`@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions`](#@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions)

---






## Classes <a name="Classes"></a>

### ControllerStrategy <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy"></a>

#### Initializer <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.Initializer"></a>

```typescript
import { ControllerStrategy } from '@opencdk8s/cdk8s-sealed-secrets-controller'

new ControllerStrategy()
```



#### Properties <a name="Properties"></a>

##### `maxSurge`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.property.maxSurge"></a>

- *Type:* `string`

---

##### `maxUnavailable`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.property.maxUnavailable"></a>

- *Type:* `string`

---

##### `type`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.property.type"></a>

- *Type:* `string`

---


### SealedSecretsControllerOptions <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions"></a>

#### Initializer <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.Initializer"></a>

```typescript
import { SealedSecretsControllerOptions } from '@opencdk8s/cdk8s-sealed-secrets-controller'

new SealedSecretsControllerOptions()
```



#### Properties <a name="Properties"></a>

##### `args`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.args"></a>

- *Type:* `string`[]

---

##### `command`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.command"></a>

- *Type:* `string`[]

---

##### `env`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.env"></a>

- *Type:* `string`[]

---

##### `image`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.image"></a>

- *Type:* `string`

---

##### `minReadySeconds`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.minReadySeconds"></a>

- *Type:* `number`

---

##### `name`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.name"></a>

- *Type:* `string`

---

##### `namespace`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.namespace"></a>

- *Type:* `string`

---

##### `replicas`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.replicas"></a>

- *Type:* `number`

---

##### `runAsNonRoot`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.runAsNonRoot"></a>

- *Type:* `boolean`

---

##### `selector`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.selector"></a>

- *Type:* `string`

---

##### `strategy`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.strategy"></a>

- *Type:* [`@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy`](#@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy)

---



