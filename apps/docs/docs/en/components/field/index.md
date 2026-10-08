---
layout: component-docs
title: Field
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { fieldCustom, fieldPrimitives } from '../../../../components/demos/field'
</script>

## Usage

`Field` provides structure around a control:

- A label.
- A description.
- Required or optional indicators.
- A status message.

`TextInput` includes `Field`. Pass field props directly to `TextInput`.

```vue
<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { shallowRef, useId } from 'vue'

const volume = shallowRef(50)
const inputId = `volume-${useId()}`
</script>

<template>
  <Field :input-id="inputId" label="Volume" description="Set playback volume.">
    <template #default="field">
      <input
        :id="field.inputId" v-model.number="volume" type="range"
        :aria-labelledby="field.labelId" :aria-describedby="field.describedBy"
      >
    </template>
  </Field>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Wrap custom controls, native inputs, or third-party widgets that need labeling, helper text, optional/required indicators, or validation status. |
| <Badge variant="success">Do</Badge> | Always provide a label for accessibility, even if visually hidden with isLabelHidden. |
| <Badge variant="success">Do</Badge> | Use inputID and descriptionID to connect the label and description to the inner control with htmlFor and aria-describedby. |
| <Badge variant="error">Don't</Badge> | Nest Field around styled inputs such as TextInput, Typeahead, Select, DateInput, or TextArea; those components already render their own Field shell. |
| <Badge variant="error">Don't</Badge> | Use the attached status variant on non-bordered controls such as sliders, switches, or checkboxes; use detached so the message does not overlap the control. |
| <Badge variant="error">Don't</Badge> | Set both isOptional and isRequired on the same field. |
| <Badge variant="error">Don't</Badge> | Hide the label without providing an alternative way for the user to understand the field purpose. |

## Examples

<DemoExample :demo="fieldCustom" title="Custom control" description="The default slot supplies association IDs. Detached status avoids overlapping a slider." locale="en" />

<DemoExample :demo="fieldPrimitives" title="Standalone label and status" description="Compose FieldLabel and FieldStatus separately and connect the control id and aria-describedby yourself." locale="en" />

## Association IDs

The default slot provides:

- `inputId`: the control ID.
- `labelId`: the label ID.
- `descriptionId`: the description ID.
- `statusId`: the status message ID.
- `describedBy`: the description and status message IDs.

1. Pass `inputId` to the control's `id`.
2. Pass `labelId` to the control's `aria-labelledby`.
3. Pass `describedBy` to the control's `aria-describedby`.

`Field` does not modify controls in its slot automatically.

## Group labels

1. Set `isGroupLabel` on `Field`.
2. Pass `labelId` to the group's `aria-labelledby`.

If the label is hidden, provide visible context that explains the field's purpose.

## Scope

The application is responsible for:

- Validating control values.
- Submitting forms.
- Disabling controls.
