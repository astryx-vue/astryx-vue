<script setup lang="ts">
import { CommandPaletteItem, CommandPaletteList } from '@astryx-vue/core/CommandPalette'
</script>

<template>
  <CommandPaletteList>
    <CommandPaletteItem value="go-home">
      Go Home
    </CommandPaletteItem>
    <CommandPaletteItem is-highlighted value="open-settings">
      Open Settings
    </CommandPaletteItem>
    <CommandPaletteItem is-selected value="view-profile">
      View Profile
    </CommandPaletteItem>
    <CommandPaletteItem is-disabled value="help">
      Help (unavailable)
    </CommandPaletteItem>
  </CommandPaletteList>
</template>
