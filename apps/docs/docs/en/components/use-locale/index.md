---
layout: component-docs
title: useLocale
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLocaleInvoiceSummary } from '../../../../components/demos/use-locale'
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

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useLocaleInvoiceSummary"
  description="An invoice summary that formats its date and amount with Intl using the locale from useLocale, so switching the provider from English to German changes &quot;Nov 2, 2026&quot; and &quot;$1,234.50&quot; to &quot;2. Nov. 2026&quot; and &quot;1.234,50 $&quot; with no second locale source."
  locale="en"
  title="useLocale — Invoice Summary"
/>
