<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'

// 正式使用时去掉 is-inline：命令面板应该是模态的。
const source = createStaticSource([
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'help', label: 'Help' },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source" />
</template>
