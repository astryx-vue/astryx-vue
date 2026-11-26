---
layout: component-docs
title: useCollator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCollatorNameSort } from '../../../../components/demos/use-collator'
</script>

## Usage

Returns the sanctioned locale-aware comparator for custom sorting. The collator is recreated when the provider locale or an option changes.

```ts
import { useCollator } from '@astryx-vue/core/locale'
```

```ts
const collator = useCollator({ numeric: true })

const sorted = computed(() => [...items.value].sort((a, b) => collator.value.compare(a, b)))
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Reuse `collator.value.compare` in custom Table comparators and other user-visible string ordering. |
| <Badge variant="error">Don't</Badge> | Construct `Intl.Collator` directly or call `localeCompare`; those bypass the provider-backed locale contract. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useCollatorNameSort"
  description="A list of names sorted with the compare function from useCollator: accented and lowercase names land where a reader expects, and switching the provider locale to Swedish moves Å and Ö after Z."
  locale="en"
  title="useCollator — Locale-aware Name Sort"
/>
