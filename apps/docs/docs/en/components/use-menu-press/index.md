---
layout: component-docs
title: useMenuPress
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

The press model of a menu surface, for any pointer. A press that starts on a row is claimed: the highlight follows a held finger as it moves, and the row under the RELEASE is the row that acts — its click is dispatched for it, carrying the release's modifier keys. The click the browser reports at the end of a touch, aimed at the row where the touch began, is swallowed so nothing acts twice. The pointer is tracked at document level by `pointerId`, so a finger that slid off the row it landed on is still followed. A mouse press keeps the highlight on the row it landed on and lets that row's own click act; a mouse released outside the menu calls `onDismiss`; a finger released outside leaves the menu open; `pointercancel` or a second pointer ends the gesture with nothing acting.

`ContextMenu` already mounts it. Reach for it directly only when building a menu-like surface of your own: give it the menu root's ref, enable it while the menu is open, and spread `menuProps` onto the root. `onPointerDown` is the same handler on its own, for markup that cannot take an object spread.

Rows are the enabled `[role="menuitem"]`, `[role="menuitemradio"]`, and `[role="menuitemcheckbox"]` elements inside the root, and the menu boundary is `[role="menu"]`. Pass `itemSelector` to pick rows with a selector of your own, `onHighlight` to highlight some way other than DOM focus, and `onActivate` to act on the row yourself. `resetMenuPress()` forgets an armed click swallower; it is for unmount and tests.

The trigger side is optional. Give it `triggerRef` and `onTriggerPress`, spread `triggerProps` onto the trigger, and a primary-button press there opens the menu at once while a finger has to rest for `longPressDelayMs`. A right-click is left alone, so its own `contextmenu` route keeps working. Either way the press can slide straight into the menu: rows highlight under the held pointer and the row under the release acts. The click that ends that gesture is reported by `isTriggerClickFromPress()`, so the trigger's own click neither toggles nor reopens. `triggerProps.onContextMenu` suppresses the browser's own long-press menu for a finger; a mouse's right-click still reaches the application.

```ts
import { useMenuPress } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass a selector for ENABLED rows only, so a disabled row or a divider under the pointer picks nothing instead of lighting up. |
| <Badge variant="success">Do</Badge> | Let the default highlight be DOM focus; the hook focuses the row under the pointer with `preventScroll`. Style the active row with `:focus`. Supply `onHighlight` only for a listbox that must keep focus on its combobox. |
| <Badge variant="success">Do</Badge> | Declare `touch-action` on the menu root: `pinch-zoom` when its rows fit, `pan-y pinch-zoom` when it scrolls, so the browser — not the hook — decides when a finger is scrolling, and a two-finger pinch still zooms the page. |
| <Badge variant="error">Don't</Badge> | Act on a row from its own `pointerdown` or `pointerup` handler as well; the hook already activates the row under the release, and a second path acts twice. |
| <Badge variant="error">Don't</Badge> | Read a row click with `detail` 0 as a keyboard activation; the hook dispatches its pointer activation with `detail` 0 too. The dispatched click is untrusted, so check `event.isTrusted` to tell them apart. |
