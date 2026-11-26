---
layout: component-docs
title: useTranslator
outline: false
footer: false
---

<script setup lang="ts">
import { useTranslatorLoadMore } from '../../../../components/demos/use-translator'
</script>

## Usage

Returns a translator function that resolves keys against the current locale, provider overrides, and the shipped English fallback catalog. Call inside a component; the returned function can be used anywhere within that component's scope.

```ts
import { useTranslator } from '@astryx-vue/core/locale'
```

The key is an upstream message key such as `@astryx.pagination.next`. Placeholder values are passed in order and formatted with the active locale's rules, so plural forms and number grouping follow that language. A key that has no slot in this package comes back unchanged, which makes a missing key visible instead of blank. `t` reads the provider on every call, so one translator keeps working after the provider switches language.

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useTranslatorLoadMore"
  description="A &quot;Show more&quot; footer under a list that gets its button label and its &quot;1–3 of 9&quot; count from the translator useTranslator returns, so switching the provider between English and Chinese changes both strings."
  locale="en"
  title="useTranslator — Load More Footer"
/>
