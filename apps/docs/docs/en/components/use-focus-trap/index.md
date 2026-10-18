---
layout: component-docs
title: useFocusTrap
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Traps focus within a container element following the WAI-ARIA dialog focus trap pattern. While the trap is active it listens to `keydown` on the document and wraps Tab and Shift+Tab, so focus cycles inside the container instead of leaving it. Turning the trap on also moves focus in: the element returned by `initialFocus`, or else the first focusable element. Turning it off is the whole teardown, so a dialog can toggle the ref without unmounting the hook.

Restoring focus is not part of the trap. Pair it with `useRestoreFocus`, the way `Dialog` and `Popover` do. Mouse clicks outside the container are not intercepted either; use a light-dismiss handler for that.

```ts
import { useFocusTrap } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass the container as a template ref and call `focusFirst()` when opening a dialog/modal to move focus into the trapped region. |
| <Badge variant="success">Do</Badge> | Provide an `onEscape` to `useDismiss` beside the trap, so Escape closes the dialog; the trap itself only owns Tab. |
| <Badge variant="success">Do</Badge> | Rely on `useRestoreFocus` for focus restoration on close; the trap does not send focus back by itself. |
| <Badge variant="error">Don't</Badge> | Use on non-modal content like tooltips or dropdowns; those need light-dismiss, not focus trapping. |
