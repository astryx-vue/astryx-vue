<script setup lang="ts">
import type { StepperProps, StepperSlots } from './types.js'
import { computed, provide } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import { stepperContextKey } from './context.js'
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
const activeStep = computed(() => props.activeStep)
const orientation = computed(() => props.orientation)
const density = computed(() => props.density)
const indicatorPosition = computed(() => props.indicatorPosition)
const hasCollapsibleLabels = computed(() => props.hasCollapsibleLabels && props.orientation === 'horizontal')
const select = computed(() => props.onStepClick ?? null)
const isNonLinear = computed(() => select.value != null)

provide(stepperContextKey, {
  activeStep,
  density,
  hasCollapsibleLabels,
  indicatorPosition,
  isNonLinear,
  orientation,
  select,
})
</script>

<template>
  <ol
    class="astryx-stepper"
    :aria-label="label || messages.stepper.progress"
    :data-collapsible="hasCollapsibleLabels || undefined"
    :data-indicator-position="indicatorPosition"
    :data-orientation="orientation"
  >
    <slot />
  </ol>
</template>
