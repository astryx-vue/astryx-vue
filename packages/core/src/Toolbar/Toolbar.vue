<script setup lang="ts">
import type { ToolbarProps, ToolbarSlots } from './types.js'
import { computed } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import Section from '../Section/Section.vue'
import '../../styles/toolbar.css'

defineOptions({ name: 'AstryxToolbar' })

const props = withDefaults(defineProps<ToolbarProps>(), {
  gap: 1,
  orientation: 'horizontal',
  size: 'md',
  variant: 'transparent',
})

defineSlots<ToolbarSlots>()

const gapToken = computed(() => String(props.gap).replace('.', '-'))
const { listRef, handleKeyDown, handleFocus } = useListFocus({
  boundarySelector: '[role="toolbar"], [role="menu"], [role="dialog"]',
  hasHomeEnd: true,
  hasRovingTabIndex: true,
  itemSelector: 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])',
  hasCaretGuard: true,
  orientation: props.orientation === 'vertical' ? 'vertical' : 'horizontal',
  wrap: true,
})
void listRef.value

/** 带底部分隔线时，选中标签的指示条要穿过工具栏的块向内边距落到分隔线上。 */
const toolbarStyle = computed(() => ({
  '--astryx-toolbar-gap': `var(--astryx-spacing-${gapToken.value})`,
  '--_tab-indicator-bottom': props.dividers?.includes('bottom')
    ? 'calc(-1 * (var(--astryx-spacing-2, 8px) + 1px))'
    : undefined,
}))
</script>

<template>
  <!--
    和原版一样，工具栏外面套一层 Section：横向内边距来自主题的 section 内边距，
    并抵消父容器（Card、Section）的内边距；底色和分隔线也由 Section 画。
  -->
  <Section :variant="variant" :padding-block="2" :dividers="dividers">
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role="toolbar" 的焦点在内部控件上循环，容器只接收冒泡的方向键。 -->
    <div
      ref="listRef"
      class="astryx-toolbar"
      :class="[
        `astryx-toolbar--${size}`,
        `astryx-toolbar--${orientation}`,
        { 'astryx-toolbar--centered': $slots.center },
      ]"
      role="toolbar"
      :aria-label="label"
      :aria-orientation="orientation"
      :style="toolbarStyle"
      @focusin="handleFocus"
      @keydown="handleKeyDown"
    >
      <div v-if="$slots.start" class="astryx-toolbar__slot astryx-toolbar__slot--start">
        <slot name="start" />
      </div>
      <div v-if="$slots.center" class="astryx-toolbar__slot astryx-toolbar__slot--center">
        <slot name="center" />
      </div>
      <div v-if="$slots.end" class="astryx-toolbar__slot astryx-toolbar__slot--end">
        <slot name="end" />
      </div>
    </div>
  </Section>
</template>
