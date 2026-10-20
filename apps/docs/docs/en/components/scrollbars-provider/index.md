---
layout: component-docs
title: Scrollbars Provider
outline: false
footer: false
---

<script setup lang="ts">
import { scrollbarsProviderCustomContainer, scrollbarsProviderOverview } from '../../../../components/demos/scrollbars-provider'
</script>

## Usage

Wrap your app once, and every scrolling Astryx component swaps the browser's native scrollbar for a custom overlay one. It is thin, takes no layout width, hides itself when idle, and follows the light and dark theme.

This is an extra in astryx-vue. The original Astryx does not have it. It is built on [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/) (MIT), which ships inside `@astryx-vue/core`, so you install nothing extra.

**It is off by default.** Without a `ScrollbarsProvider`, components behave exactly as before. And without one, neither the OverlayScrollbars JS nor its CSS ends up in your bundle, because only `ScrollbarsProvider` imports them.

```ts
import { ScrollbarsProvider } from '@astryx-vue/core/Scrollbars'
```

Setup takes about 30 seconds. Wrap your app in `App.vue`:

```vue
<script setup lang="ts">
import { ScrollbarsProvider } from '@astryx-vue/core/Scrollbars'
</script>

<template>
  <ScrollbarsProvider>
    <RouterView />
  </ScrollbarsProvider>
</template>
```

The props you will use most:

- `enabled`: the switch, `true` by default. Set it to `false` and the whole subtree goes back to native scrollbars.
- `autoHide`: when the scrollbar hides. `'scroll'` (default) shows it while scrolling, `'leave'` hides it after the pointer leaves, `'move'` shows it while the pointer moves, `'never'` keeps it visible.
- `autoHideDelay`: how many milliseconds to wait before hiding. Default 800.
- `options`: passed straight to OverlayScrollbars and wins over everything else. Examples are below.

## Examples

<DemoExample :demo="scrollbarsProviderOverview" title="Scrollbars Provider — Toggle Comparison" description="A ScrollableArea with a long list and a CodeBlock that scrolls sideways, both inside one ScrollbarsProvider. Flip the switch to compare the native scrollbars with the custom ones." locale="en" />

<DemoExample :demo="scrollbarsProviderCustomContainer" title="Scrollbars Provider — Your Own Scroll Container" description="A hand-written overflow: auto div that gets the custom scrollbar through useScrollbars. The look is tuned with CSS variables: a thicker bar in the accent color." locale="en" />

## Components that switch automatically

Inside a provider, the scroll areas of these components switch to the custom scrollbar. You do not change any code:

- Scroll containers: `ScrollableArea`, `Layout` (`LayoutContent` and `LayoutPanel` when they scroll), `Card`, `Stack` and `StackItem` (when they scroll)
- Menus and pickers: `DropdownMenu`, `ContextMenu`, `MoreMenu`, `Selector`, `MultiSelector`, `ComplexSelector`, `CommandPalette`
- Suggestion lists: the lists in `Typeahead`, `Tokenizer` and `PowerSearch`, plus `TimeInput` and `DateRangeInput`
- Overlays: `Popover`, `AlertDialog`, `BottomSheet`
- Navigation: `SideNav`, `MobileNav`
- Data display: `Table`, `CodeBlock`
- Conversation: the `Chat` message area and its trigger menu

## What stays native

- The `Chat` input. It is an editable area, and swapping it would get in the way of typing.
- `<textarea>`.
- Horizontal scrolling of tables inside `Markdown`.
- The page's own scrollbar (`body`).

These keep the native scrollbar.

## Your own scroll containers

Reach for [`ScrollableArea`](/en/components/scrollable-area) first. It already comes with an accessible name, keyboard focus and overflow detection, and inside a provider it gets the custom scrollbar for free.

Use `useScrollbars` only when you already have a hand-written scroll container and do not want to move to `ScrollableArea`. Pass it the element's ref:

```vue
<script setup lang="ts">
import { useScrollbars } from '@astryx-vue/core/Scrollbars'
import { shallowRef } from 'vue'

const el = shallowRef<HTMLElement | null>(null)
const { active } = useScrollbars(el)
</script>

<template>
  <div ref="el" class="feed">
    <!-- long content -->
  </div>
</template>

<style scoped>
.feed {
  height: 240px;
  overflow: auto;
}
</style>
```

A few things to know:

- The container itself is the scrolling viewport. Its children are not moved. The hook only appends two extra `div`s at the end of the container for the scrollbars.
- With no `ScrollbarsProvider` above it, `useScrollbars` does nothing and `active` stays `false`.
- The scrollbar follows whatever `overflow` the container has. Making it scrollable is up to you.
- Call `useScrollbars` in a **descendant** of `ScrollbarsProvider`. Calling it in the same component that renders the provider will not find it.

## Turning it off locally

To keep native scrollbars on just one part, pick the scope you need.

**One `ScrollableArea`:**

```vue
<ScrollableArea label="Logs" :height="240" :scrollbars="false">
  ...
</ScrollableArea>
```

**One subtree.** Nest another provider. The inner one wins:

```vue
<ScrollbarsProvider>
  <Main />
  <ScrollbarsProvider :enabled="false">
    <Sidebar />
  </ScrollbarsProvider>
</ScrollbarsProvider>
```

**One of your own containers.** Pass `enabled` to `useScrollbars`. It can be a boolean, a ref or a getter:

```ts
const { active } = useScrollbars(el, { enabled: () => props.fancy })
```

If the outer provider is off, `true` here does not turn it on.

## Changing the look

The look is driven by CSS variables. They all have defaults that follow the theme tokens, so light and dark need no extra work.

<div class="component-api-table" role="region" aria-label="Scrollbar CSS variables" tabindex="0">
<table><thead><tr><th>Variable</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>--astryx-scrollbar-size</code></td><td><code>10px</code></td><td>Scrollbar thickness, including 2px of padding on each side.</td></tr>
<tr><td><code>--astryx-scrollbar-thumb</code></td><td>Secondary text color at 45%</td><td>Thumb color.</td></tr>
<tr><td><code>--astryx-scrollbar-thumb-hover</code></td><td>Secondary text color at 70%</td><td>Thumb color on hover and while dragging.</td></tr>
<tr><td><code>--astryx-scrollbar-track</code></td><td><code>transparent</code></td><td>Track background.</td></tr>
<tr><td><code>--astryx-scrollbar-radius</code></td><td><code>9999px</code></td><td>Corner radius of the track and the thumb.</td></tr>
</tbody></table>
</div>

To change it site-wide, put the values in the `astryx.overrides` layer:

```css
@layer astryx.overrides {
  :root {
    --astryx-scrollbar-size: 12px;
    --astryx-scrollbar-thumb: color-mix(in srgb, var(--astryx-color-text-primary) 35%, transparent);
    --astryx-scrollbar-radius: 4px;
  }
}
```

You can set these variables on any ancestor, so to change just one area, set them in that area's selector. You can also put them in the variables of a [`Theme`](/en/components/theme) so they switch with it. More on variables in [CSS variables](/en/themes/css-variables).

### Changing behavior with options

`options` goes to OverlayScrollbars as is. It is deep-merged and has the highest priority, so it even overrides `autoHide`.

```vue
<ScrollbarsProvider
  :options="{
    scrollbars: {
      clickScroll: 'instant',
      visibility: 'visible',
    },
  }"
>
  <App />
</ScrollbarsProvider>
```

- `clickScroll: 'instant'`: clicking the track jumps the viewport there. Off by default. The animated variant (`true`) also needs OverlayScrollbars' `ClickScrollPlugin` registered.
- `visibility: 'visible'`: the scrollbar is always shown. The default is `'auto'`, which shows it only when content overflows.

See the [OverlayScrollbars docs](https://kingsora.github.io/OverlayScrollbars/) for the full option list.

## Notes

- **Server rendering**: the first paint shows native scrollbars. They swap to the custom ones after the page mounts, so you may see a brief style change on load.
- **macOS**: the system default is "Show scroll bars: when scrolling", so native scrollbars there are already overlay ones. After the swap, the main difference is a consistent look across platforms.
- **Reduced motion**: when the user's system asks for reduced motion, scrollbar transitions are turned off.
- **Keyboard, touch and screen readers**: no change. The element that scrolls is still the original one. The scrollbar is only drawn on top of it.
- **No provider**: nothing happens, and no extra code is loaded.
