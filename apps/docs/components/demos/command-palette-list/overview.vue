<script setup lang="ts">
import { CommandPaletteGroup, CommandPaletteItem, CommandPaletteList } from '@astryx-vue/core/CommandPalette'
</script>

<template>
  <CommandPaletteList>
    <CommandPaletteGroup heading="Navigation">
      <CommandPaletteItem value="go-home">
        Go Home
      </CommandPaletteItem>
      <CommandPaletteItem value="open-settings">
        Open Settings
      </CommandPaletteItem>
      <CommandPaletteItem value="view-profile">
        View Profile
      </CommandPaletteItem>
    </CommandPaletteGroup>
    <CommandPaletteGroup heading="Actions">
      <CommandPaletteItem value="new-file">
        New File
      </CommandPaletteItem>
      <CommandPaletteItem is-highlighted value="search-files">
        Search Files
      </CommandPaletteItem>
      <CommandPaletteItem value="save-all">
        Save All
      </CommandPaletteItem>
    </CommandPaletteGroup>
  </CommandPaletteList>
</template>
