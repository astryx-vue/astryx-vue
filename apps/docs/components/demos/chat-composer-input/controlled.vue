<script setup lang="ts">
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const value = ref('')

function onSubmit(): void {
  value.value = ''
}
</script>

<template>
  <VStack :gap="3">
    <ChatComposer v-model="value" @submit="onSubmit">
      <template #input>
        <ChatComposerInput v-model="value" placeholder="Type a message..." />
      </template>
    </ChatComposer>
    <Text type="supporting" color="secondary">
      Value: {{ JSON.stringify(value) }}
    </Text>
  </VStack>
</template>
