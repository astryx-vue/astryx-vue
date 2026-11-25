<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { computed, toRef } from 'vue'
import { useLayer } from '../composables/useLayer.js'
import { useResolvedLayerTeleport } from '../composables/useLayerMountTarget.js'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import '../../styles/tooltip.css'

defineOptions({ name: 'AstryxCutTextTooltip' })

/**
 * 显示被截短的完整文字（按钮标签、表头标题）。挂着就是打开的，由使用方决定何时卸载。
 * 内容就是锚点自己的名称，所以不给锚点加 aria-describedby，读屏不会把名称再读一遍。
 */
const props = defineProps<{
  anchor: HTMLElement | null
  text: string
}>()

const anchor = toRef(props, 'anchor')
const layer = useLayer({ mode: 'context', anchor, placement: 'above', gap: 4, isDefaultOpen: true })
const target = useResolvedLayerTeleport(computed(() => props.anchor))

function setContentRef(value: Element | ComponentPublicInstance | null): void {
  layer.contentRef.value = value as HTMLElement | null
}
</script>

<template>
  <Teleport :to="target">
    <div
      :id="layer.id"
      :ref="setContentRef"
      class="astryx-tooltip"
      role="tooltip"
      :data-placement="layer.resolvedPlacement.value"
      :style="layer.contentStyle.value"
    >
      <LayerContentBoundary>{{ text }}</LayerContentBoundary>
    </div>
  </Teleport>
</template>
