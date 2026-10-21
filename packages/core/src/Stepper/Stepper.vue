<script setup lang="ts">
import type { StepRegistration } from './context.js'
import type { StepperProps, StepperSlots } from './types.js'
import { computed, onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import { stepperContextKey } from './context.js'
import { resolveStepGlyph, shouldCollapseStepper } from './logic.js'
import StepMarker from './StepMarker.vue'
import '../../styles/stepper.css'

defineOptions({ name: 'AstryxStepper' })

const props = withDefaults(defineProps<StepperProps>(), {
  density: 'balanced',
  hasCollapsibleLabels: false,
  indicatorPosition: 'separated',
  orientation: 'horizontal',
})

defineSlots<StepperSlots>()

const messages = useAstryxMessages()
const root = useTemplateRef<HTMLElement>('root')
const width = ref(Number.POSITIVE_INFINITY)
const steps = ref<StepRegistration[]>([])
const activeStep = computed(() => props.activeStep)
const orientation = computed(() => props.orientation)
const density = computed(() => props.density)
const indicatorPosition = computed(() => props.indicatorPosition)
const hasCollapsibleLabels = computed(() => props.hasCollapsibleLabels && props.orientation === 'horizontal')
const select = computed(() => props.onStepClick ?? null)
const isNonLinear = computed(() => select.value != null)
const collapsed = computed(() => shouldCollapseStepper(
  width.value,
  steps.value.length,
  props.horizontalOptions?.minimumStepWidth,
  props.orientation,
))
const collapsedVariant = computed(() => props.horizontalOptions?.collapsedVariant ?? 'withLabelAndControls')
const orderedSteps = computed(() => [...steps.value].sort((left, right) => left.step - right.step))
const current = computed(() => steps.value.find(step => step.step === props.activeStep) ?? null)
const showSummary = computed(() => collapsed.value && current.value != null && collapsedVariant.value !== 'hiddenLabel')
const showControls = computed(() => showSummary.value && collapsedVariant.value === 'withLabelAndControls' && select.value != null)
const currentGlyph = computed(() => {
  const step = current.value
  if (step == null)
    return 'none' as const
  return resolveStepGlyph({
    progress: 'in-progress',
    indicator: step.indicator,
    status: step.status,
  })
})

function register(record: StepRegistration): void {
  const index = steps.value.findIndex(step => step.step === record.step)
  if (index === -1)
    steps.value = [...steps.value, record]
  else
    steps.value = steps.value.map(step => step.step === record.step ? record : step)
}

function unregister(step: number): void {
  steps.value = steps.value.filter(item => item.step !== step)
}

function neighbor(delta: number): number | null {
  const ordered = orderedSteps.value
  const index = ordered.findIndex(step => step.step === props.activeStep)
  let cursor = index + delta
  while (cursor >= 0 && cursor < ordered.length && ordered[cursor]?.isDisabled)
    cursor += delta
  if (cursor < 0 || cursor >= ordered.length)
    return null
  return ordered[cursor]?.step ?? null
}

function move(delta: number): void {
  const next = neighbor(delta)
  if (next == null)
    return
  select.value?.(next)
}

let observer: ResizeObserver | undefined
onMounted(() => {
  const node = root.value
  if (node == null || typeof ResizeObserver === 'undefined')
    return
  observer = new ResizeObserver((entries) => {
    width.value = entries[0]?.contentRect.width ?? node.clientWidth
  })
  observer.observe(node)
})
onUnmounted(() => observer?.disconnect())

provide(stepperContextKey, {
  activeStep,
  collapsed,
  density,
  hasCollapsibleLabels,
  indicatorPosition,
  isNonLinear,
  orientation,
  register,
  select,
  unregister,
})
</script>

<template>
  <div
    ref="root"
    class="astryx-stepper-root"
    :class="{ 'astryx-stepper-frame': orientation === 'horizontal' }"
    :data-collapsed="collapsed || undefined"
  >
    <ol
      class="astryx-stepper"
      :aria-label="label || messages.stepper.progress"
      :data-collapsible="hasCollapsibleLabels || undefined"
      :data-indicator-position="indicatorPosition"
      :data-orientation="orientation"
    >
      <slot />
    </ol>
    <div v-if="showSummary && current" class="astryx-stepper-summary">
      <button
        v-if="showControls"
        class="astryx-stepper-nav"
        type="button"
        :aria-label="messages.stepper.previous"
        :disabled="neighbor(-1) == null"
        @click="move(-1)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 3.5 5.5 8 10 12.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
        </svg>
      </button>
      <span class="astryx-stepper-summary-body" aria-hidden="true">
        <span class="astryx-stepper-summary-row">
          <StepMarker :glyph="currentGlyph" :number-label="String(activeStep + 1)" />
          <span class="astryx-step-label">{{ current.label }}</span>
        </span>
        <span v-if="current.description" class="astryx-step-description">{{ current.description }}</span>
      </span>
      <button
        v-if="showControls"
        class="astryx-stepper-nav"
        type="button"
        :aria-label="messages.stepper.next"
        :disabled="neighbor(1) == null"
        @click="move(1)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
        </svg>
      </button>
    </div>
  </div>
</template>
