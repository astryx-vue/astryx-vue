<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'

const commands = [
  { keys: 'mod+k', label: 'Search everything' },
  { keys: 'mod+shift+p', label: 'Open the command palette' },
  { keys: 'shift+enter', label: 'Insert a line break' },
  { keys: 'escape', label: 'Dismiss the open overlay' },
]
</script>

<template>
  <ul class="kbd-preview__list">
    <li v-for="command in commands" :key="command.keys" class="kbd-preview__item">
      <span class="kbd-preview__label">{{ command.label }}</span>
      <Kbd :keys="command.keys" />
    </li>
  </ul>
</template>
