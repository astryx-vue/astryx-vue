---
layout: component-docs
title: Bottom Sheet
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { bottomSheetAdaptiveDialog, bottomSheetAdaptiveMenu, bottomSheetHeights, bottomSheetKeyboard, bottomSheetMultiSelector, bottomSheetNoScrim, bottomSheetSelector, bottomSheetSnapPoints, bottomSheetSwitcher } from '../../../../components/demos/bottom-sheet'
</script>

## Usage

`BottomSheet` rises from the bottom edge of the viewport to hold mobile-first content: filters, share targets, quick actions, and forms. The panel carries a decorative grab handle, a scrolling content area underneath, and a scrim that dims and blocks the page. It is built on the native `<dialog>` element, so an open sheet keeps focus inside itself, makes the rest of the page inert, and returns focus to whatever opened it when it closes.

The shortest form manages its own state and takes a name and the content:

```vue
<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <button type="button" @click="isOpen = true">
    Filters
  </button>
  <BottomSheet v-model:is-open="isOpen" label="Filters">
    <p>Filter controls go here.</p>
  </BottomSheet>
</template>
```

`label` is required and becomes the sheet's accessible name, which a screen reader announces on entry. The panel has no built-in heading, so that name has to come from you. Whether the sheet is open is decided by `isOpen`: leave it unbound and the component owns its state, so Escape, a scrim click, and a downward swipe all close it; bind it and the component renders exactly the bound value while those gestures only emit `openChange(false)` and let the parent decide.

`height` sets how tall the panel is once expanded, and it has three named budgets. `hug` fits the content up to 92% of the viewport, which suits short, bounded content. `capped` is the default at roughly 62% of the viewport, the usual choice for lists. `tall` pins the panel near full height for forms and content that keeps growing. You can also pass a number of pixels or any CSS length, such as `420` or `"min(70vh, 30rem)"`. Whatever the budget, content taller than the visible panel scrolls inside it instead of stretching the page.

`snapPoints` lets someone drag the panel to an intermediate height rather than only fully open or closed. Each stop is the panel's visible height: a number is a viewport fraction (`0.5` is half the screen), `"50%"` means the same thing, and `"320px"` is an absolute height. The panel's own height is always the tallest stop, so `snap-points="[0.5]"` reads as "half a screen or all of it". A stop that is a quarter of the panel or less counts as a peek: it slides the panel partly off-screen instead of reflowing the content into a sliver, and it thins the scrim. Without `snapPoints` the sheet only opens and closes, and dragging it down still dismisses it.

A downward drag closes the sheet, and a fast upward flick expands it to a taller stop. A finger's release follows iOS: a quick flick moves on to the next stop or closes the sheet, and a release that turns back returns to the stop the drag began at. Pulling past the tallest stop stretches like a rubber band. A finger's swipe close slides the sheet out on a spring from the release speed, and the scrim fades along the same curve. The scrim's depth follows the panel while it moves, and every close fades the scrim out. Both the handle and the content area can start a drag: pull down once the content is at its top, or up once it is at its end, and the sheet takes over the swipe. Under `prefers-reduced-motion: reduce` the entrance and exit movements collapse to almost nothing, and a finger's swipe close fades the sheet out where it is.

`purpose` controls implicit dismissal, matching `Dialog`. The default `info` allows Escape, a scrim click, and a swipe. `form` allows Escape only, so a stray click on the scrim cannot throw away typed input. `required` blocks every implicit path and announces the sheet as an alert dialog for flows that must end through an explicit choice. When the page behind the sheet should stay usable, set `hasScrim` to `false`: the sheet then opens non-modally, the page keeps scrolling and responding to clicks, and a swipe still dismisses it. A non-modal sheet never takes focus away from the page, so Escape dismisses it while focus is inside the sheet.

`padding` sets the content area's inset on the spacing scale. When omitted, the theme decides, falling back to the `--spacing-4` step (16px) on every logical edge; pass `0` for a content box flush with the panel. The content area publishes the inset it applies: a lone child region that carries its own inset escapes it, and bleed children such as a table or a divider line up with that edge instead of sitting inside it twice. At the top, the content always starts below the grab handle's 24px band, whatever the padding (`0` included): the band is not padding a child escapes, so the first row never sits under the handle, and scrolled content still passes beneath it.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Reserve it for small screens and momentary tasks: filters, sharing, quick actions, detail previews. Rising from the bottom edge keeps content inside thumb reach. |
| <Badge variant="success">Do</Badge> | Pick the height that fits the content: `hug` for short bounded content, `capped` for lists, `tall` for forms and content that streams in. |
| <Badge variant="success">Do</Badge> | Use `purpose="form"` to protect entered data against stray taps while keeping Escape available, and reserve `required` for flows that must end through an explicit action. |
| <Badge variant="success">Do</Badge> | Write a `label` that says what the sheet holds. It is the only context a screen reader gets when focus moves in. |
| <Badge variant="error">Don't</Badge> | Let the sheet content run long. Break a long task into steps or move it to a full page instead. |
| <Badge variant="error">Don't</Badge> | Treat it as the default dialog on desktop. Use `Dialog` when a centered modal is what the task calls for. |
| <Badge variant="error">Don't</Badge> | Rely on the swipe as the only way out. Escape, a scrim click, and an explicit action button matter just as much. |

## Examples

<DemoExample
  :demo="bottomSheetHeights"
  description="Compares hug, capped, and tall starting heights for different amounts of content."
  locale="en"
  title="Height variants"
/>

<DemoExample
  :demo="bottomSheetKeyboard"
  description="A tall, scrollable form that keeps focused controls visible above the mobile keyboard."
  locale="en"
  title="Mobile keyboard"
/>

<DemoExample
  :demo="bottomSheetNoScrim"
  description="The page stays visible and interactive behind a non-modal sheet."
  locale="en"
  title="No scrim"
/>

<DemoExample
  :demo="bottomSheetSnapPoints"
  description="Drag-to-resize stops: a half-height working surface, and a peek that slides away and thins the scrim."
  locale="en"
  title="Snap points"
/>

<DemoExample
  :demo="bottomSheetAdaptiveDialog"
  description="Dialog stays the default. On a coarse pointer at lg and below, the same profile form opens as a bottom sheet."
  locale="en"
  title="Adaptive dialog"
/>

<DemoExample
  :demo="bottomSheetAdaptiveMenu"
  description="Project actions use a bottom sheet on a compact touch surface and an anchored menu otherwise."
  locale="en"
  title="Adaptive menu"
/>

<DemoExample
  :demo="bottomSheetMultiSelector"
  description="A multi-selection list stays open in a bottom sheet while choices are toggled."
  locale="en"
  title="Multi-select sheet"
/>

<DemoExample
  :demo="bottomSheetSelector"
  description="A single-selection list opens in a bottom sheet."
  locale="en"
  title="Select sheet"
/>

<DemoExample
  :demo="bottomSheetSwitcher"
  description="Checkout is two sheets in one dialog. The scrim stays up while the page changes."
  locale="en"
  title="Multi-step switcher"
/>

## Accessibility

The panel is built on the native `<dialog>` element. With a scrim it opens through `showModal()`, which puts it in the top layer, makes the background inert, and confines Tab to the sheet. Without a scrim it opens through `show()`, leaving the page usable. `label` names the sheet through `aria-label`, and `purpose="required"` switches the role to `alertdialog`.

On open, focus lands on the first element with `data-autofocus` inside the panel that can take it (not inert, not hidden, and not inside a sheet or dialog nested in the content), in every browser — the native dialog's own landing, which is the panel in Chromium and the first control in Firefox, gives way to it. A modal sheet with no such element opens with focus on the panel itself. On close, focus returns to the element that was focused when the sheet opened — if it is still in the page — or to the element named by `finalFocusRef`, without scrolling the page. A sheet that is removed while open returns trapped focus the same way, finding the nearest sensible place when the opener is gone too. A sheet already open in the server markup is not announced as modal until it opens on the client, and then appears settled, with no entrance motion; later opens and closes animate as usual. The handoff happens once the exit motion has finished, so focus never lands on a surface that is still sliding away.

Escape closes the sheet unless `purpose` is `required` — a modal sheet confines focus inside itself, while a non-modal one never takes focus from the page, so focus has to be inside the sheet — and an Escape pressed while an input method is composing text cancels the composition instead. Once the content area is scrolled to the top, a downward drag can close the sheet, and at the end of its content an upward drag can expand it; with a `purpose` other than `info` a drag only settles on the nearest stop and never dismisses.

While the content actually overflows, the scrolling area becomes focusable, carries `role="group"`, and is named by the sheet's `label`, so a keyboard user can focus it and scroll with the arrow keys.

## Theming

```css
.my-sheet {
  --astryx-bottom-sheet-background: #ffffff;
  --astryx-bottom-sheet-foreground: #171717;
  --astryx-bottom-sheet-border: #d4d4d4;
  --astryx-bottom-sheet-handle-background: #d4d4d4;
  --astryx-bottom-sheet-scrim: #00000080;
  --astryx-bottom-sheet-shadow: 0 -12px 24px rgb(0 0 0 / 15%);
}
```

The neutral theme adapts to light and dark mode. `class` and `style` land on the panel `<div>`, not on the `<dialog>` that wraps it, so the variables above belong on the panel.
