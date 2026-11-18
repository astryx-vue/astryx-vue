<script setup lang="ts">
import type { VNode } from 'vue'
import type { StepProgress, StepProps, StepSlots } from './types.js'
import { Comment, computed, Fragment, onUnmounted, Text, watch } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { useStepperContext } from './context.js'
import { connectorFillTiming, resolveStepGlyph, STEP_FILL_ARRIVAL_SHARE_H, STEP_FILL_ARRIVAL_SHARE_V } from './logic.js'
import StepMarker from './StepMarker.vue'
import '../../styles/stepper.css'
import '../../styles/stepper-track.css'

defineOptions({ name: 'AstryxStep' })

const props = withDefaults(defineProps<StepProps>(), {
  indicator: 'auto',
  isDisabled: false,
  isOptional: false,
})

defineSlots<StepSlots>()

/** 插槽里只有注释（比如 v-if 为假）或空白时不算有内容，不渲染内容区。 */
function hasContent(nodes: VNode[] | undefined): boolean {
  return nodes?.some((node) => {
    if (node.type === Comment)
      return false
    if (node.type === Fragment)
      return hasContent(node.children as VNode[])
    if (node.type === Text)
      return typeof node.children === 'string' && node.children.trim() !== ''
    return true
  }) ?? false
}

const stepper = useStepperContext()
const messages = useAstryxMessages()
const { pressableProps } = usePressFeedback({ hasOverlay: false })

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
// 和原版一致：只要传了 step-click，禁用步骤也保留按钮（aria-disabled），只是不触发。
const hasControl = computed(() => stepper.isNonLinear.value === true)
const isClickable = computed(() => hasControl.value && !props.isDisabled)
const numberLabel = computed(() => String(props.step + 1))
const glyph = computed(() => resolveStepGlyph({
  progress: progress.value,
  indicator: props.indicator,
  status: props.status,
}))
const collapsed = computed(() => stepper.collapsed.value === true)
// 横向 + 轨道模式：轨道（连接线 + 指示点）画在控件里面，和标签同属一个点击目标。
const isTrack = computed(() => (
  orientation.value === 'horizontal' && indicatorPosition.value === 'on-track' && !collapsed.value
))
const leadFilled = computed(() => props.step <= stepper.activeStep.value)
const trailFilled = computed(() => props.step < stepper.activeStep.value)
const arrivalShare = computed(() => (
  orientation.value === 'vertical' ? STEP_FILL_ARRIVAL_SHARE_V : STEP_FILL_ARRIVAL_SHARE_H
))
const leavingShare = computed(() => 1 - arrivalShare.value)
// 分离模式：这一步的进度条就是整段。
// 轨道模式：同一段拆成上一步的后半截和这一步的前半截，两截按顺序接上。
const barTiming = computed(() => connectorFillTiming(
  stepper.activeStep.value,
  stepper.previousActiveStep.value,
  props.step - 1,
  0,
  1,
))
const leadTiming = computed(() => connectorFillTiming(
  stepper.activeStep.value,
  stepper.previousActiveStep.value,
  props.step - 1,
  leavingShare.value,
  arrivalShare.value,
))
const trailTiming = computed(() => connectorFillTiming(
  stepper.activeStep.value,
  stepper.previousActiveStep.value,
  props.step,
  0,
  leavingShare.value,
))

function fillVars(timing: { duration: string, delay: string }) {
  return {
    '--_step-fill-duration': timing.duration,
    '--_step-fill-delay': timing.delay,
  }
}

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
    :data-glyph="glyph"
    :data-progress="progress"
    :data-status="status"
  >
    <span
      v-if="indicatorPosition === 'separated' || collapsed"
      class="astryx-step-bar"
      :data-filled="leadFilled || undefined"
      :style="fillVars(barTiming)"
    />
    <span v-else-if="orientation === 'vertical'" class="astryx-step-rail">
      <span class="astryx-step-connector astryx-step-connector-lead" :data-filled="leadFilled || undefined" :style="fillVars(leadTiming)" />
      <span class="astryx-step-connector astryx-step-connector-trail" :data-filled="trailFilled || undefined" :style="fillVars(trailTiming)" />
    </span>
    <div class="astryx-step-body">
      <component
        :is="hasControl ? 'button' : 'div'"
        v-bind="hasControl ? pressableProps : undefined"
        class="astryx-step-control"
        :aria-label="hasControl ? accessibleName : undefined"
        :aria-disabled="hasControl && isDisabled ? 'true' : undefined"
        :type="hasControl ? 'button' : undefined"
        @click="activate"
      >
        <span v-if="isTrack" class="astryx-step-track">
          <span class="astryx-step-connector astryx-step-connector-lead" :data-filled="leadFilled || undefined" :style="fillVars(leadTiming)" />
          <StepMarker :glyph="glyph" :number-label="numberLabel" :status="status" :is-disabled="isDisabled">
            <template v-if="$slots.icon" #icon>
              <slot name="icon" />
            </template>
          </StepMarker>
          <span class="astryx-step-connector astryx-step-connector-trail" :data-filled="trailFilled || undefined" :style="fillVars(trailTiming)" />
        </span>
        <span class="astryx-step-row">
          <StepMarker v-if="!isTrack" :glyph="glyph" :number-label="numberLabel" :status="status" :is-disabled="isDisabled">
            <template v-if="$slots.icon" #icon>
              <slot name="icon" />
            </template>
          </StepMarker>
          <span class="astryx-step-label-row">
            <span class="astryx-step-label" :data-disabled="isDisabled || undefined" :data-progress="progress" :data-status="status">{{ label }}</span>
            <VisuallyHidden v-if="hiddenStatus">{{ hiddenStatus }}</VisuallyHidden>
            <template v-if="isOptional">
              <span class="astryx-step-optional">•</span>
              <span class="astryx-step-optional">{{ messages.stepper.optional }}</span>
            </template>
            <slot name="end" />
          </span>
        </span>
        <span v-if="description" class="astryx-step-description" :data-progress="progress" :data-status="status">{{ description }}</span>
      </component>
      <div v-if="hasContent($slots.default?.())" class="astryx-step-content">
        <slot />
      </div>
    </div>
  </li>
</template>
