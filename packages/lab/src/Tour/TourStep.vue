<script setup lang="ts">
import type { TargetRect, TourStepProps, TourStepSlots } from './types.js'
import { Button, Heading, HStack, Popover, Text, VStack } from '@astryx-vue/core'
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
const isActiveStep = computed(() => tour?.activeStepId.value === id)
const activeStepIndex = computed(() => tour?.activeStepIndex.value ?? 0)
const stepCount = computed(() => tour?.stepCount.value ?? 0)
const isFirstStep = computed(() => activeStepIndex.value <= 0)
const isLastStep = computed(() => stepCount.value > 0 && activeStepIndex.value === stepCount.value - 1)
const target = computed(() => toValue(props.targetRef))
const rect = shallowRef<TargetRect | null>(null)

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

onMounted(() => {
  unregister = tour?.registerStep(id)
})
onBeforeUnmount(() => {
  stopMeasuring()
  unregister?.()
})

function onOpenChange(open: boolean): void {
  if (!open)
    tour?.onDismiss('close')
}
</script>

<template>
  <template v-if="tour && isActiveStep">
    <TourHighlight
      :rect="rect"
      :has-backdrop="tour.hasBackdrop.value"
      @backdrop-click="tour.onDismiss('backdrop')"
    />
    <Popover
      :anchor="target"
      is-open
      :placement="placement"
      :alignment="alignment"
      width="fit-content"
      :label="heading"
      :has-light-dismiss="!tour.hasBackdrop.value"
      close-button-label="Close tour"
      @open-change="onOpenChange"
    >
      <template #content>
        <div class="astryx-tour-step" :data-testid="props['data-testid']">
          <VStack :gap="1">
            <Heading :level="4">
              {{ heading }}
            </Heading>
            <Text v-if="slots.default" type="body">
              <slot />
            </Text>
          </VStack>
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
      </template>
    </Popover>
  </template>
</template>
