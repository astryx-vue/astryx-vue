<script setup lang="ts">
import type { ChatComposerTrigger } from '@astryx-vue/core/Chat'
import { createStaticSource } from '@astryx-vue/core'
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const people = createStaticSource([
  { id: 'ada', label: 'Ada Lovelace' },
  { id: 'lin', label: 'Lin', auxiliaryData: { group: 'Reviewers' } },
  { id: 'grace', label: 'Grace', auxiliaryData: { group: 'Reviewers' } },
])

const triggers: ChatComposerTrigger[] = [{
  character: '@',
  menuLabel: 'People',
  searchSource: people,
  onSelect: item => ({ value: `@${item.id}`, label: `@${item.label}`, variant: 'blue' }),
}]

const sent = ref('')

function onSubmit(value: string): void {
  sent.value = value
}
</script>

<template>
  <div class="chat-preview-composer">
    <ChatComposer placeholder="Mention someone with @" @submit="onSubmit">
      <template #input>
        <ChatComposerInput :triggers="triggers" />
      </template>
    </ChatComposer>
    <p v-if="sent" class="chat-preview__caption">
      {{ sent }}
    </p>
  </div>
</template>
