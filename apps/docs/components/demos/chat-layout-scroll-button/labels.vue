<script setup lang="ts">
import { ChatLayoutScrollButton } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4">
    <Text type="supporting" color="secondary">
      Labels expand the button to give context
    </Text>
    <VStack :gap="3">
      <ChatLayoutScrollButton is-visible />
      <ChatLayoutScrollButton is-visible label="New messages" />
      <ChatLayoutScrollButton is-visible label="3 unread replies" />
    </VStack>
  </VStack>
</template>
