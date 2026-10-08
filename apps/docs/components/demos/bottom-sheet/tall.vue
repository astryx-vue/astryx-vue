<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { List, ListItem } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)

const places = [
  { name: 'Koffiehuis De Hoek', detail: '120 m · open until 18:00' },
  { name: 'Bakkerij Van Dijk', detail: '260 m · sourdough and rye' },
  { name: 'Markt aan het Water', detail: '400 m · Tue to Sat' },
  { name: 'Stadsbibliotheek', detail: '650 m · quiet reading room' },
  { name: 'Fietsenwinkel Centrum', detail: '800 m · repairs same day' },
  { name: 'Parkeergarage Oost', detail: '1.1 km · 24 hours' },
  { name: 'Zwembad De Golf', detail: '1.4 km · lanes before 9:00' },
]
</script>

<template>
  <div class="bottom-sheet-preview">
    <Button label="Show nearby places" variant="secondary" @click="isOpen = true" />
    <BottomSheet
      v-model:is-open="isOpen"
      height="tall"
      label="Nearby places"
      @open-change="isOpen = $event"
    >
      <Text type="body" color="secondary">
        The sheet scrolls its own content, so the list keeps its length and the
        handle stays reachable.
      </Text>
      <List header="Nearby">
        <ListItem
          v-for="place in places"
          :key="place.name"
          :label="place.name"
          :description="place.detail"
        />
      </List>
    </BottomSheet>
  </div>
</template>
