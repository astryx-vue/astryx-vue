<script setup lang="ts">
import type { ChatComposerTokenCustom } from '@astryx-vue/core/Chat'
import { ChatComposerTokenElement } from '@astryx-vue/core/Chat'
import { HStack } from '@astryx-vue/core/Stack'
import { h } from 'vue'

const file: ChatComposerTokenCustom = {
  value: 'design-spec.pdf',
  render: () => h('span', { class: 'chat-preview__file' }, 'design-spec.pdf'),
}

const mention: ChatComposerTokenCustom = {
  value: '@ada',
  render: () => h('strong', null, 'Ada Lovelace'),
}
</script>

<template>
  <HStack align="center" :gap="2" wrap="wrap">
    <ChatComposerTokenElement :token="file" />
    <ChatComposerTokenElement :token="mention" />
  </HStack>
</template>
