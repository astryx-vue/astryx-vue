<script setup lang="ts">
import { ChatSendButton } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4">
    <Text type="supporting" color="secondary">
      Custom icons for send and stop states
    </Text>
    <HStack align="center" :gap="4">
      <ChatSendButton :is-disabled="false">
        <template #sendIcon>
          <Icon name="heroicons:paper-airplane-solid" />
        </template>
      </ChatSendButton>
      <ChatSendButton :is-disabled="false">
        <template #sendIcon>
          <Icon name="heroicons:check-solid" />
        </template>
      </ChatSendButton>
      <ChatSendButton :is-disabled="false">
        <template #sendIcon>
          <Icon name="heroicons:sparkles-solid" />
        </template>
      </ChatSendButton>
      <ChatSendButton is-stop-shown>
        <template #stopIcon>
          <Icon name="heroicons:x-circle" />
        </template>
      </ChatSendButton>
    </HStack>
  </VStack>
</template>
