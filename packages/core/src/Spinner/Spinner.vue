<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SpinnerProps, SpinnerSize } from './types.js'
import { computed, inject, useAttrs, useId, useSlots, useTemplateRef } from 'vue'
import { useAnnounceRenderedText } from '../composables/internal/announceRenderedText.js'
import { useComponentMessages } from '../locale/context.js'
import { spinnerMessages } from '../locale/messages/spinner.js'
import { registerSpinnerGeometry } from './spinnerGeometry.js'
import { spinnerOwnerKey } from './SpinnerOwnerContext.js'
import SpinnerRing from './SpinnerRing.vue'
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
const messages = useComponentMessages({ spinner: spinnerMessages })
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
// 调用方写了别的角色（比如 img）就照它来，并且保持安静；默认是 progressbar。
const ringRole = computed(() => (attrs.role as string | undefined) ?? 'progressbar')
const rootAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'aria-label' && key !== 'style' && key !== 'role'),
))

// 只有独立的加载圈自己播报：拥有任务的核心组件通过 spinnerOwnerKey 让它安静，
// 应用代码用 aria-hidden；调用方写了 progressbar 以外的角色也保持安静。
const isComposedInOwner = inject(spinnerOwnerKey, false)
const ringEl = useTemplateRef<HTMLElement>('ring')
function announces() {
  if (isComposedInOwner || ringRole.value !== 'progressbar')
    return false
  if (attrs['aria-hidden'] === true || attrs['aria-hidden'] === 'true')
    return false
  return ringEl.value?.closest('[aria-hidden="true"]') == null
}
const announcedName = computed(() => ariaLabel.value ?? props.label ?? messages.value.spinner.loading)
useAnnounceRenderedText(ringEl, announces, { skipFirstRender: true, fallbackText: announcedName })
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
      ref="ring"
      class="astryx-spinner-box"
      :role="ringRole"
      :aria-label="ringAriaLabel"
      :aria-labelledby="ringLabelledBy"
      :style="boxStyle"
    >
      <SpinnerRing :frame-size="frameSize" :diameter="geometry.diameter" :stroke="geometry.stroke" :arc-length="arcLength" :gap-length="gapLength" />
    </span>
    <span :id="labelId" class="astryx-spinner-label">
      <slot name="label">{{ label }}</slot>
    </span>
  </div>
  <span
    v-else
    v-bind="rootAttrs"
    ref="ring"
    class="astryx-spinner astryx-spinner-box"
    :role="ringRole"
    :data-size="size"
    :data-shade="shade"
    :aria-label="ringAriaLabel"
    :style="rootStyle"
  >
    <SpinnerRing :frame-size="frameSize" :diameter="geometry.diameter" :stroke="geometry.stroke" :arc-length="arcLength" :gap-length="gapLength" />
  </span>
</template>
