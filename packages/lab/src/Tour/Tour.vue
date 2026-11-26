<script setup lang="ts">
import type { TourEmits, TourProps, TourSlots } from './types.js'
import { computed, provide, ref, watch } from 'vue'
import { TOUR_CONTEXT_KEY } from './context.js'

defineOptions({ name: 'AstryxTour' })
const props = withDefaults(defineProps<TourProps>(), {
  hasBackdrop: false,
  isStepCountShown: false,
})
const emit = defineEmits<TourEmits>()
defineSlots<TourSlots>()

const stepIds = ref<string[]>([])
const activeStepIndex = ref(0)
const stepCount = computed(() => stepIds.value.length)
const activeStepId = computed(() => props.isActive ? stepIds.value[activeStepIndex.value] ?? null : null)

function registerStep(id: string): () => void {
  if (!stepIds.value.includes(id))
    stepIds.value.push(id)
  return () => {
    const index = stepIds.value.indexOf(id)
    if (index >= 0)
      stepIds.value.splice(index, 1)
  }
}

function next(): void {
  if (activeStepIndex.value < stepCount.value - 1)
    activeStepIndex.value += 1
  else
    emit('dismiss', 'complete')
}

function previous(): void {
  if (activeStepIndex.value > 0)
    activeStepIndex.value -= 1
}

function dismiss(source: Parameters<typeof emit>[1]): void {
  emit('dismiss', source)
}

// 开始引导时有焦点的元素。引导在一个拿不了焦点的目标上结束时，焦点还给它。
// 同步记录，赶在第一步把焦点移进说明框之前。
let opener: HTMLElement | null = null

function rememberOpener(): void {
  const active = typeof document === 'undefined' ? null : document.activeElement
  opener = active instanceof HTMLElement && active !== document.body ? active : null
}

if (props.isActive)
  rememberOpener()

watch(() => props.isActive, (active) => {
  if (active)
    rememberOpener()
  else
    activeStepIndex.value = 0
}, { flush: 'sync' })

watch(stepCount, (count) => {
  if (activeStepIndex.value >= count)
    activeStepIndex.value = Math.max(0, count - 1)
})

provide(TOUR_CONTEXT_KEY, {
  registerStep,
  activeStepId,
  activeStepIndex: computed(() => activeStepIndex.value),
  stepCount,
  isStepCountShown: computed(() => props.isStepCountShown),
  hasBackdrop: computed(() => props.hasBackdrop),
  onNext: next,
  onPrevious: previous,
  onDismiss: dismiss,
  getOpener: () => opener,
})
</script>

<template>
  <slot />
</template>
