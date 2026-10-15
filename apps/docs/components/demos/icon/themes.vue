<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

const names = ['search', 'close', 'check', 'chevronDown'] as const

const carbon = defineTheme({
  name: 'withCarbon',
  icons: {
    search: 'carbon:search',
    close: 'carbon:close',
    check: 'carbon:checkmark',
    chevronDown: 'carbon:chevron-down',
  },
})

const hero = defineTheme({
  name: 'hero-icons',
  icons: {
    search: 'heroicons:magnifying-glass-20-solid',
    close: 'heroicons:x-mark-20-solid',
    check: 'heroicons:check-20-solid',
    chevronDown: 'heroicons:chevron-down-20-solid',
  },
})
</script>

<template>
  <div class="icon-theme-board">
    <div class="icon-theme-row">
      <Icon v-for="name in names" :key="name" :icon="name" size="lg" />
      <span>Built in</span>
    </div>
    <Theme :theme="carbon">
      <div class="icon-theme-row">
        <Icon v-for="name in names" :key="name" :icon="name" size="lg" />
        <span>Carbon</span>
      </div>
    </Theme>
    <Theme :theme="hero">
      <div class="icon-theme-row">
        <Icon v-for="name in names" :key="name" :icon="name" size="lg" />
        <span>Heroicons</span>
      </div>
    </Theme>
  </div>
</template>
