<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed, shallowRef, useAttrs } from 'vue'
import { useScrollableArea } from '../composables/useScrollableArea.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label: string
  /** 行窗口化时滚动区也在块方向上滚动，并占满父元素给的高度。 */
  hasBlockViewport?: boolean
}>()

const emit = defineEmits<{ viewport: [element: HTMLElement | null] }>()

const attrs = useAttrs()
const scroll = useScrollableArea({
  get axis() {
    return props.hasBlockViewport ? 'both' as const : 'inline' as const
  },
  overscroll: 'contain',
  keyboardAccess: { owner: 'content' },
})

const viewportEl = shallowRef<HTMLElement | null>(null)

function bindViewport(element: unknown): void {
  scroll.viewport(element)
  const node = element instanceof HTMLElement ? element : null
  viewportEl.value = node
  emit('viewport', node)
}

useScrollbars(viewportEl)

const tabindex = computed(() => (scroll.state.value.inline.isScrollable || scroll.state.value.block.isScrollable ? 0 : undefined))
const rootClass = computed(() => ['astryx-table-scroll', attrs.class])
// 块方向滚到头时把滚动交还给页面，长表格不困住页面滚动。
const rootStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  scroll.viewportStyle.value,
  props.hasBlockViewport ? { overscrollBehaviorY: 'auto' } : undefined,
])
</script>

<template>
  <div
    :ref="bindViewport"
    :class="rootClass"
    role="group"
    :aria-label="label"
    :data-block-viewport="hasBlockViewport || undefined"
    :tabindex="tabindex"
    v-bind="scroll.viewportAttrs.value"
    :style="rootStyle"
  >
    <!--
      表格的直接父元素永远不滚动：外层滚动区是唯一的视口。有的页面宿主给每个表格的父元素都写了
      不在层叠层里的 overflow-x: auto，只有内联样式压得住它；两个方向都写 visible，免得一边 visible
      一边滚动时被算成 auto。
    -->
    <div :ref="scroll.content" data-scroll-content style="overflow: visible">
      <slot />
    </div>
  </div>
</template>
