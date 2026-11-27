<script setup lang="ts">
import type { ItemSwipeAction, ItemSwipeSide } from './types.js'
import { consumeWhileDisabled } from '../utils/disabledInteraction.js'

defineOptions({ name: 'AstryxItemSwipePanel' })

defineProps<{
  side: ItemSwipeSide
  actions: ItemSwipeAction[]
  phase: string
}>()

const emit = defineEmits<{ activate: [action: ItemSwipeAction] }>()
</script>

<template>
  <div class="astryx-item__swipe-panel" :data-side="side" :inert="phase === 'resting' ? undefined : true">
    <button
      v-for="action in actions"
      :key="action.id ?? action.label"
      type="button"
      class="astryx-item__swipe-action"
      :data-variant="action.variant ?? 'neutral'"
      :aria-disabled="action.isDisabled || undefined"
      @click.stop="emit('activate', action)"
      @keydown="consumeWhileDisabled($event, action.isDisabled === true)"
    >
      <component :is="action.icon" v-if="action.icon" aria-hidden="true" />
      <span>{{ action.label }}</span>
    </button>
  </div>
</template>
