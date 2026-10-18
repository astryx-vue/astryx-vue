---
layout: component-docs
title: useInteractiveRole
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Resolves what a polymorphic component should render as, in one place: href wins, then a click handler, then inert. Use it in any component that is sometimes a link, sometimes a button, and sometimes plain content; Token, Thumbnail and Item all do.

```ts
import { useInteractiveRole } from '@astryx-vue/core'
```

It takes a boolean for the click handler instead of the handler itself, because a function and a getter look the same in Vue: pass `hasOnClick: () => props.onClick != null`.

Upstream also reads an interactive trigger context supplied by a parent (Popover, DropdownMenu and friends), so a component built on it becomes a valid trigger for new surfaces without changing. The overlays in this port do not accept child elements as triggers, so there is no such context to read and the resolution stops at the click handler.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Switch on the returned role to pick the element, and render an anchor only for `"link"` so keyboard and middle-click behavior come from the platform. |
| <Badge variant="success">Do</Badge> | Pass `isDisabled` through rather than dropping the href yourself; the hook already ignores a disabled href when it resolves the role. |
| <Badge variant="error">Don't</Badge> | Add another ad-hoc href / click precedence check in a component; every consumer should inherit the same order. |
