<script setup lang="ts">
import type { SearchSource } from '@astryx-vue/core'
import { CommandPalette, CommandPaletteInput } from '@astryx-vue/core/CommandPalette'

const files = [
  { id: 'readme', label: 'README.md' },
  { id: 'package', label: 'package.json' },
  { id: 'tsconfig', label: 'tsconfig.json' },
  { id: 'index', label: 'src/index.ts' },
  { id: 'app', label: 'src/App.tsx' },
]

const source: SearchSource = {
  async search(query: string) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const normalized = query.toLowerCase()
    return files.filter(file => file.label.toLowerCase().includes(normalized))
  },
  bootstrap() {
    return []
  },
}
</script>

<template>
  <CommandPalette
    empty-bootstrap-text="Type a filename to search"
    empty-search-text="No files found"
    is-inline
    is-open
    :search-source="source"
  >
    <template #input>
      <CommandPaletteInput placeholder="Search files..." />
    </template>
  </CommandPalette>
</template>
