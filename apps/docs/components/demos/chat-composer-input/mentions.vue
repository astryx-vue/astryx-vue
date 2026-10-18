<script setup lang="ts">
import type { ChatComposerTrigger } from '@astryx-vue/core/Chat'
import { createStaticSource } from '@astryx-vue/core'
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TypeaheadItem } from '@astryx-vue/core/Typeahead'
import { h, ref } from 'vue'

interface UserMeta {
  role: string
}

const users = [
  { id: 'cindy', label: 'Cindy Zhang', auxiliaryData: { role: 'Design Systems' } },
  { id: 'alex', label: 'Alex Johnson', auxiliaryData: { role: 'Frontend' } },
  { id: 'sam', label: 'Sam Rivera', auxiliaryData: { role: 'Backend' } },
  { id: 'jordan', label: 'Jordan Lee', auxiliaryData: { role: 'Product' } },
]

const userSource = createStaticSource(users)

const value = ref('')

const mentionTrigger: ChatComposerTrigger = {
  character: '@',
  searchSource: userSource,
  renderItem: item => h(TypeaheadItem, {
    item,
    description: (item.auxiliaryData as UserMeta | undefined)?.role,
  }),
  onSelect: item => ({
    value: `@${item.id}`,
    label: item.label,
    variant: 'blue',
  }),
}
</script>

<template>
  <VStack :gap="3">
    <ChatComposer @submit="value = ''">
      <template #input>
        <ChatComposerInput
          v-model="value"
          :triggers="[mentionTrigger]"
          placeholder="Type @ to mention someone..."
        />
      </template>
    </ChatComposer>
    <Text type="supporting" color="secondary">
      Value: {{ JSON.stringify(value) }}
    </Text>
  </VStack>
</template>
