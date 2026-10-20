<script setup lang="ts">
import type { ChatComposerTrigger } from '@astryx-vue/core/Chat'
import { createStaticSource } from '@astryx-vue/core'
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { TypeaheadItem } from '@astryx-vue/core/Typeahead'
import { h } from 'vue'

interface CommandMeta {
  description: string
}

const commands = [
  { id: 'summarize', label: 'summarize', auxiliaryData: { description: 'Summarize the conversation' } },
  { id: 'translate', label: 'translate', auxiliaryData: { description: 'Translate text to another language' } },
  { id: 'search', label: 'search', auxiliaryData: { description: 'Search the web or documents' } },
  { id: 'code', label: 'code', auxiliaryData: { description: 'Generate or explain code' } },
  { id: 'help', label: 'help', auxiliaryData: { description: 'Show available commands' } },
]

const commandSource = createStaticSource(commands)

const commandTrigger: ChatComposerTrigger = {
  character: '/',
  searchSource: commandSource,
  renderItem: item => h(TypeaheadItem, {
    item,
    description: (item.auxiliaryData as CommandMeta | undefined)?.description,
  }),
  onSelect: item => ({
    value: `/${item.label}`,
    label: `/${item.label}`,
    variant: 'yellow',
  }),
}
</script>

<template>
  <ChatComposer>
    <template #input>
      <ChatComposerInput
        :triggers="[commandTrigger]"
        placeholder="Type / for commands..."
      />
    </template>
  </ChatComposer>
</template>
