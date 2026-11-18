<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { UseTooltipReturn } from './useTooltip.js'
import { computed } from 'vue'
import { useResolvedLayerTeleport } from '../composables/useLayerMountTarget.js'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import '../../styles/tooltip.css'

defineOptions({ name: 'AstryxTooltipSurface' })

/**
 * 对应原版 `useTooltip` 返回的 `renderTooltip`：把 hook 管的气泡渲染出来。
 * `Tooltip` 和 `InfoTip` 共用，气泡的挂载位置、样式和鼠标桥接都在这里。
 */
const props = defineProps<{
  /** `useTooltip` 的返回值，气泡的显示状态和定位都读它。 */
  tooltip: UseTooltipReturn
  /** 触发元素，用来决定气泡挂到哪里（对话框里、段落外）。 */
  anchor: HTMLElement | null
  /** 气泡里的文字。需要富文本时用默认插槽。 */
  content?: string
}>()

const target = useResolvedLayerTeleport(computed(() => props.anchor))

// hook 返回的 ref 对象本来就是给气泡元素写的，不是在改 prop 本身。
const { contentRef } = props.tooltip
function setContentRef(value: Element | ComponentPublicInstance | null): void {
  contentRef.value = value as HTMLElement | null
}
</script>

<template>
  <Teleport :to="target">
    <!-- eslint-disable-next-line vue-a11y/mouse-events-have-key-events, vue-a11y/no-static-element-interactions -- 气泡上的鼠标事件仅用于指针移入气泡时保持显示；键盘焦点由触发元素的 focusin / focusout 处理。 -->
    <div
      v-show="tooltip.isOpen.value"
      :ref="setContentRef"
      class="astryx-tooltip"
      :data-placement="tooltip.resolvedPlacement.value"
      :style="tooltip.contentStyle.value"
      v-bind="tooltip.contentProps.value"
    >
      <LayerContentBoundary>
        <slot>
          {{ content }}
        </slot>
      </LayerContentBoundary>
    </div>
  </Teleport>
</template>
