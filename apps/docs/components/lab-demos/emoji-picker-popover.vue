<script setup lang="ts">
import { IconButton, Popover, Text, VStack } from '@astryx-vue/core'
import { EmojiPicker } from '@astryx-vue/lab'
import { ref } from 'vue'

const isOpen = ref(false)
const picked = ref('')

function remember(emoji: string) {
  picked.value = emoji
  isOpen.value = false
}
</script>

<template>
  <VStack :gap="3" class="lab-demo-row">
    <Popover
      :is-open="isOpen"
      label="Add emoji"
      :padding="0"
      :width="352"
      @open-change="isOpen = $event"
    >
      <IconButton label="Add emoji">
        <span aria-hidden="true">🙂</span>
      </IconButton>
      <template #content>
        <EmojiPicker @select="remember" />
      </template>
    </Popover>
    <Text type="supporting">
      {{ picked || 'Nothing picked yet' }}
    </Text>
  </VStack>
</template>
