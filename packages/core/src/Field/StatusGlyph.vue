<script setup lang="ts">
import type { FieldStatusType } from './types.js'
import { computed, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'

const props = defineProps<{
  type: FieldStatusType
  message?: string
  tooltip?: boolean
}>()

const messages = useAstryxMessages()
const button = useTemplateRef<HTMLButtonElement>('button')
const anchor = computed(() => button.value)
const tooltipId = `astryx-status-tooltip-${useId()}`
const showsTooltip = computed(() => props.tooltip === true && Boolean(props.message))
const tooltip = useButtonTooltip(showsTooltip)
const label = computed(() => {
  if (props.type === 'warning')
    return messages.value.input.statusWarning
  if (props.type === 'success')
    return messages.value.input.statusSuccess
  return messages.value.input.statusError
})
</script>

<template>
  <button
    v-if="showsTooltip"
    ref="button"
    type="button"
    class="astryx-field-status-glyph"
    :data-status="type"
    :aria-label="label"
    :aria-describedby="tooltipId"
    @click.stop
    @focus="tooltip.onTooltipPointerEnter"
    @blur="tooltip.hideImmediately"
    @pointerenter="tooltip.onPointerEnter"
    @pointerleave="tooltip.onPointerLeave"
  >
    <Icon :icon="type" size="sm" />
  </button>
  <Icon v-else class="astryx-field-status-glyph" :icon="type" size="sm" :data-status="type" />
  <ButtonTooltip
    v-if="showsTooltip"
    :id="tooltipId"
    :anchor="anchor"
    :open="tooltip.isOpen.value"
    :text="message ?? ''"
    @pointer-enter="tooltip.onTooltipPointerEnter"
    @pointer-leave="tooltip.onPointerLeave"
  />
</template>
