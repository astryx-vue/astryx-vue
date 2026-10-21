<script setup lang="ts">
import type { StepProgress, StepProps, StepSlots } from './types.js'
import { computed, onUnmounted, watch } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useStepperContext } from './context.js'
import { resolveStepGlyph } from './logic.js'
import StepMarker from './StepMarker.vue'
import '../../styles/stepper.css'

defineOptions({ name: 'AstryxStep' })

const props = withDefaults(defineProps<StepProps>(), {
  indicator: 'auto',
  isDisabled: false,
  isOptional: false,
})

defineSlots<StepSlots>()

const stepper = useStepperContext()
const messages = useAstryxMessages()

const progress = computed<StepProgress>(() => {
  const active = stepper.activeStep.value
  if (props.step === active)
    return 'in-progress'
  if (props.step < active)
    return 'completed'
  return 'not-started'
})

const density = computed(() => props.density ?? stepper.density.value)
const orientation = computed(() => stepper.orientation.value)
const indicatorPosition = computed(() => stepper.indicatorPosition.value)
const isClickable = computed(() => stepper.isNonLinear.value === true && !props.isDisabled)
const numberLabel = computed(() => String(props.step + 1))
const glyph = computed(() => resolveStepGlyph({
  progress: progress.value,
  indicator: props.indicator,
  status: props.status,
}))
const collapsed = computed(() => stepper.collapsed.value === true)
const leadFilled = computed(() => props.step <= stepper.activeStep.value)
const trailFilled = computed(() => props.step < stepper.activeStep.value)

const accessibleName = computed(() => {
  const stepNumber = props.step + 1
  const status = props.status === 'error'
    ? messages.value.stepper.status.error
    : props.status === 'warning'
      ? messages.value.stepper.status.warning
      : progress.value === 'completed'
        ? messages.value.stepper.status.completed
        : null
  if (status == null)
    return messages.value.stepper.goToStep(stepNumber, props.label)
  return messages.value.stepper.goToStepWithStatus(stepNumber, props.label, status)
})

const hiddenStatus = computed(() => {
  if (progress.value === 'in-progress')
    return null
  if (props.status === 'error')
    return messages.value.stepper.status.error
  if (props.status === 'warning')
    return messages.value.stepper.status.warning
  if (props.status === 'success' || progress.value === 'completed')
    return messages.value.stepper.status.completed
  return null
})

function activate(): void {
  if (!isClickable.value)
    return
  stepper.select.value?.(props.step)
}

watch(
  () => ({
    step: props.step,
    label: props.label,
    description: props.description,
    indicator: props.indicator,
    status: props.status,
    isDisabled: props.isDisabled,
  }),
  record => stepper.register(record),
  { immediate: true },
)
onUnmounted(() => stepper.unregister(props.step))
</script>

<template>
  <li
    class="astryx-step"
    :aria-current="progress === 'in-progress' ? 'step' : undefined"
    :data-density="density"
    :data-indicator-position="indicatorPosition"
    :data-orientation="orientation"
    :data-progress="progress"
    :data-status="status"
  >
    <span
      v-if="indicatorPosition === 'separated' || collapsed"
      class="astryx-step-bar"
      :data-filled="leadFilled || undefined"
    />
    <span v-else class="astryx-step-rail">
      <span class="astryx-step-connector astryx-step-connector-lead" :data-filled="leadFilled || undefined" />
      <span class="astryx-step-connector astryx-step-connector-trail" :data-filled="trailFilled || undefined" />
    </span>
    <component
      :is="isClickable ? 'button' : 'div'"
      class="astryx-step-control"
      :aria-label="isClickable ? accessibleName : undefined"
      :type="isClickable ? 'button' : undefined"
      @click="activate"
    >
      <span v-if="$slots.icon" class="astryx-step-indicator" :data-glyph="glyph" aria-hidden="true">
        <slot name="icon" />
      </span>
      <StepMarker v-else :glyph="glyph" :number-label="numberLabel" />
      <span class="astryx-step-copy">
        <span class="astryx-step-label-row">
          <span class="astryx-step-label">{{ label }}</span>
          <VisuallyHidden v-if="hiddenStatus">{{ hiddenStatus }}</VisuallyHidden>
          <span v-if="isOptional" class="astryx-step-optional">• {{ messages.stepper.optional }}</span>
          <slot name="end" />
        </span>
        <span v-if="description" class="astryx-step-description">{{ description }}</span>
      </span>
    </component>
    <div v-if="$slots.default" class="astryx-step-content">
      <slot />
    </div>
  </li>
</template>
