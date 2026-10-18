---
layout: component-docs
title: Link Provider
outline: false
footer: false
---

<script setup lang="ts">
import { linkProviderOverview } from '../../../../components/demos/link-provider'
</script>

## Usage

Wraps your app to replace the default `<a>` tag with a framework-specific link component (e.g. Vue Router's `RouterLink`) for client-side routing across all Astryx components.

```ts
import { LinkProvider } from '@astryx-vue/core/LinkProvider'
```

The component receives `href` and `to`, so a router link can read whichever one it expects. A single component's own `as` prop still wins over the provider. `useLinkComponent()` reads the provider from a descendant when you render a link yourself.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="linkProviderOverview" title="Link Provider — Custom Link Component" description="Routes every Astryx link through a custom component that intercepts the click, the hook frameworks like Vue Router use for client-side navigation. Click the link to see the custom handler fire instead of a full-page load." locale="en" />
