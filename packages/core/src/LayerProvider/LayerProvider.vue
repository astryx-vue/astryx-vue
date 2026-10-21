<script setup lang="ts">
import type { LayerContextValue } from './context.js'
import type { LayerProviderProps, LayerProviderSlots } from './types.js'
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { resetLayerSafeArea, resolveLayerGutter } from '../layer/gutter.js'
import { layerMaxInlineSize, releaseLayerMaxInlineSize, retainLayerMaxInlineSize } from '../layer/inlineSize.js'
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

/** 外面那层 provider 的配置。没有就是 null。 */
const outer = inject(layerContextKey, null)

if (!isNested) {
  provide(layerNestingKey, true)
  provide(layerContextKey, config)

  // 宽度上限写在 html 上。多个根同时在时后挂的那份生效，卸掉以后回到上一份。
  const inlineSizeToken = {}

  function syncMaxInlineSize(): void {
    retainLayerMaxInlineSize(
      inlineSizeToken,
      layerMaxInlineSize(resolveLayerGutter(config.value.inset)),
    )
  }

  watch(config, syncMaxInlineSize, { immediate: true })
  onBeforeUnmount(() => releaseLayerMaxInlineSize(inlineSizeToken))
}
else if (outer != null && props.inset != null) {
  // 嵌在另一层 provider 里，自己又声明了常驻条：只把这一条的偏移收紧给子树里的锚定浮层，
  // toast 仍然是根那层的配置（toast 视口只有一份）。
  provide(layerContextKey, computed<LayerContextValue>(() => ({
    ...outer.value,
    inset: resolveInset(props.inset) ?? {},
  })))
}
</script>

<template>
  <slot />
</template>
