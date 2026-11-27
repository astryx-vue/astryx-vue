---
title: TabBar
---

# TabBar

The bottom tab bar of a phone app, as on iOS 26: the app's top-level sections as a floating capsule above the bottom edge, with a selection lens that slides to the chosen tab. Each tab has an icon, a label and an optional badge.

Under a finger, on iOS and Android alike, it behaves like iOS 26's: the lens lifts into glass as a finger lands, follows a finger dragged across the tabs and settles on the tab nearest where it lifts, while the bar flexes. Under a mouse, a press is a plain button press: a click chooses a tab and the lens follows the theme's motion. With no tab selected, a held finger highlights the tab under it. Choosing the selected tab again scrolls its panel to the top and is reported separately, so a screen can also return to its root as iOS does. With more than five tabs the bar shows the first four and a More tab, and `TabBarMoreList` lists the rest.

<script setup lang="ts">
import { labTabBar } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labTabBar" description="Six sections: the bar shows the first four and More, which lists the other two. Inbox carries a badge; choosing the selected tab again scrolls its content to the top. On a phone, hold the capsule and drag across it." locale="en" title="Six sections" /></ClientOnly>

## Import

```ts
import { TabBar, TabBarItem, TabBarMoreList } from '@astryx-vue/lab'
```

## Structure

You own the selection: bind the selected tab's `value` with `v-model`. Write the tabs, in order, as `TabBarItem` elements; they render nothing themselves and only hand the tab's details to TabBar.

```vue
<script setup lang="ts">
const selected = ref('home')
</script>

<template>
  <TabBar v-model="selected" label="Sections" @reselect="backToRoot">
    <TabBarItem value="home" label="Home" icon="i-heroicons-home" selected-icon="i-heroicons-home-solid" panel-id="home-panel" />
    <TabBarItem value="inbox" label="Inbox" icon="i-heroicons-inbox" :badge="3" badge-label="3 unread" panel-id="inbox-panel" />
    <TabBarItem value="profile" label="Profile" icon="i-heroicons-user" panel-id="profile-panel" />
  </TabBar>
</template>
```

The bar sits fixed at the bottom of the viewport, over the page, so leave 83 px of room at the bottom of the scrolling content, and declare it on `LayerProvider` (`:inset="{ blockEnd: 83 }"`) so menus, popovers and toasts clear it.

## Motion

| Action | Effect |
| --- | --- |
| Finger down | The lens travels toward the finger and lifts: it grows, turns to glass and magnifies the icons inside; the capsule flexes. |
| Finger drag | The lens tracks the finger closely, rubber-banding past the first and last tab. |
| Finger up | The tab nearest the finger is chosen and the lens settles on it while the lift and flex relax. Lifting outside the bar returns the lens to the selected tab and chooses nothing. |
| Key or code changes the selection | The lens slides from where it was to the new tab. |
| Mouse click | The lens slides on the theme's `--astryx-duration-medium` and `--astryx-ease-standard`. |
| Held with nothing selected | The tab under the finger is highlighted at once, and fades on the theme's exit duration on release. |
| Reduce Motion | No scaling: the lens under a finger jumps to the finger, the lifted look shows at once and fades only on release; a selection changed by a key or by code cross-fades, and under a mouse the lens jumps. The held highlight fades in 200 ms at most. |

Every spring (the lens's travel, tracking, settling and lift, and the capsule's flex) uses values measured on iOS 26.2.

## Disabled tabs

As on Core's `Tab`, a disabled tab stays focusable but dimmed and is never chosen: a tap, a click or a key on it, or a lift over it, selects nothing, and the arrow keys skip it. A finger that lands on it lifts no lens until it drags or reaches an enabled tab, which the lift then chooses. This differs from iOS on purpose: iOS ignores a touch that starts on a disabled tab, but TabBar follows the rule that the tab you lift on acts.

## The More tab

With more than five tabs, the bar shows the first four and More. Choosing More sets `v-model` to `moreValue` (`'more'` by default); More reads as selected while the value is `moreValue` or any tab past the fourth. Render `TabBarMoreList` while the value is `moreValue`, and show a section chosen there inside More's own navigation stack.

## TabBar

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | required | The selected tab's `value`. Use with `v-model`. |
| `label` | `string` | `undefined` | Names the tab bar for assistive technology. Without it, `ariaLabel` or `ariaLabelledby`, the tab list is named "Tabs" in the reader's language. |
| `ariaLabel` | `string` | `undefined` | Names the tab list, winning over `label`. |
| `ariaLabelledby` | `string` | `undefined` | Names the tab list with another element, winning over both. |
| `moreValue` | `string` | `'more'` | The More tab's value, with more than five tabs. |

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: string)` | A different tab is chosen: a finger lifted over it (after a tap or a drag across the bar), a click, or Enter or Space on a focused tab. |
| `change` | `(value: string)` | Fires with `update:modelValue`. |
| `reselect` | `(value: string)` | The selected tab is chosen again, for example to return its navigation stack to its root. Its panel (`panelId`) also scrolls to the top every time. More chosen again while it holds a tab is a `reselect` too, to return to its list. |

| Slot | Description |
| --- | --- |
| `default` | The tabs: `TabBarItem` elements, in order. |

## TabBarItem

One tab. TabBar reads its props and draws it; it renders nothing on its own.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | required | Identifies the tab in `modelValue`, `change` and `reselect`. |
| `label` | `string` | required | The tab's name, shown under its icon. Keep it to one short word. |
| `icon` | `string \| Component \| () => VNode` | `undefined` | The tab's icon: an icon name, a CSS icon class, a component or a render function. Drawn in the current text colour, and in the accent colour while selected. |
| `selectedIcon` | same as `icon` | `icon` | The icon while the tab is selected, typically its filled variant. |
| `badge` | `string \| number` | `undefined` | A badge over the icon's top-trailing corner: a count or a short string such as "!". It appears, changes and disappears without animating. Omit it or pass an empty string for none. |
| `badgeLabel` | `string` | the badge | What assistive technology reads for the badge after the tab's label, such as "3 unread". |
| `panelId` | `string` | `undefined` | Id of the panel this tab controls, wired up as `aria-controls`. Choosing the selected tab again scrolls that panel to its top: the panel itself when it scrolls, or else the first vertical scroll area inside it. |
| `disabled` | `boolean` | `false` | Disables the tab; see above. |

## TabBarMoreList

The More tab's screen, as on iOS: one row per tab past the fourth, with its icon, its label, its badge and a disclosure chevron. Give it the same `TabBarItem` children as TabBar; a disabled tab's row is disabled too. Rearranging the tabs (iOS's Edit) is not available yet.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `undefined` | The selected tab's value: its row reads as selected. Use with `v-model`. |

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: string)` | A row is chosen: show that section inside More, which stays selected in the bar. |
| `change` | `(value: string)` | Fires with `update:modelValue`. |

| Slot | Description |
| --- | --- |
| `default` | The same `TabBarItem` elements given to TabBar. |

## Best practices

- Use it to switch between an app's three to five top-level sections on a phone, each keeping its own state and navigation stack; return a section's stack to its root in `reselect`.
- Keep every tab visible and the set stable; give each a short label and an outline icon with a filled `selectedIcon`.
- Keep to five tabs where you can; with more, put the sections people use most first, since the rest move into More.
- Use a badge for something that needs attention in that section, such as unread items, and say what it counts in `badgeLabel`.
- Give each tab a `panelId` naming its section's panel, and put the section's content in a scroll area inside it, so choosing the tab again scrolls it to the top.
- Disable a tab only while its section cannot open, and keep it in place, so the other tabs do not move.
- Don't use it for actions, for filters within one screen (use `SegmentedControl`) or for tabs inside a page (use `TabList`).
