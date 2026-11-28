---
title: NavigationStack
---

# NavigationStack

Drill-down navigation for phone layouts: each screen pushes the next on top, and Back, or a back swipe from the screen edge or from anywhere in the content, returns to the previous one. Pushes, pops and the back swipe move like iOS: the new screen slides in from the trailing edge over the old one, which slides a third as far under a light dimming, and a released swipe finishes or springs back depending on how far and how fast it went. A push never waits for its animation: the new screen is usable as soon as it starts sliding in. With Reduce Motion the screens cross-fade instead.

<script setup lang="ts">
import { labNavigationStack } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labNavigationStack" description="A settings menu: the root screen uses a large title, and two levels down a Done button at the end of the bar goes straight back to the root. On a phone, swipe right anywhere in the content to go back." locale="en" title="Settings menu" /></ClientOnly>

## Import

```ts
import { NavigationScreen, NavigationStack, useNavigationStack } from '@astryx-vue/lab'
```

## Structure

You own the path: `path` holds the entries pushed on the root screen, bottom first. The `root` slot renders the root screen and the `screen` slot renders one screen per entry; both return a `NavigationScreen`. Components inside a screen push and pop with `useNavigationStack()`.

```vue
<script setup lang="ts">
const path = ref<string[]>([])
</script>

<template>
  <NavigationStack v-model:path="path" label="Settings" :get-key="entry => entry">
    <template #root>
      <NavigationScreen title="Settings" title-display-mode="large">
        <SettingsList />
      </NavigationScreen>
    </template>
    <template #screen="{ entry }">
      <NavigationScreen :title="entry">
        <SettingsDetail :name="entry" />
      </NavigationScreen>
    </template>
  </NavigationStack>
</template>
```

Covered screens stay alive with their scroll positions, and are `inert`: out of reach for the pointer and for assistive technology. Screens more than two levels down stop rendering until they are revealed again.

## Motion

| Action | What it does |
| --- | --- |
| Push | The new screen slides in from the trailing edge; the old one slides a third as far under a 10% black dimming. Each title in the bar moves with its own screen; on a push from the root, the Back button fades in 60ms later. |
| Pop | The reverse: the top screen slides out and the one underneath comes back from under the dimming. |
| Back swipe | The screen follows the finger. On release it pops past half the width, or when flung back fast enough, and springs back otherwise; pulling the other way meets rubber-band resistance. |
| Reduce Motion | No sliding and no dimming: a cross-fade after a touch, an immediate change otherwise. |

Durations and springs read the theme's motion tempo, `--_astryx-motion-tempo`, so a slower or faster theme slows or speeds the navigation too.

## Focus

A push moves focus to the new screen's title, unless the person has already moved focus into that screen (say, by tapping one of its fields before the slide ends). A pop returns focus to the control that pushed the screen, or to the screen's title when that control is gone. Focus only moves when it was in the stack or lost; it is never taken from elsewhere on the page.

## Bar

The bar shows the top screen's title, its `endContent` and a round Back button whose accessible name is the title of the screen it returns to. With a mouse the bar keeps its surface and hairline. Under a finger it paints neither, as iOS 26's does, letting the content show through; once a screen's content has moved 10px under the bar, a veil of the body colour fades in at the top of that screen to keep the title readable.

## Back swipe

While `isInteractivePopEnabled` is on (the default), a sideways drag anywhere in the content pops, under any pointer: a finger, a pen or a mouse drag. In a web app opened from the home screen, a finger's swipe from the leading screen edge pops too; in a browser tab that edge stays the browser's own back swipe.

## NavigationStack

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `readonly T[]` | required | The entries pushed on the root, bottom first. Adding one at the end pushes its screen; removing the last pops it; removing several pops straight back to the new top. Use with `v-model:path`. |
| `getKey` | `(entry: T, index: number) => string \| number` | the entry's position | A stable key per entry, so a screen keeps its state while others are pushed on it. |
| `isInteractivePopEnabled` | `boolean` | `true` | Whether the back swipe pops. |
| `label` | `string` | `undefined` | Accessible name of the navigator region. |

| Event | Payload | Description |
| --- | --- | --- |
| `update:path` | `(path: T[])` | The new path, when a screen pushes or pops, Back is pressed, or a back swipe is released past the point of no return. |

| Slot | Props | Description |
| --- | --- | --- |
| `root` | — | The root screen, a `NavigationScreen`. It has no Back button. |
| `screen` | `{ entry: T, index: number }` | The screen for an entry, a `NavigationScreen`. |

## NavigationScreen

One screen of a `NavigationStack`. It renders nothing on its own; it tells the stack the screen's title, content and bar content.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | required | Shown in the bar while the screen is on top, and read first when it arrives. |
| `backTitle` | `string` | `title` | What Back reads on the screen pushed on top of this one. |
| `titleDisplayMode` | `'large' \| 'inline'` | `'inline'` | `'large'` puts the title above the content in a large bold type, scrolling with the content; once it has scrolled under the bar, the bar shows the title instead. Use it for a top-level screen, as iOS does. |

| Slot | Description |
| --- | --- |
| `default` | The screen's content. It scrolls on its own and keeps its scroll position while covered. |
| `endContent` | Content at the end of the bar while the screen is on top. |

## useNavigationStack

Call it inside a screen of a `NavigationStack`. It returns `push(entry)`, `pop()`, `popToRoot()` and the current `depth` (0 on the root screen). Calling it outside a stack throws.

## Best practices

- Use it for hierarchical drill-down on phones: lists of settings, folders, a list and its detail.
- Keep the path in the app's state (or the URL) and give entries stable keys, so screens keep their state as the stack changes.
- Push from the control the person activated (a row's click handler): focus returns to it when the screen is popped.
- Don't use it for top-level sections people switch between; those are tabs or a sidebar, which keep each section's own stack.
