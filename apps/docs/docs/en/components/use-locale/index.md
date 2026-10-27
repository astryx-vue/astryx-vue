---
layout: component-docs
title: useLocale
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Reads the authoritative Astryx locale. Use it to thread the provider locale into pure formatting helpers and sibling-package APIs; do not derive a second locale from `navigator.language` or a hardcoded literal.

```ts
import { useLocale } from '@astryx-vue/core/locale'
```

The returned `locale` is a computed string, so the template unwraps it and any `watch` or `computed` follows the provider when it switches language. Tags are normalized on the way out: `zh`, `zh-CN`, and `zh-Hans` read as `zh-CN`, and every other tag keeps its region with canonical casing, so `en-gb` reads as `en-GB`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass the returned locale to pure Astryx helpers or package APIs that require an explicit locale. |
| <Badge variant="error">Don't</Badge> | Use `navigator.language` or a hardcoded display locale as a fallback; `InternationalizationProvider` is the locale source. |
