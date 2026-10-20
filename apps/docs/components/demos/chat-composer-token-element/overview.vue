<script setup lang="ts">
import { ChatComposerTokenElement } from '@astryx-vue/core/Chat'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="2">
    <ChatComposerTokenElement :token="{ value: '@ada', label: 'Ada Lovelace', variant: 'blue' }" />
    <ChatComposerTokenElement :token="{ value: '/summarize', label: '/summarize', variant: 'yellow' }" />
  </HStack>
</template>
