<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'

const source = createStaticSource<SearchableItem>([])
</script>

<template>
  <CommandPalette
    empty-bootstrap-text="No commands available yet"
    is-inline
    is-open
    :search-source="source"
  />
</template>
