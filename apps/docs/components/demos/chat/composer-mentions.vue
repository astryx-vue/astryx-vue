<script setup lang="ts">
import type { ChatComposerTrigger } from '@astryx-vue/core/Chat'
import { createStaticSource } from '@astryx-vue/core'
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const people = createStaticSource([
  { id: 'ada', label: 'Ada Lovelace' },
  { id: 'maria', label: 'María José García' },
  { id: 'lin', label: 'Lin', auxiliaryData: { group: 'Reviewers' } },
  { id: 'grace', label: 'Grace Hopper', auxiliaryData: { group: 'Reviewers' } },
])

const commands = createStaticSource([
  { id: 'summarize', label: 'summarize' },
  { id: 'translate', label: 'translate' },
])

const triggers: ChatComposerTrigger[] = [
  {
    character: '@',
    hasMultiWordQuery: true,
    menuLabel: 'People',
    searchSource: people,
    onSelect: item => ({ value: `@${item.id}`, label: `@${item.label}`, variant: 'blue' }),
  },
  {
    character: '/',
    menuLabel: 'Commands',
    searchSource: commands,
    onSelect: item => `/${item.label} `,
  },
]

const sent = ref('')

function onSubmit(value: string): void {
  sent.value = value
}
</script>

<template>
  <div class="chat-preview-composer">
    <ChatComposer placeholder="Mention with @, or run /summarize" @submit="onSubmit">
      <template #input>
        <ChatComposerInput :triggers="triggers" />
      </template>
    </ChatComposer>
    <p v-if="sent" class="chat-preview__caption">
      {{ sent }}
    </p>
  </div>
</template>
