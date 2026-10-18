---
layout: component-docs
title: useKeyboardHint
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useKeyboardHintToolbar } from '../../../../components/demos/use-keyboard-hint'
</script>

## Usage

Shows an ephemeral "← → to navigate" hint anchored to the focused item the first time a roving-tabindex composite receives keyboard focus. It teaches sighted keyboard users that arrow keys move within the group. The hint renders arrow keys with `Kbd`, is positioned `fixed` next to the focused element, so overflow containers never clip it, and is `aria-hidden`. It auto-dismisses on the first arrow press or on timeout, hides when focus leaves the group, and after a dismissal it does not show again for that instance. Reach for the hook directly when building a custom roving-tabindex widget; `Toolbar`, `TabList`, and `SegmentedControl` do not mount it for you.

The `Hint` component returned by the hook is rendered inside the composite container, as its last child.

```ts
import { useKeyboardHint } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Compose the returned `onFocus` and `onKeyDown` with your existing handlers rather than replacing them: call `onKeyDown` first (it only dismisses, never prevents), then your navigation handler. |
| <Badge variant="success">Do</Badge> | Render `Hint` as the last child of the composite container; it is `position: fixed` and `aria-hidden`, so it never affects layout or the accessibility tree. |
| <Badge variant="success">Do</Badge> | Match `orientation` to the arrow keys your widget actually responds to so the hint shows the correct icons. |
| <Badge variant="error">Don't</Badge> | Use for single controls or widgets without roving-tabindex navigation; the hint only makes sense where arrows move focus within a group. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useKeyboardHintToolbar"
  description="A custom roving-tabindex toolbar shows an ephemeral arrow-key hint on first keyboard focus via useKeyboardHint, teaching sighted keyboard users that arrows move within the group."
  locale="en"
  title="useKeyboardHint — Arrow-key Hint"
/>
