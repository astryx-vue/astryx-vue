<script setup lang="ts">
import { ChatSendButton } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="horizontal" :gap="3" align="center">
    <ChatSendButton :is-disabled="false" />
    <ChatSendButton :is-disabled="false">
      <template #sendIcon>
        <Icon icon="i-heroicons-sparkles-solid" size="sm" />
      </template>
    </ChatSendButton>
    <ChatSendButton is-stop-shown />
  </Stack>
</template>
