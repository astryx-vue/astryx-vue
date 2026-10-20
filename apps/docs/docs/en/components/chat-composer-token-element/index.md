---
layout: component-docs
title: Chat Composer Token Element
outline: false
footer: false
---

<script setup lang="ts">
import { chatComposerTokenElementBadge, chatComposerTokenElementCustom } from '../../../../components/demos/chat-composer-token-element'
</script>

## Usage

Renders a single token chip outside the contentEditable input. Wraps a badge config or custom render function in the correct `data-astryx-token` span so the token serializes properly and stays visually consistent with tokens inside the composer.

```ts
import { ChatComposerTokenElement } from '@astryx-vue/core/Chat'
```

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatComposerTokenElementBadge"
  description="Badge tokens outside the editor. Each one keeps the value the composer would serialize, so a chip copied out of the draft and a chip rendered elsewhere read the same."
  locale="en"
  title="ChatComposerTokenElement — Badge tokens"
/>

<DemoExample
  :demo="chatComposerTokenElementCustom"
  description="Custom rendering for a chip that needs its own markup. The value is still what goes into the submitted draft."
  locale="en"
  title="ChatComposerTokenElement — Custom tokens"
/>
