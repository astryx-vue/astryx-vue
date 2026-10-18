<script setup lang="ts">
import { ChatLayoutScrollButton } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text type="supporting" color="secondary">
        Hidden (user is at bottom)
      </Text>
      <ChatLayoutScrollButton :is-visible="false" />
    </VStack>
    <VStack :gap="1">
      <Text type="supporting" color="secondary">
        Visible (user scrolled up)
      </Text>
      <ChatLayoutScrollButton is-visible />
    </VStack>
    <VStack :gap="1">
      <Text type="supporting" color="secondary">
        Expanded with label (new messages arrived)
      </Text>
      <ChatLayoutScrollButton is-visible label="New messages" />
    </VStack>
  </VStack>
</template>
