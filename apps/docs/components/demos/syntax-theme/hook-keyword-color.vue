<script setup lang="ts">
import { githubLight, SyntaxTheme, useSyntaxTheme } from '@astryx-vue/core/Code'
import { defineComponent, h } from 'vue'

/** 用 useSyntaxTheme 读出周围语法主题的关键字颜色，给一个词上色。 */
const Keyword = defineComponent({
  setup() {
    const syntax = useSyntaxTheme()
    return () => syntax == null
      ? null
      : h('svg', { 'width': 120, 'height': 40, 'role': 'img', 'aria-label': 'Keyword color' }, [
          h('text', { x: 0, y: 28, direction: 'ltr', fill: syntax.token('keyword'), fontSize: 24 }, 'const'),
        ])
  },
})
</script>

<template>
  <SyntaxTheme :theme="githubLight">
    <Keyword />
  </SyntaxTheme>
</template>
