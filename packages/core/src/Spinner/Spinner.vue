<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SpinnerProps, SpinnerSize } from './types.js'
import { computed, useAttrs, useId, useSlots } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import { registerSpinnerGeometry } from './spinnerGeometry.js'
import { bindSpinnerPhase } from './spinnerPhase.js'
import '../../styles/spinner.css'

defineOptions({ name: 'AstryxSpinner', inheritAttrs: false })

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  shade: 'default',
})

const RING = {
  sm: { diameter: 10, stroke: 2 },
  md: { diameter: 14, stroke: 3 },
  lg: { diameter: 18, stroke: 3 },
  xl: { diameter: 28, stroke: 4 },
} as const satisfies Record<SpinnerSize, { diameter: number, stroke: number }>

const ARC_FRACTION = 0.375

registerSpinnerGeometry()

const attrs = useAttrs()
const slots = useSlots()
const messages = useAstryxMessages()
const labelId = `astryx-spinner-label-${useId()}`

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label))
const ariaLabel = computed(() => attrs['aria-label'] as string | undefined)
const namedByVisibleLabel = computed(() => Boolean(props.label) && !ariaLabel.value)
const ringLabelledBy = computed(() => (namedByVisibleLabel.value ? labelId : undefined))
const ringAriaLabel = computed(() => {
  if (namedByVisibleLabel.value)
    return undefined
  return ariaLabel.value ?? props.label ?? messages.value.spinner.loading
})
const rootAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'aria-label' && key !== 'style'),
))
const geometry = computed(() => RING[props.size])
const frameSize = computed(() => geometry.value.diameter + geometry.value.stroke * 2)
const arcLength = computed(() => Math.PI * geometry.value.diameter * ARC_FRACTION)
const gapLength = computed(() => Math.PI * geometry.value.diameter - arcLength.value)
const boxStyle = computed<CSSProperties>(() => ({
  width: `var(--_spinner-box-size, ${frameSize.value}px)`,
  height: `var(--_spinner-box-size, ${frameSize.value}px)`,
}))
const callerStyle = computed(() => attrs.style as CSSProperties | undefined)
const rootStyle = computed(() => [callerStyle.value, hasLabel.value ? undefined : boxStyle.value])

let releasePhase: (() => void) | undefined

function onRing(element: unknown): void {
  releasePhase?.()
  releasePhase = undefined
  if (element instanceof SVGSVGElement)
    releasePhase = bindSpinnerPhase(element)
}
</script>

<template>
  <div
    v-if="hasLabel"
    v-bind="rootAttrs"
    class="astryx-spinner astryx-spinner-group"
    :data-size="size"
    :data-shade="shade"
    :style="callerStyle"
  >
    <span
      class="astryx-spinner-box"
      role="status"
      :aria-label="ringAriaLabel"
      :aria-labelledby="ringLabelledBy"
      :style="boxStyle"
    >
      <svg
        :ref="onRing"
        class="astryx-spinner__ring"
        :width="frameSize"
        :height="frameSize"
        aria-hidden="true"
        focusable="false"
      >
        <circle class="astryx-spinner__track" cx="50%" cy="50%" :r="geometry.diameter / 2" :stroke-width="geometry.stroke" />
        <circle
          class="astryx-spinner__arc"
          cx="50%"
          cy="50%"
          :r="geometry.diameter / 2"
          :stroke-width="geometry.stroke"
          :stroke-dasharray="`${arcLength} ${gapLength}`"
        />
      </svg>
    </span>
    <span :id="labelId" class="astryx-spinner-label">
      <slot name="label">{{ label }}</slot>
    </span>
  </div>
  <span
    v-else
    v-bind="rootAttrs"
    class="astryx-spinner astryx-spinner-box"
    role="status"
    :data-size="size"
    :data-shade="shade"
    :aria-label="ringAriaLabel"
    :style="rootStyle"
  >
    <svg
      :ref="onRing"
      class="astryx-spinner__ring"
      :width="frameSize"
      :height="frameSize"
      aria-hidden="true"
      focusable="false"
    >
      <circle class="astryx-spinner__track" cx="50%" cy="50%" :r="geometry.diameter / 2" :stroke-width="geometry.stroke" />
      <circle
        class="astryx-spinner__arc"
        cx="50%"
        cy="50%"
        :r="geometry.diameter / 2"
        :stroke-width="geometry.stroke"
        :stroke-dasharray="`${arcLength} ${gapLength}`"
      />
    </svg>
  </span>
</template>
