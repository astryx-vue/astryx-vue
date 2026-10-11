<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { useDemoText } from '../../demo-infra/useDemoText'
import { richSample } from './meta'

const { pick } = useDemoText()
</script>

<template>
  <Markdown :content="pick(richSample.zh, richSample.en)" />
</template>
