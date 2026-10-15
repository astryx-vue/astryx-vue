<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const sources = {
  abc1: {
    title: 'Tokyo - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Tokyo',
  },
  def2: {
    title: 'Japan Statistics Bureau - Population',
    url: 'https://www.stat.go.jp/english/',
  },
}

const content = [
  'Tokyo is the capital of Japan[abc1].',
  'The metro area is larger still[def2][abc1].',
].join('\n\n')
</script>

<template>
  <Markdown
    :content="content"
    citation-style="number"
    density="compact"
    :sources="sources"
  />
</template>
