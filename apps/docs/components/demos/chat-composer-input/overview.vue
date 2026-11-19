<script setup lang="ts">
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="vertical" :width="450" max-width="100%">
    <ChatComposer>
      <template #input>
        <ChatComposerInput placeholder="Ask me anything about Astryx..." />
      </template>
    </ChatComposer>
  </Stack>
</template>
