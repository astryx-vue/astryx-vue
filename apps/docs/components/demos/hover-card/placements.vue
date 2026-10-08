<script setup lang="ts">
import type { HoverCardPlacement } from '@astryx-vue/core/HoverCard'
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { Text } from '@astryx-vue/core/Text'

const placements: { placement: HoverCardPlacement, label: string }[] = [
  { placement: 'above', label: 'Placement above' },
  { placement: 'below', label: 'Placement below' },
  { placement: 'start', label: 'Placement start' },
  { placement: 'end', label: 'Placement end' },
]
</script>

<template>
  <div class="hover-card-preview">
    <div class="hover-card-preview__placements">
      <HoverCard
        v-for="item in placements"
        :key="item.placement"
        :delay="100"
        :label="item.label"
        :placement="item.placement"
      >
        {{ item.label }}
        <template #content>
          <Text type="supporting">
            This card prefers the {{ item.placement }} side of its trigger and flips when there is no room.
          </Text>
        </template>
      </HoverCard>
    </div>
  </div>
</template>
