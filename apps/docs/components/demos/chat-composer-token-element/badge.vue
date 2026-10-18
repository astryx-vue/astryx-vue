<script setup lang="ts">
import type { ChatComposerToken } from '@astryx-vue/core/Chat'
import { ChatComposerTokenElement } from '@astryx-vue/core/Chat'
import { HStack } from '@astryx-vue/core/Stack'

const tokens: ChatComposerToken[] = [
  { value: '@cindy', label: 'Cindy Zhang', variant: 'blue', icon: 'carbon:user' },
  { value: '/summarize', label: '/summarize', variant: 'yellow' },
  { value: '#design-system', label: '#design-system', variant: 'purple' },
  { value: 'done', label: 'Done', variant: 'success', icon: 'check' },
]
</script>

<template>
  <HStack align="center" :gap="2" wrap="wrap">
    <ChatComposerTokenElement
      v-for="token in tokens"
      :key="token.value"
      :token="token"
    />
  </HStack>
</template>
