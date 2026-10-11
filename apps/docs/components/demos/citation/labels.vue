<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <p class="citation-preview">
    {{ pick('依据', 'See') }}
    <Citation
      :number="1"
      :source="{ title: pick('发布说明', 'Release notes'), url: 'https://example.com/notes' }"
    />
    {{ pick('和', 'and') }}
    <Citation
      :number="2"
      :source="{ title: pick('变更记录', 'Changelog'), url: 'https://example.com/changelog', src: 'https://example.com/favicon.ico' }"
    />
    .
  </p>
</template>
