<script setup lang="ts">
import type { LayerContextValue } from './context.js'
import type { LayerProviderProps, LayerProviderSlots } from './types.js'
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { resetLayerSafeArea, resolveLayerGutter } from '../layer/gutter.js'
import { LAYER_MAX_INLINE_SIZE_VAR, layerMaxInlineSize } from '../layer/inlineSize.js'
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

  // 浮层的宽度上限要靠 CSS 变量才到得了被 Teleport 出去的浮层，所以写在根元素上。
  // 没有 provider 时 `layer/inlineSize.ts` 里的默认值接管。
  function syncMaxInlineSize(): void {
    if (typeof document === 'undefined')
      return
    document.documentElement.style.setProperty(
      LAYER_MAX_INLINE_SIZE_VAR,
      layerMaxInlineSize(resolveLayerGutter(config.value.inset)),
    )
  }

  watch(config, syncMaxInlineSize, { immediate: true })
  onBeforeUnmount(() => {
    if (typeof document === 'undefined')
      return
    document.documentElement.style.removeProperty(LAYER_MAX_INLINE_SIZE_VAR)
  })
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
