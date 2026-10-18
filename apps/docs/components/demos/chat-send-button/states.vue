<script setup lang="ts">
import { ChatSendButton } from '@astryx-vue/core/Chat'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="2">
    <Text type="supporting" color="secondary">
      Disabled → Ready → Streaming
    </Text>
    <HStack align="center" :gap="3">
      <ChatSendButton is-disabled />
      <ChatSendButton :is-disabled="false" />
      <ChatSendButton is-stop-shown />
    </HStack>
  </VStack>
</template>
