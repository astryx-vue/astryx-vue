<script setup lang="ts">
import { oneDarkPro, SyntaxTheme, useSyntaxTheme } from '@astryx-vue/core/Code'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineComponent, h } from 'vue'

// A canvas or SVG cannot read the CSS variables SyntaxTheme sets, so it asks
// the hook for the keyword color. Outside a SyntaxTheme the hook returns null.
const KeywordSwatch = defineComponent(() => {
  const syntax = useSyntaxTheme()
  return () => {
    if (syntax === null)
      return null
    return h(HStack, { gap: 2, align: 'center' }, () => [
      h('span', {
        'aria-hidden': 'true',
        'style': { width: '16px', height: '16px', borderRadius: '4px', background: syntax.token('keyword') },
      }),
      h(Text, { type: 'supporting' }, () => `keyword ${syntax.token('keyword')}`),
    ])
  }
})
</script>

<template>
  <SyntaxTheme :theme="oneDarkPro">
    <KeywordSwatch />
  </SyntaxTheme>
</template>
