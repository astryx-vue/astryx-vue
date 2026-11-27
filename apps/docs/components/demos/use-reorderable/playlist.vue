<script setup lang="ts">
import { useReorderable } from '@astryx-vue/core'
import { List, ListItem } from '@astryx-vue/core/List'
import { ref } from 'vue'

interface Track {
  id: string
  title: string
  artist: string
}

const tracks = ref<Track[]>([
  { id: 'intro', title: 'Intro', artist: 'Pinned' },
  { id: 'harbor', title: 'Harbor Lights', artist: 'June Avenue' },
  { id: 'paper', title: 'Paper Planes', artist: 'The Lanterns' },
  { id: 'north', title: 'Northbound', artist: 'Mira Hale' },
  { id: 'static', title: 'Static Bloom', artist: 'Cobalt Rooms' },
])

const reorderable = useReorderable<string>({
  onReorder: ({ key, to }) => {
    const moved = tracks.value.find(track => track.id === key)
    if (moved == null)
      return
    const next = tracks.value.filter(track => track.id !== key)
    next.splice(to, 0, moved)
    tracks.value = next
  },
  isReorderable: key => key !== 'intro',
})
</script>

<template>
  <List :reorderable="reorderable" list-style="decimal">
    <ListItem
      v-for="track in tracks"
      :key="track.id"
      :item-key="track.id"
      :label="track.title"
      :description="track.artist"
    />
  </List>
</template>
