<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette, CommandPaletteInput } from '@astryx-vue/core/CommandPalette'
import { Kbd } from '@astryx-vue/core/Kbd'

const source = createStaticSource([
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
  { id: 'help', label: 'Help' },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source">
    <template #input>
      <CommandPaletteInput placeholder="Search commands, files, or actions...">
        <template #endContent>
          <Kbd keys="mod+k" />
        </template>
      </CommandPaletteInput>
    </template>
  </CommandPalette>
</template>
