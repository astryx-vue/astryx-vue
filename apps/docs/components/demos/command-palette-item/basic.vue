<script setup lang="ts">
import { CommandPaletteItem, CommandPaletteList } from '@astryx-vue/core/CommandPalette'
</script>

<template>
  <CommandPaletteList>
    <CommandPaletteItem value="new-file">
      New File
    </CommandPaletteItem>
    <CommandPaletteItem is-highlighted value="open-recent">
      Open Recent
    </CommandPaletteItem>
    <CommandPaletteItem value="save-all">
      Save All
    </CommandPaletteItem>
    <CommandPaletteItem is-disabled value="publish">
      Publish (disabled)
    </CommandPaletteItem>
  </CommandPaletteList>
</template>
