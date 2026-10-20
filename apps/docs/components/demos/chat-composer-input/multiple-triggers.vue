<script setup lang="ts">
import type { ChatComposerTrigger } from '@astryx-vue/core/Chat'
import { createStaticSource } from '@astryx-vue/core'
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const users = [
  { id: 'cindy', label: 'Cindy Zhang' },
  { id: 'alex', label: 'Alex Johnson' },
  { id: 'sam', label: 'Sam Rivera' },
  { id: 'jordan', label: 'Jordan Lee' },
]

const commands = [
  { id: 'summarize', label: 'summarize' },
  { id: 'translate', label: 'translate' },
  { id: 'search', label: 'search' },
  { id: 'code', label: 'code' },
]

const userSource = createStaticSource(users)
const commandSource = createStaticSource(commands)

const value = ref('')

const mentionTrigger: ChatComposerTrigger = {
  character: '@',
  searchSource: userSource,
  onSelect: item => ({
    value: `@${item.id}`,
    label: item.label,
    variant: 'blue',
  }),
}

const commandTrigger: ChatComposerTrigger = {
  character: '/',
  searchSource: commandSource,
  onSelect: item => ({
    value: `/${item.label}`,
    label: `/${item.label}`,
    variant: 'yellow',
  }),
}
</script>

<template>
  <VStack :gap="3">
    <Text type="supporting" color="secondary">
      Type @ for mentions (blue) or / for commands (yellow)
    </Text>
    <ChatComposer @submit="value = ''">
      <template #input>
        <ChatComposerInput
          v-model="value"
          :triggers="[mentionTrigger, commandTrigger]"
          placeholder="Type @ or / ..."
        />
      </template>
    </ChatComposer>
    <Text type="supporting" color="secondary">
      Value: {{ JSON.stringify(value) }}
    </Text>
  </VStack>
</template>
