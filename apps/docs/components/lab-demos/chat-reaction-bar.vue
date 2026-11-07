<script setup lang="ts">
import type { ChatReaction } from '@astryx-vue/lab'
import { ChatReactionBar } from '@astryx-vue/lab'
import { ref } from 'vue'

const reactions = ref<ChatReaction[]>([
  { emoji: '🎉', count: 4, isSelected: true, label: 'You and Dana reacted with 🎉' },
  { emoji: '👀', count: 2 },
])

function toggle(emoji: string) {
  const current = reactions.value.find(reaction => reaction.emoji === emoji)
  if (current == null)
    return
  const nextSelected = current.isSelected !== true
  current.isSelected = nextSelected
  current.count = Math.max(0, current.count + (nextSelected ? 1 : -1))
  if (current.label != null)
    current.label = nextSelected ? 'You and Dana reacted with 🎉' : 'Dana reacted with 🎉'
}

function add(emoji: string) {
  const current = reactions.value.find(reaction => reaction.emoji === emoji)
  if (current == null) {
    reactions.value = [...reactions.value, { emoji, count: 1, isSelected: true }]
    return
  }
  if (current.isSelected === true)
    return
  current.isSelected = true
  current.count += 1
}
</script>

<template>
  <ChatReactionBar :reactions="reactions" @toggle="toggle" @add="add" />
</template>
