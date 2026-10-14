<script setup lang="ts">
import type { Component } from 'vue'
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { Icon } from '@astryx-vue/core/Icon'
import { List, ListItem } from '@astryx-vue/core/List'
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { h, ref } from 'vue'

function svgIcon(paths: string[]): Component {
  return () => h('svg', {
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, paths.map(d => h('path', { d })))
}

const UserIcon = svgIcon(['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8'])
const TagIcon = svgIcon(['M20.6 13.4 12 22l-8.6-8.6a2 2 0 0 1-.6-1.4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 1.4.6L20.6 8a2 2 0 0 1 0 2.8Z', 'M7.5 7.5h.01'])
const CalendarIcon = svgIcon(['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'])

const actions = [
  { icon: UserIcon, label: 'Assign owner', description: 'Route follow-up to a teammate.' },
  { icon: TagIcon, label: 'Add label', description: 'Group this item with related work.' },
  { icon: CalendarIcon, label: 'Set due date', description: 'Pick a reminder for review.' },
]

const isOpen = ref(false)
</script>

<template>
  <Button label="Open project actions" @click="isOpen = true" />
  <BottomSheet v-model:is-open="isOpen" label="Project actions" height="hug">
    <Section :padding-block="4" :padding-inline="1">
      <VStack :gap="3">
        <VStack :gap="1" style="margin-inline-start: var(--astryx-spacing-3, 12px)">
          <Heading :level="3">
            Project actions
          </Heading>
          <Text type="supporting" color="secondary">
            Use this modal touch surface when the task should move away from its trigger and stay close to the bottom edge.
          </Text>
        </VStack>
        <List density="spacious">
          <ListItem
            v-for="action in actions"
            :key="action.label"
            :label="action.label"
            :description="action.description"
            :on-click="() => { isOpen = false }"
          >
            <template #startContent>
              <Icon :icon="action.icon" size="md" color="secondary" />
            </template>
          </ListItem>
        </List>
      </VStack>
    </Section>
  </BottomSheet>
</template>
