---
layout: component-docs
title: useDevWarning
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Fires a dev-only "Component: message" console warning once per mount while the condition holds. It is the safe way for a component to flag misuse: the same check written straight into a `computed` getter or a `watch` callback repeats on every change, and gating it with state adds a re-render, so this watches the condition instead and warns once. For a warning outside a component, use the imperative `devWarn` utility.

```ts
import { useDevWarning } from '@astryx-vue/core'
```

`devWarn` comes from the same entry: `import { devWarn } from '@astryx-vue/core'`. It writes the same `Component: message` line without needing a component instance, and it is stripped from production builds the same way.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Say what is wrong and what the builder should do instead; the message is the whole value of the warning. |
| <Badge variant="success">Do</Badge> | Warn about combinations the types cannot express, such as two mutually exclusive props being set together. |
| <Badge variant="error">Don't</Badge> | Use it for anything a user could see or for runtime error handling; it is stripped from production builds. |
