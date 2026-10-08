<script setup lang="ts">
import type { ListDensity } from '@astryx-vue/core/List'
import { List, ListItem } from '@astryx-vue/core/List'

const densities: { density: ListDensity, note: string }[] = [
  { density: 'compact', note: 'compact — 4px of block padding, for dense menus' },
  { density: 'balanced', note: 'balanced — 8px, the default' },
  { density: 'spacious', note: 'spacious — 12px of block and inline padding' },
]
</script>

<template>
  <div class="list-preview__stack">
    <section v-for="item in densities" :key="item.density" class="list-preview__section">
      <span class="list-preview__note">{{ item.note }}</span>
      <List :density="item.density" has-dividers>
        <ListItem label="Design review" description="Today at 14:00" />
        <ListItem label="Release notes" description="Draft shared with the team" />
      </List>
    </section>
  </div>
</template>
