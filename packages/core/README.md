# @astryx-vue/core

Vue components for astryx-vue.

Docs: <https://astryx-vue.pages.dev>

```bash
pnpm add @astryx-vue/core @astryx-vue/themes
```

Component entries load structural styles. Import a theme once at the app entry. To load every structural stylesheet yourself, also import `@astryx-vue/core/styles.css`.

```ts
import { Badge } from '@astryx-vue/core/Badge'
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <Badge variant="success">
    Ready
  </Badge>
</template>
```

Text inputs include their own label, description and validation status:

```vue
<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const email = shallowRef('')
</script>

<template>
  <TextInput v-model="email" label="Email" type="email" auto-complete="email" />
</template>
```

Use `Field`, `FieldLabel` and `FieldStatus` from `@astryx-vue/core/Field` for custom controls. `Field` supplies association IDs through its default slot; forward them to the control's `id`, `aria-labelledby` and `aria-describedby`.

`TextInput` supports clear buttons, disabled reasons, read-only values, three sizes, status messages and asynchronous `changeAction`. Use `@action-error` to handle failed actions. Inputs remain editable while actions are pending; request cancellation and stale-result handling belong to the application.

`CheckboxInput` from `@astryx-vue/core/CheckboxInput` supports `v-model` with `boolean | 'indeterminate'`. It includes a label, description, validation status, disabled reasons, native form submission and asynchronous `changeAction`. Pending actions block repeat activation. Failures emit `actionError`; the application decides whether to revert the model. `CheckboxIndicator` from `@astryx-vue/core/CheckboxIndicator` provides the decorative visual without input behavior.

`Slider` from `@astryx-vue/core/Slider` accepts a numeric `v-model` or a `[number, number]` range. It supports marks, horizontal and vertical orientation, keyboard controls, value formatting, form values and disabled reasons. `changeEnd` fires when an adjustment ends.

`Banner` from `@astryx-vue/core/Banner` shows persistent info, success, warning or error messages. It supports actions, dismissal, card and section containers, and optional details. Use `v-model:is-open` to control the details or `:collapsible="false"` to keep them visible.
