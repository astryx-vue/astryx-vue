<script setup lang="ts">
import type { ToolbarProps, ToolbarSlots } from './types.js'
import { computed } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
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
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role="toolbar" 的焦点在内部控件上循环，容器只接收冒泡的方向键。 -->
  <div
    ref="listRef"
    class="astryx-toolbar"
    :class="[
      `astryx-toolbar--${size}`,
      `astryx-toolbar--${orientation}`,
      {
        'astryx-toolbar--centered': $slots.center,
        'astryx-toolbar--muted': variant === 'muted',
        'astryx-toolbar--divider-top': dividers?.includes('top'),
        'astryx-toolbar--divider-bottom': dividers?.includes('bottom'),
        'astryx-toolbar--divider-start': dividers?.includes('start'),
        'astryx-toolbar--divider-end': dividers?.includes('end'),
      },
    ]"
    role="toolbar"
    :aria-label="label"
    :aria-orientation="orientation"
    :style="{ '--astryx-toolbar-gap': `var(--astryx-spacing-${gapToken})` }"
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
</template>
