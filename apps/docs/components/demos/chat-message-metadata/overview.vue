<script setup lang="ts">
import { useClipboard } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const message = 'The canary at 11:42 AM caused a memory spike. Rolled back at 11:58 AM.'

const showToast = useToast()
const { copy } = useClipboard()

function copyMessage(): void {
  void copy(message).then(copied => showToast({ body: copied ? 'Copied' : 'Could not copy' }))
}
</script>

<template>
  <VStack style="max-width: 600px">
    <ChatMessageList>
      <ChatMessage sender="assistant">
        <ChatMessageBubble>
          Sorry, something went wrong on my end.
          <template #metadata>
            <ChatMessageMetadata status="error">
              <template #timestamp>
                <Timestamp value="2026-03-15T14:30:00" format="time" />
              </template>
              <template #footer>
                <HStack :gap="1">
                  <Button
                    label="Retry"
                    variant="ghost"
                    size="sm"
                    is-icon-only
                    @click="showToast({ body: 'Demo: the answer would be generated again here' })"
                  >
                    <template #icon>
                      <Icon icon="i-heroicons-arrow-path" size="sm" />
                    </template>
                  </Button>
                </HStack>
              </template>
            </ChatMessageMetadata>
          </template>
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          No worries — try again with just the last 24 hours of logs.
          <template #metadata>
            <ChatMessageMetadata status="read">
              <template #timestamp>
                <Timestamp value="2026-03-15T14:31:00" format="time" />
              </template>
            </ChatMessageMetadata>
          </template>
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble>
          {{ message }}
          <template #metadata>
            <ChatMessageMetadata>
              <template #timestamp>
                <Timestamp value="2026-03-15T14:32:00" format="time" />
              </template>
              <template #footer>
                <HStack :gap="1">
                  <Button label="Copy" variant="ghost" size="sm" is-icon-only @click="copyMessage">
                    <template #icon>
                      <Icon icon="i-heroicons-clipboard-document" size="sm" />
                    </template>
                  </Button>
                  <Button
                    label="Retry"
                    variant="ghost"
                    size="sm"
                    is-icon-only
                    @click="showToast({ body: 'Demo: the answer would be generated again here' })"
                  >
                    <template #icon>
                      <Icon icon="i-heroicons-arrow-path" size="sm" />
                    </template>
                  </Button>
                  <Button
                    label="Good response"
                    variant="ghost"
                    size="sm"
                    is-icon-only
                    @click="showToast({ body: 'Demo: your thumbs-up would be sent here' })"
                  >
                    <template #icon>
                      <Icon icon="i-heroicons-hand-thumb-up" size="sm" />
                    </template>
                  </Button>
                  <Button
                    label="Bad response"
                    variant="ghost"
                    size="sm"
                    is-icon-only
                    @click="showToast({ body: 'Demo: your thumbs-down would be sent here' })"
                  >
                    <template #icon>
                      <Icon icon="i-heroicons-hand-thumb-down" size="sm" />
                    </template>
                  </Button>
                  <Text type="supporting" color="secondary">
                    Claude Opus 4.6
                  </Text>
                </HStack>
              </template>
            </ChatMessageMetadata>
          </template>
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  </VStack>
  <ToastViewport />
</template>
