---
layout: component-docs
title: Link Provider
outline: false
footer: false
---

<script setup lang="ts">
import { linkProviderHookArticleCard, linkProviderOverview } from '../../../../components/demos/link-provider'
</script>

## Usage

Wraps your app to replace the default `<a>` tag with a framework-specific link component (e.g. Vue Router's `RouterLink`) for client-side routing across all Astryx components.

```ts
import { LinkProvider } from '@astryx-vue/core/LinkProvider'
```

The component receives `href` and `to`, so a router link can read whichever one it expects. A single component's own `as` prop still wins over the provider. `useLinkComponent()` reads the provider from a descendant when you render a link yourself.

### Links in your own components

Read the provider with `useLinkComponent()` so a custom component's links follow the app's router the same way Astryx links do. Fall back to `'a'` outside a provider, and let an explicit `as` win.

```vue
<script setup lang="ts">
import { useLinkComponent } from '@astryx-vue/core/LinkProvider'

const props = defineProps<{ href: string, as?: string | object }>()
const linkComponent = useLinkComponent()
</script>

<template>
  <component :is="props.as ?? linkComponent ?? 'a'" :href="href" :to="href">
    <slot />
  </component>
</template>
```

Pass `as="a"` for a destination the router cannot handle, such as a file download or a page outside the app. Importing the router's link straight into a shared component skips the provider, so that component no longer follows it.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="linkProviderOverview" title="Link Provider — Custom Link Component" description="Routes every Astryx link through a custom component that intercepts the click, the hook frameworks like Vue Router use for client-side navigation. Click the link to see the custom handler fire instead of a full-page load." locale="en" />

<DemoExample :demo="linkProviderHookArticleCard" title="useLinkComponent — Article Card" description="A custom article card reads the link component with useLinkComponent. Inside the provider, its title link is the router link and moves the router location without a page load; as='a' keeps a native anchor inside the provider; outside the provider it falls back to a native anchor." locale="en" />
