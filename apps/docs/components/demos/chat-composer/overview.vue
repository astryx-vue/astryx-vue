<script setup lang="ts">
import { ChatComposer } from '@astryx-vue/core/Chat'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="vertical" :width="450" max-width="100%">
    <ChatComposer placeholder="Type a message…" />
  </Stack>
</template>
