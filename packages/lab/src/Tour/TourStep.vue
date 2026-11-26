<script setup lang="ts">
import type { TargetRect, TourStepProps, TourStepSlots } from './types.js'
import { Button, Heading, HStack, IconButton, Text, useDismiss, useLayer, useResolvedLayerTeleport, VStack } from '@astryx-vue/core'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, shallowRef, toValue, useId, useSlots, watch } from 'vue'
import { TOUR_CONTEXT_KEY } from './context.js'
import TourHighlight from './TourHighlight.vue'
import '../../styles/tour.css'

defineOptions({ name: 'AstryxTourStep' })
const props = withDefaults(defineProps<TourStepProps>(), {
  placement: 'below',
  alignment: 'start',
})
defineSlots<TourStepSlots>()
const slots = useSlots()
const tour = inject(TOUR_CONTEXT_KEY, null)
const id = `astryx-tour-step-${useId()}`
const headingId = `${id}-heading`
const isActiveStep = computed(() => tour?.activeStepId.value === id)
const activeStepIndex = computed(() => tour?.activeStepIndex.value ?? 0)
const stepCount = computed(() => tour?.stepCount.value ?? 0)
const isFirstStep = computed(() => activeStepIndex.value <= 0)
const isLastStep = computed(() => stepCount.value > 0 && activeStepIndex.value === stepCount.value - 1)
const target = computed(() => toValue(props.targetRef))
const rect = shallowRef<TargetRect | null>(null)

// 说明框锚在高亮框上：高亮框按目标量出来的位置摆，目标被按下时缩放也不会带着说明框动。
const highlight = shallowRef<HTMLElement | null>(null)
const teleportTarget = useResolvedLayerTeleport(target)

// 非模态、不响应点击外部的锚定浮层：没有遮罩时，按页面或目标不会结束引导；
// 有遮罩时由遮罩接住那一下按压。Tab 可以离开说明框回到页面。
const layer = useLayer({
  mode: 'context',
  anchor: highlight,
  placement: () => props.placement,
  alignment: () => props.alignment,
  // 比默认空隙多留 8px，高亮环（比目标大一圈）不会被说明框盖住。
  gap: 12,
  isDefaultOpen: true,
})
const region = layer.contentRef

// Escape 走共享的浮层关闭栈，只打最上面一层。
useDismiss({
  container: region,
  isEnabled: isActiveStep,
  dismissOnPointerOutside: false,
  onDismiss: () => tour?.onDismiss('escape'),
})

let unregister: (() => void) | undefined

function measure(): void {
  const element = target.value
  if (element == null || !isActiveStep.value) {
    rect.value = null
    return
  }
  const box = element.getBoundingClientRect()
  rect.value = {
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    radius: getComputedStyle(element).borderRadius || '0px',
  }
}

function stopMeasuring(): void {
  if (typeof window === 'undefined')
    return
  window.removeEventListener('scroll', measure, true)
  window.removeEventListener('resize', measure)
}

watch([isActiveStep, target], async ([active]) => {
  stopMeasuring()
  if (!active || tour == null) {
    rect.value = null
    return
  }
  await nextTick()
  measure()
  window.addEventListener('scroll', measure, true)
  window.addEventListener('resize', measure)
}, { immediate: true, flush: 'post' })

// 步骤开始时焦点移到说明框，读屏先读到它的标题。
watch(isActiveStep, async (active) => {
  if (!active)
    return
  await nextTick()
  region.value?.focus({ preventScroll: true })
}, { immediate: true, flush: 'post' })

function isFocusable(element: HTMLElement | null): element is HTMLElement {
  return element != null && element.isConnected && element.tabIndex >= 0 && !element.hasAttribute('disabled')
}

// 引导结束时，焦点还在说明框里或者已经丢了，就还给目标；目标拿不了焦点，就还给开始引导时有焦点的元素。
// 用户自己把焦点移到页面别处的，不去动它。
function returnFocusAfterTour(): void {
  if (tour == null || tour.activeStepId.value != null)
    return
  const active = document.activeElement
  const callout = region.value
  const hadFocus = active == null || active === document.body || (callout?.contains(active) ?? false)
  if (!hadFocus)
    return
  const destination = isFocusable(target.value) ? target.value : tour.getOpener()
  void nextTick(() => {
    const now = document.activeElement
    if (now == null || now === document.body || !now.isConnected)
      destination?.focus()
  })
}

watch(isActiveStep, (active, wasActive) => {
  if (wasActive && !active)
    returnFocusAfterTour()
}, { flush: 'pre' })

onMounted(() => {
  unregister = tour?.registerStep(id)
})
onBeforeUnmount(() => {
  stopMeasuring()
  if (isActiveStep.value)
    returnFocusAfterTour()
  unregister?.()
})
</script>

<template>
  <template v-if="tour && isActiveStep">
    <TourHighlight
      :highlight-ref="(element: HTMLElement | null) => { highlight = element }"
      :rect="rect"
      :has-backdrop="tour.hasBackdrop.value"
      @backdrop-click="tour.onDismiss('backdrop')"
    />
    <Teleport :to="teleportTarget">
      <section
        :id="layer.id"
        ref="region"
        class="astryx-tour-callout"
        :data-placement="layer.resolvedPlacement.value"
        :style="layer.contentStyle.value"
        :aria-labelledby="headingId"
        tabindex="-1"
      >
        <div class="astryx-tour-step" :data-testid="props['data-testid']">
          <HStack class="astryx-tour-step__header" :gap="2">
            <VStack :gap="1">
              <Heading :id="headingId" :level="4">
                {{ heading }}
              </Heading>
              <Text v-if="slots.default" type="body">
                <slot />
              </Text>
            </VStack>
            <IconButton class="astryx-tour-step__close" variant="ghost" size="sm" label="Close tour" @click="tour.onDismiss('close')">
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </IconButton>
          </HStack>
          <HStack class="astryx-tour-step__footer" :gap="2" h-align="between">
            <Text v-if="tour.isStepCountShown.value && stepCount > 0" type="supporting" color="secondary">
              {{ activeStepIndex + 1 }} of {{ stepCount }}
            </Text>
            <span v-else />
            <HStack :gap="2">
              <Button v-if="!isFirstStep" variant="ghost" size="sm" label="Back" @click="tour.onPrevious" />
              <Button variant="primary" size="sm" :label="isLastStep ? 'Done' : 'Next'" @click="tour.onNext" />
            </HStack>
          </HStack>
        </div>
      </section>
    </Teleport>
  </template>
</template>
