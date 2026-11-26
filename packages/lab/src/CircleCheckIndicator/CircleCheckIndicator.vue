<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { CircleCheckIndicatorProps } from './types.js'
import { isRenderable } from '@astryx-vue/core'
import { computed, useAttrs, useSlots } from 'vue'
import '../../styles/circle-check-indicator.css'

defineOptions({ name: 'AstryxCircleCheckIndicator', inheritAttrs: false })

withDefaults(defineProps<CircleCheckIndicatorProps>(), {
  size: 'md',
  isDisabled: false,
})

const attrs = useAttrs()
const slots = useSlots()
const BLOCKED = new Set(['role', 'tabindex', 'contenteditable'])
// 装饰图形自己不出声：角色、tab 停靠点和 aria 属性留在拥有名称的控件上，调用方转发过来也不要。
const passed = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => {
  const normalized = key.toLowerCase()
  return !normalized.startsWith('aria') && !BLOCKED.has(normalized)
})))
// 默认插槽有内容（比如 CheckboxInput 等待时传的加载圈）就画它，不画标记。
function hasReplacement(): boolean {
  return isRenderable(slots.default?.() as VNodeChild)
}
</script>

<template>
  <span
    v-bind="passed"
    class="astryx-circle-check-indicator"
    aria-hidden="true"
    :data-state="state"
    :data-size="size"
    :data-disabled="isDisabled ? 'disabled' : undefined"
  >
    <slot v-if="hasReplacement()" />
    <template v-else>
      <!-- 对勾的墨迹撑满自己的盒子：圆头正好碰到边。 -->
      <svg class="astryx-circle-check-indicator-check" :data-size="size" viewBox="0 0 10 10" focusable="false">
        <path
          d="M0.75 5.25L3.75 9.25L9.25 0.75" stroke="currentColor" stroke-width="1.5" fill="none"
          stroke-linecap="round" stroke-linejoin="round"
        />
      </svg>
      <span class="astryx-circle-check-indicator-dash" :data-size="size" />
    </template>
  </span>
</template>
