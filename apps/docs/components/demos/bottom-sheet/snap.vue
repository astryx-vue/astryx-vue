<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { List, ListItem } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)

const stops = [
  { name: 'Centraal Station', detail: 'Platform 4 · every 10 minutes' },
  { name: 'Museumkwartier', detail: 'Tram 5 · 8 minutes away' },
  { name: 'Westerpark', detail: 'Bus 21 · 14 minutes away' },
  { name: 'Oostpoort', detail: 'Metro 51 · 22 minutes away' },
  { name: 'Zuidas', detail: 'Train · 31 minutes away' },
]
</script>

<template>
  <div class="bottom-sheet-preview">
    <Button label="Show route" variant="secondary" @click="isOpen = true" />
    <BottomSheet
      v-model:is-open="isOpen"
      :snap-points="[0.45]"
      height="tall"
      label="Route"
      @open-change="isOpen = $event"
    >
      <Text type="body" color="secondary">
        Drag the handle down to rest the sheet at half the screen, or up to fill
        it again.
      </Text>
      <List header="Stops">
        <ListItem
          v-for="stop in stops"
          :key="stop.name"
          :label="stop.name"
          :description="stop.detail"
        />
      </List>
    </BottomSheet>
  </div>
</template>
