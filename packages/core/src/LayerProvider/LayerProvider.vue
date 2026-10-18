<script setup lang="ts">
import type { LayerContextValue } from './context.js'
import type { LayerProviderProps, LayerProviderSlots } from './types.js'
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { resetLayerSafeArea } from '../layer/gutter.js'
import { layerContextKey, layerNestingKey } from './context.js'
import { mergeInset, resolveInset } from './inset.js'

defineOptions({ name: 'AstryxLayerProvider', inheritAttrs: false })

const props = defineProps<LayerProviderProps>()
defineSlots<LayerProviderSlots>()

const isNested = inject(layerNestingKey, false)

// 设备安全区会随屏幕旋转变化，转一次就重新量。
const measureVersion = ref(0)
function remeasure(): void {
  resetLayerSafeArea()
  measureVersion.value += 1
}
onMounted(() => window.addEventListener('resize', remeasure))
onBeforeUnmount(() => window.removeEventListener('resize', remeasure))

const config = computed<LayerContextValue>(() => {
  void measureVersion.value
  return {
    inset: resolveInset(props.inset) ?? {},
    toast: {
      position: props.toast?.position,
      maxVisible: props.toast?.maxVisible,
      inset: mergeInset(props.toast?.inset, props.inset),
    },
  }
})

if (!isNested) {
  provide(layerNestingKey, true)
  provide(layerContextKey, config)
}
</script>

<template>
  <slot />
</template>
