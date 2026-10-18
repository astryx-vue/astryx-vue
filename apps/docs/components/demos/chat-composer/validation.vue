<script setup lang="ts">
import { ChatComposer } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text type="supporting" color="secondary">
        Error message (with top position)
      </Text>
      <ChatComposer
        status-position="top"
        :status="{ type: 'error', message: 'Failed to send message. Please try again.' }"
      />
    </VStack>
    <VStack :gap="1">
      <Text type="supporting" color="secondary">
        Warning message (with bottom position)
      </Text>
      <ChatComposer :status="{ type: 'warning', message: 'Context window is 90% full.' }" />
    </VStack>
  </VStack>
</template>
