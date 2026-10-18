---
layout: component-docs
title: useTranslator
outline: false
footer: false
---

## Usage

Returns a translator function that resolves keys against the current locale, provider overrides, and the shipped English fallback catalog. Call inside a component; the returned function can be used anywhere within that component's scope.

```ts
import { useTranslator } from '@astryx-vue/core/locale'
```

The key is an upstream message key such as `@astryx.pagination.next`. Placeholder values are passed in order and formatted with the active locale's rules, so plural forms and number grouping follow that language. A key that has no slot in this package comes back unchanged, which makes a missing key visible instead of blank. `t` reads the provider on every call, so one translator keeps working after the provider switches language.
