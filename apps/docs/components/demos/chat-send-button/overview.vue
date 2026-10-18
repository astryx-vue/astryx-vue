<script setup lang="ts">
import { ChatSendButton } from '@astryx-vue/core/Chat'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="3">
    <ChatSendButton is-disabled />
    <ChatSendButton />
    <ChatSendButton is-stop-shown />
  </HStack>
</template>
