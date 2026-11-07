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

watch(() => props.isActive, (active) => {
  if (!active)
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
})
</script>

<template>
  <slot />
</template>
