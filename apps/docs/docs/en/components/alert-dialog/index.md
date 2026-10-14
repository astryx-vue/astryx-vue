---
layout: component-docs
title: Alert Dialog
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { alertDialogLoading } from '../../../../components/demos/alert-dialog'
</script>

## Usage

`AlertDialog` is a modal with a single job: it asks the user to confirm a destructive or irreversible action before that action happens. Deleting content, revoking access, and discarding unsaved work all belong here — the work cannot be undone, so it is worth interrupting the user, stating the consequence, and letting them decide.

It implements the WAI-ARIA Alert Dialog pattern. The root element uses `role="alertdialog"`, the title names the dialog through `aria-labelledby`, and the consequence description is announced with it through `aria-describedby`. Focus moves into the dialog on open and lands on Cancel, then returns to the element that opened it on close. The dialog cannot be dismissed by clicking the backdrop, and Escape is the same as canceling.

```vue
<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
import { Button } from '@astryx-vue/core/Button'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="Delete project" variant="destructive" @click="isOpen = true" />
  <AlertDialog
    :is-open="isOpen"
    title="Delete this project?"
    description="This cannot be undone. Its deployments and every dashboard built on it go with it."
    action-label="Delete project"
    @action="isOpen = false"
    @open-change="isOpen = $event"
  />
</template>
```

The parent owns the open state. Cancel and Escape only emit `openChange(false)`, so the dialog never closes itself, and the confirm action only emits `action` without closing either. That gap is deliberate: real work takes time, so you close the dialog when the work settles. While it runs, set `isActionLoading` to show a spinner on the confirm button and hold the dialog open:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const isActionLoading = ref(false)

async function revoke(): Promise<void> {
  isActionLoading.value = true
  await revokeAccess()
  isActionLoading.value = false
  isOpen.value = false
}
</script>

<template>
  <AlertDialog
    :is-action-loading="isActionLoading"
    :is-open="isOpen"
    action-label="Revoke access"
    description="This member loses access to every shared folder and draft immediately."
    title="Revoke access?"
    @action="revoke"
    @open-change="isOpen = $event"
  />
</template>
```

The confirm action uses the `destructive` variant by default, because the dialog exists to confirm destructive work. When the confirmation is not destructive — publishing a draft, for instance — set `actionVariant` to `primary` so the color matches the meaning.

The action layout follows the available width. Above 640px the actions sit in one row, Cancel then confirm, and the row wraps when the labels are long. At 640px and below both buttons fill the width and the confirm action sits above Cancel. Either way, initial focus stays on Cancel, the least destructive choice, and the narrow layout keeps visual, DOM, and tab order aligned so screen readers read the actions in the order they are shown.

`isInline` renders the whole surface in normal flow for documentation previews, without the `<dialog>` element, the backdrop, or focus behavior. Because it is not modal, it does not claim to be: the root element uses `role="group"` instead.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Make the confirm label say what will happen. "Delete project" lets the user judge the outcome before pressing; "OK" or "Yes" does not. |
| <Badge variant="success">Do</Badge> | Put the consequence in `description`: whether the data can be recovered, what else is affected, who gets notified. This is where the decision is actually made. |
| <Badge variant="success">Do</Badge> | Keep Cancel as the least destructive focus target. On a narrow screen the confirm action is visually and structurally first, but initial focus stays on Cancel. |
| <Badge variant="success">Do</Badge> | Hold the dialog open with `isActionLoading` while an async action runs, and close it once the work really settles. |
| <Badge variant="success">Do</Badge> | Reserve it for destructive or irreversible work. For plain information, or for filling something in, a lighter dialog is the better fit. |
| <Badge variant="error">Don't</Badge> | Signal danger with color alone. A red button does not say what will happen; the label does. |
| <Badge variant="error">Don't</Badge> | Close the dialog inside the `action` handler. The loading state then has nowhere to live, and the user never learns whether the work succeeded. |
| <Badge variant="error">Don't</Badge> | Nest a confirmation dialog inside another dialog. Split a multi-step flow into steps inside one dialog, or use a full page. |

## Examples

<DemoExample
  :demo="alertDialogLoading"
  description="Revoke stays in a loading state for two seconds. The dialog is shown inline so the pending action is visible without opening it first."
  locale="en"
  title="Loading"
/>

## Accessibility

The dialog opens through the native `showModal()`, so modality, the inert page behind it, and focus restoration on close all come from the browser. The title and description are linked with `aria-labelledby` and `aria-describedby`, so assistive technology announces the question, the consequence, and the available actions together, instead of making the user explore the surface first.

Initial focus is pinned to Cancel through `data-autofocus`, so the least destructive choice keeps the focus even when the narrow layout rearranges the buttons. Escape and the Cancel button take the same path: they only emit `openChange(false)` and leave the decision to the parent. Clicking the backdrop never closes the dialog — a confirmation of destructive work should not disappear on a stray click.

While the confirm action is loading it carries `aria-busy`, and Cancel stays available so the user can back out of work that has not finished.

## Theme

```css
.my-alert-dialog {
  --astryx-alert-dialog-title-foreground: #171717;
  --astryx-alert-dialog-description-foreground: #525252;
  --astryx-alert-dialog-content-gap: 16px;
}
```

The surface, backdrop, radius, and shadow come from the dialog itself and are tuned through the `--astryx-dialog-*` tokens. The tokens above only affect the title, the description, and the space before the actions. The neutral theme follows the color mode automatically.
