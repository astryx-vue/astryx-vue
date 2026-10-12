<script setup lang="ts">
import type { StepProgress, StepProps, StepSlots } from './types.js'
import { computed, inject } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { stepperContextKey } from './context.js'
import '../../styles/stepper.css'

defineOptions({ name: 'AstryxStep' })

const props = withDefaults(defineProps<StepProps>(), {
  indicator: 'auto',
  isDisabled: false,
  isOptional: false,
})

defineSlots<StepSlots>()

const stepper = inject(stepperContextKey)
const messages = useAstryxMessages()

const progress = computed<StepProgress>(() => {
  const active = stepper?.activeStep.value ?? 0
  if (props.step === active)
    return 'in-progress'
  if (props.step < active)
    return 'completed'
  return 'not-started'
})

const density = computed(() => props.density ?? stepper?.density.value ?? 'balanced')
const orientation = computed(() => stepper?.orientation.value ?? 'horizontal')
const indicatorPosition = computed(() => stepper?.indicatorPosition.value ?? 'separated')
const isClickable = computed(() => stepper?.isNonLinear.value === true && !props.isDisabled)
const numberLabel = computed(() => String(props.step + 1))
const statusGlyph = computed(() => {
  if (props.status === 'success' || (props.status == null && progress.value === 'completed' && props.indicator === 'auto'))
    return 'check'
  if (props.status === 'warning')
    return 'warning'
  if (props.status === 'error')
    return 'error'
  return null
})
const showNumber = computed(() => props.indicator === 'number' || (props.indicator === 'auto' && progress.value === 'not-started'))
const showCheck = computed(() => props.indicator === 'auto' && progress.value === 'completed' && statusGlyph.value == null)
const showRing = computed(() => props.indicator === 'auto' && progress.value === 'in-progress' && statusGlyph.value == null)
const leadFilled = computed(() => props.step <= (stepper?.activeStep.value ?? 0))
const trailFilled = computed(() => props.step < (stepper?.activeStep.value ?? 0))

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
    return messages.value.stepper.goToStep(stepNumber)
  return messages.value.stepper.goToStepWithStatus(stepNumber, status)
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
  stepper?.select.value?.(props.step)
}
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
      v-if="indicatorPosition === 'separated'"
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
      <span v-if="indicator !== 'none'" class="astryx-step-indicator" aria-hidden="true">
        <slot name="icon">
          <svg v-if="statusGlyph === 'warning'" viewBox="0 0 16 16">
            <path d="M8 1.8 14.5 14H1.5L8 1.8z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M8 6.2v4.2" stroke="currentColor" stroke-linecap="round" />
          </svg>
          <svg v-else-if="statusGlyph === 'error'" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-linecap="round" />
          </svg>
          <svg v-else-if="showCheck || statusGlyph === 'check'" viewBox="0 0 16 16">
            <path d="M3.5 8.2 6.4 11 12.5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" />
          </svg>
          <svg v-else-if="showRing" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="8" cy="8" r="2.5" fill="currentColor" />
          </svg>
          <span v-else-if="showNumber">{{ numberLabel }}</span>
        </slot>
      </span>
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
