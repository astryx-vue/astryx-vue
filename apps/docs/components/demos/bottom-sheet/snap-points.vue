<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Icon } from '@astryx-vue/core/Icon'
import { Item } from '@astryx-vue/core/List'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const snapPoints = ['96px', '50%']
const isOpen = ref(false)

const steps = [
  { icon: 'pin', label: 'Head northeast on Mission St', detail: 'Toward 3rd St', distance: '350 ft' },
  { icon: 'right', label: 'Turn right onto 3rd St', detail: 'Pass Yerba Buena Gardens on your left', distance: '0.2 mi' },
  { icon: 'up', label: 'Continue onto Kearny St', detail: 'Stay in the right lane', distance: '0.4 mi' },
  { icon: 'left', label: 'Turn left onto Market St', detail: 'Cable car crossing ahead', distance: '0.6 mi' },
  { icon: 'right', label: 'Bear right onto Sutter St', detail: 'Toward the Financial District', distance: '0.3 mi' },
  { icon: 'up', label: 'Continue on Sansome St', detail: 'Four blocks, past Pine St', distance: '0.5 mi' },
  { icon: 'uturn', label: 'Make a U-turn at Washington St', detail: 'Construction detour until March', distance: '150 ft' },
  { icon: 'right', label: 'Turn right onto Battery St', detail: 'Follow signs for the Embarcadero', distance: '0.4 mi' },
  { icon: 'left', label: 'Turn left onto Sacramento St', detail: 'Toward the waterfront', distance: '0.2 mi' },
  { icon: 'right', label: 'Turn right onto The Embarcadero', detail: 'Bay Bridge on your right', distance: '0.5 mi' },
  { icon: 'up', label: 'Continue past Pier 14', detail: 'Ferry terminal signage begins here', distance: '0.3 mi' },
  { icon: 'flag', label: 'Arrive at the Ferry Building', detail: 'Parking garage entrance on Washington St', distance: '—' },
]
</script>

<template>
  <VStack align="start" :gap="3">
    <Text type="body">
      This sheet has two extra stops: half the viewport, and a 96px peek. Drag the handle down to collapse it, then back up — it rests at each stop instead of following your finger.
    </Text>
    <Button label="Show directions" @click="isOpen = true" />
  </VStack>
  <BottomSheet
    v-model:is-open="isOpen"
    height="tall"
    label="Directions to the Ferry Building"
    :snap-points="snapPoints"
  >
    <VStack :gap="4">
      <VStack :gap="1">
        <Heading :level="3">
          Ferry Building
        </Heading>
        <HStack :gap="2">
          <Text type="label">
            18 min
          </Text>
          <Text type="supporting">
            3.7 mi · arrive 9:41 AM
          </Text>
        </HStack>
      </VStack>
      <Divider />
      <VStack :gap="0">
        <Item
          v-for="step in steps"
          :key="step.label"
          :description="step.detail"
          :label="step.label"
        >
          <template #startContent>
            <Icon size="sm">
              <svg v-if="step.icon === 'pin'" fill="none" height="16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="16">
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="12" cy="10" r="2.25" />
              </svg>
              <svg v-else-if="step.icon === 'right'" fill="none" height="16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="16">
                <path d="M4 12h16M14 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="step.icon === 'left'" fill="none" height="16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="16">
                <path d="M20 12H4M10 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="step.icon === 'up'" fill="none" height="16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="16">
                <path d="M12 20V4M6 10l6-6 6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="step.icon === 'uturn'" fill="none" height="16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="16">
                <path d="M9 14 4 9l5-5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 9h9a6 6 0 0 1 0 12H8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else fill="none" height="16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="16">
                <path d="M5 21V4h9l-1.5 4.5L14 13H5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Icon>
          </template>
          <template #endContent>
            <Text type="supporting">
              {{ step.distance }}
            </Text>
          </template>
        </Item>
      </VStack>
      <Divider />
      <Button label="Start" variant="primary" @click="isOpen = false" />
    </VStack>
  </BottomSheet>
</template>
