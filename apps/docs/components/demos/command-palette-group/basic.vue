<script setup lang="ts">
import { CommandPaletteGroup, CommandPaletteItem, CommandPaletteList } from '@astryx-vue/core/CommandPalette'
</script>

<template>
  <CommandPaletteList>
    <CommandPaletteGroup heading="Navigation">
      <CommandPaletteItem value="home">
        Go to Home
      </CommandPaletteItem>
      <CommandPaletteItem value="dashboard">
        Go to Dashboard
      </CommandPaletteItem>
    </CommandPaletteGroup>
    <CommandPaletteGroup heading="Actions">
      <CommandPaletteItem value="new-file">
        New File
      </CommandPaletteItem>
      <CommandPaletteItem value="save-all">
        Save All
      </CommandPaletteItem>
    </CommandPaletteGroup>
  </CommandPaletteList>
</template>
