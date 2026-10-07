<script setup lang="ts">
import type { FieldStatusType } from './types.js'
import { computed, onScopeDispose, shallowRef, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import IconButton from '../IconButton/IconButton.vue'
import FieldIcon from './FieldIcon.vue'

const props = defineProps<{ text: string, type?: FieldStatusType | 'info' }>()
const button = useTemplateRef<InstanceType<typeof IconButton>>('button')
const anchor = computed(() => button.value?.element ?? null)
const id = `astryx-field-tooltip-${useId()}`
const tooltip = useButtonTooltip(computed(() => !!props.text))
const pinned = shallowRef(false)

function close(): void {
  pinned.value = false
  tooltip.hideImmediately()
}

function toggle(): void {
  pinned.value = !pinned.value
  if (pinned.value)
    tooltip.onTooltipPointerEnter()
  else
    close()
}

function leave(): void {
  if (!pinned.value)
    tooltip.onPointerLeave()
}

function dismiss(event: Event): void {
  if (event instanceof KeyboardEvent) {
    if (event.key === 'Escape')
      close()
    return
  }
  const target = event.target
  if (target instanceof Node && !anchor.value?.contains(target) && !document.getElementById(id)?.contains(target))
    close()
}

watch(tooltip.isOpen, (open) => {
  if (typeof document === 'undefined')
    return
  if (open) {
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismiss)
  }
  else {
    document.removeEventListener('pointerdown', dismiss)
    document.removeEventListener('keydown', dismiss)
  }
})
onScopeDispose(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('pointerdown', dismiss)
    document.removeEventListener('keydown', dismiss)
  }
})
</script>

<template>
  <IconButton
    ref="button" class="astryx-field-info-tip" variant="ghost" size="sm"
    :label="text" :aria-describedby="id" :data-status="type" :aria-expanded="tooltip.isOpen.value"
    @click="toggle" @focus="tooltip.onTooltipPointerEnter" @blur="close"
    @pointerenter="tooltip.onPointerEnter" @pointerleave="leave"
  >
    <FieldIcon :type="type ?? 'info'" />
  </IconButton>
  <ButtonTooltip :id="id" :anchor="anchor" :open="tooltip.isOpen.value" :text="text" @pointer-enter="tooltip.onTooltipPointerEnter" @pointer-leave="leave" />
</template>
