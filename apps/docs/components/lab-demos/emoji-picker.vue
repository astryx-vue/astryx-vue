<script setup lang="ts">
import { Card, Text, VStack } from '@astryx-vue/core'
import { EmojiPicker } from '@astryx-vue/lab'
import { ref } from 'vue'

const picked = ref('')

function remember(emoji: string) {
  picked.value = emoji
}
</script>

<template>
  <VStack :gap="3" class="lab-demo-row" style="width: 352px; max-width: 100%">
    <Card :padding="0" :width="352" style="max-width: 100%">
      <EmojiPicker @select="remember" />
    </Card>
    <Text type="supporting">
      {{ picked || 'Nothing picked yet' }}
    </Text>
  </VStack>
</template>
