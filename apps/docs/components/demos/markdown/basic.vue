<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { useDemoText } from '../../demo-infra/useDemoText'
import { basicSample } from './meta'

const { pick } = useDemoText()
</script>

<template>
  <Markdown :content="pick(basicSample.zh, basicSample.en)" />
</template>
