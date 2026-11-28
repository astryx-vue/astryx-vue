---
title: useRefreshControl
---

# useRefreshControl

Pull to refresh for an app's own scroll container, modelled on iOS's UIRefreshControl. Pull the content down past its top to reveal the indicator above it. Past the trigger, the refresh starts while the finger is still down. On release the content rests below the indicator, and slides back to the top when the refresh ends.

A finger pulls, and so does a trackpad's two-finger scroll at the top. A mouse or pen drag stays the browser's for text selection, and a mouse wheel's notches never pull.

<script setup lang="ts">
import { labRefreshControl } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labRefreshControl" description="On a phone, pull the list past its top, or scroll down with two fingers on a trackpad. The button refreshes too." locale="en" title="Pull to refresh" /></ClientOnly>

## Import

```ts
import { REFRESH_REVEAL_VAR, useRefreshControl } from '@astryx-vue/lab'
```

## Usage

You write the scroll container, the pulled content and the indicator; the hook moves them:

- Bind `contentRef` to the element that wraps the scrolling content. That element is what moves. It must sit in a container that scrolls vertically and overflows; the page's own top edge always stays the browser's.
- Bind `indicatorRef` to the indicator, such as a `Spinner`. The indicator is a 60px band at the bottom of an overflow-hidden box on the content's top edge. The hook moves it against the content, so it stays pinned to the top of the scroll container.
- How much of the indicator the pull reveals (0 to 1) is written to the `REFRESH_REVEAL_VAR` CSS variable, which the indicator can use as its opacity.

```vue
<script setup lang="ts">
const pull = useRefreshControl({
  onRefresh: () => fetchInbox(),
  announce: 'Refreshing',
})
</script>

<template>
  <div style="height: 100%; overflow-y: auto">
    <div :ref="pull.contentRef" style="position: relative" :aria-busy="pull.isRefreshing.value || undefined">
      <InboxList />
      <div style="position: absolute; inset-inline: 0; bottom: 100%; height: 100lvh; overflow: hidden; pointer-events: none">
        <div :ref="pull.indicatorRef" aria-hidden="true" style="position: absolute; inset-inline: 0; bottom: 0; height: 60px; display: flex; align-items: center; justify-content: center">
          <span :style="{ opacity: `var(${REFRESH_REVEAL_VAR}, 0)` }">
            <Spinner size="lg" shade="subtle" label="Refreshing" />
          </span>
        </div>
      </div>
    </div>
  </div>
  <Button label="Refresh" @click="pull.refresh()" />
</template>
```

When `onRefresh` returns a promise, the refresh lasts until it settles (a rejection ends it too). To own the state yourself, pass `isRefreshing`: `true` begins a refresh and `false` ends it, and the hook does not call `onRefresh` for it. A pulled refresh that the parent does not take up ends on the next update.

The pull has no keyboard or screen-reader equivalent, so always offer another way to refresh, such as a button that calls `refresh()`.

## Motion

| Action | Effect |
| --- | --- |
| Pulling down | After a 10px threshold the content tracks the finger one to one up to 60px, then resists more the further it goes. |
| Past the trigger | The trigger is 0.198 × the scroll container's height, at least 73px. The refresh starts with the finger down, and the content tracks one to one again up to 120px past the top. |
| Indicator | The reveal runs from 0 to 1 on `cubic-bezier(0.42, 0, 0.58, 1)` and is complete at the trigger. |
| Release | The content keeps the finger's speed and settles onto the 60px inset, or back to the top, on a critically damped spring (0.5s, no overshoot). Settling to the top fades the indicator along the same curve. |
| Refresh ends | The content slides back to the top over the theme's `--astryx-duration-medium` (300ms by default) on UIKit's default easeInEaseOut. Without that variable it jumps to the top. |
| A finger catches a settle | The settle stops where it is and the indicator keeps what it shows, so the pull or settle carries on from there. |
| Reduced motion | A finger's release cross-fades instead of moving. The indicator does not fade; it resets once the content settles. |

The distances, curves and spring are copied from iOS 26 measurements; only the end's duration follows the theme.

## Options

| Name | Type | Description |
| --- | --- | --- |
| `onRefresh` | `() => unknown` | Called when a pull triggers or on `refresh()`. When it returns a promise (uncontrolled), the refresh lasts until it settles. |
| `isRefreshing` | `MaybeRefOrGetter<boolean \| undefined>` | Controlled refreshing state. Without it, the promise from `onRefresh` decides. |
| `isDisabled` | `MaybeRefOrGetter<boolean \| undefined>` | Turns the pull off. A refresh in progress carries on. |
| `announce` | `MaybeRefOrGetter<string \| undefined>` | Words announced politely when a refresh begins, in the app's language. Nothing is announced without it. |

| Returns | Type | Description |
| --- | --- | --- |
| `contentRef` | `(element: unknown) => void` | Bind to the pulled content. |
| `indicatorRef` | `(element: unknown) => void` | Bind to the indicator. |
| `isRefreshing` | `Readonly<Ref<boolean>>` | Whether a refresh is in progress. |
| `refresh` | `() => void` | Begins a refresh without a pull: the inset appears and the container scrolls with it, so nothing visibly moves. |

## Guidelines

- Use it on lists ordered by time, such as an inbox or a feed: pulling down means "check for new items".
- The container has to scroll: one whose content fits does not pull and leaves scrolling to its ancestors.
- Set `aria-busy` on the content while refreshing so screen readers know it is updating.
