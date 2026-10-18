<script setup lang="ts">
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatComposer is-disabled>
    <template #input>
      <ChatComposerInput is-disabled placeholder="Input is disabled" />
    </template>
  </ChatComposer>
</template>
