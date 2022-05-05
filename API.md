# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### SealedSecretsTemplate <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate"></a>

#### Initializers <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsTemplate.Initializer"></a>

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

#### Initializers <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.Initializer"></a>

```typescript
import { ControllerStrategy } from '@opencdk8s/cdk8s-sealed-secrets-controller'

new ControllerStrategy()
```



#### Properties <a name="Properties"></a>

##### `maxSurge`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.property.maxSurge"></a>

```typescript
public readonly maxSurge: string;
```

- *Type:* `string`

---

##### `maxUnavailable`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.property.maxUnavailable"></a>

```typescript
public readonly maxUnavailable: string;
```

- *Type:* `string`

---

##### `type`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* `string`

---


### SealedSecretsControllerOptions <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions"></a>

#### Initializers <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.Initializer"></a>

```typescript
import { SealedSecretsControllerOptions } from '@opencdk8s/cdk8s-sealed-secrets-controller'

new SealedSecretsControllerOptions()
```



#### Properties <a name="Properties"></a>

##### `args`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.args"></a>

```typescript
public readonly args: string[];
```

- *Type:* `string`[]

---

##### `command`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.command"></a>

```typescript
public readonly command: string[];
```

- *Type:* `string`[]

---

##### `env`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.env"></a>

```typescript
public readonly env: string[];
```

- *Type:* `string`[]

---

##### `image`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* `string`

---

##### `minReadySeconds`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.minReadySeconds"></a>

```typescript
public readonly minReadySeconds: number;
```

- *Type:* `number`

---

##### `name`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

---

##### `namespace`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.namespace"></a>

```typescript
public readonly namespace: string;
```

- *Type:* `string`

---

##### `replicas`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* `number`

---

##### `runAsNonRoot`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.runAsNonRoot"></a>

```typescript
public readonly runAsNonRoot: boolean;
```

- *Type:* `boolean`

---

##### `selector`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.selector"></a>

```typescript
public readonly selector: string;
```

- *Type:* `string`

---

##### `strategy`<sup>Optional</sup> <a name="@opencdk8s/cdk8s-sealed-secrets-controller.SealedSecretsControllerOptions.property.strategy"></a>

```typescript
public readonly strategy: ControllerStrategy;
```

- *Type:* [`@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy`](#@opencdk8s/cdk8s-sealed-secrets-controller.ControllerStrategy)

---



