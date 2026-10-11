<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <div>
    <p class="chat-preview__caption">
      {{ pick('来源', 'Sources') }}
    </p>
    <div class="citation-sources">
      <Citation :number="1" :source="{ title: pick('React 文档', 'React Documentation'), url: 'https://react.dev', icon: 'i-carbon-logo-react' }" />
      <Citation :number="2" :source="{ title: pick('TypeScript 手册', 'TypeScript Handbook'), url: 'https://www.typescriptlang.org/docs/', icon: 'i-carbon-code' }" />
      <Citation :number="3" :source="{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: 'i-carbon-document' }" />
      <Citation :number="4" :source="{ title: pick('W3C WAI-ARIA 规范', 'W3C WAI-ARIA Specification'), url: 'https://www.w3.org/TR/wai-aria/', icon: 'i-carbon-catalog' }" />
    </div>
  </div>
</template>
