<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { DropdownMenu, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { h } from 'vue'

function strokeIcon(children: () => ReturnType<typeof h>[]): FunctionalComponent {
  return () => h('svg', {
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, children())
}

const PencilIcon = strokeIcon(() => [
  h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
  h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' }),
])
const CopyIcon = strokeIcon(() => [
  h('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2 }),
  h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
])
const ShareIcon = strokeIcon(() => [
  h('circle', { cx: 18, cy: 5, r: 3 }),
  h('circle', { cx: 6, cy: 12, r: 3 }),
  h('circle', { cx: 18, cy: 19, r: 3 }),
  h('line', { x1: 8.59, y1: 13.51, x2: 15.42, y2: 17.49 }),
  h('line', { x1: 15.41, y1: 6.51, x2: 8.59, y2: 10.49 }),
])
const TrashIcon = strokeIcon(() => [
  h('polyline', { points: '3 6 5 6 21 6' }),
  h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
])
</script>

<template>
  <DropdownMenu :button="{ label: 'Actions' }">
    <DropdownMenuItem :icon="PencilIcon" label="Edit" description="Modify this item" />
    <DropdownMenuItem :icon="CopyIcon" label="Duplicate" description="Create a copy" />
    <DropdownMenuItem :icon="ShareIcon" label="Share" />
    <DropdownMenuItem :icon="TrashIcon" label="Delete" description="This action cannot be undone" />
  </DropdownMenu>
</template>
