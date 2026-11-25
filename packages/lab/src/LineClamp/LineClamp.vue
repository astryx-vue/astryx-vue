<script setup lang="ts">
import type { ClampObservation } from './clampFocusables.js'
import type { LineClampProps, LineClampSlots } from './types.js'
import { Tooltip, useTruncation } from '@astryx-vue/core'
import { computed, onBeforeUnmount, onMounted, onUpdated, shallowRef, useAttrs } from 'vue'
import { observeClamp, ROOT_ATTRIBUTE } from './clampFocusables.js'
import { useClampTooltip } from './useClampTooltip.js'
import '../../styles/line-clamp.css'

defineOptions({ name: 'AstryxLineClamp', inheritAttrs: false })

/**
 * 把任意内容截成固定行数，结尾带省略号。`Text` 的 `maxLines` 截的是一个 Text 元素；
 * LineClamp 截它包住的任何内容，自己不加字体、颜色或换行样式，适合混合的行内内容和嵌套元素。
 * 截断检测复用 `useTruncation`，即使 `-webkit-line-clamp` 夹住了 scrollHeight 也量得准。
 */
const props = withDefaults(defineProps<LineClampProps>(), {
  hasTruncateTooltip: true,
  truncateTooltipPlacement: 'above',
  as: 'div',
})
defineSlots<LineClampSlots>()

const attrs = useAttrs()
const root = shallowRef<HTMLElement | null>(null)
// 截断按高度量：单行时盒子仍会换行，横向不会溢出，所以 1 行也按多行的方式量。
const truncation = useTruncation(() => props.maxLines > 0 ? Math.max(props.maxLines, 2) : 0)
const isTooltipEnabled = computed(() => props.hasTruncateTooltip && props.maxLines > 0 && truncation.isTruncated.value)
const tooltip = useClampTooltip(() => isTooltipEnabled.value)
// 截断的容器是 Tab 停靠点，键盘也能打开显示全文的提示；调用方自己的 tabindex 优先。
const tabindex = computed(() => attrs.tabindex ?? attrs.tabIndex ?? (isTooltipEnabled.value ? 0 : undefined))
const style = computed(() => [attrs.style, { WebkitLineClamp: props.maxLines }])

let clamp: ClampObservation | null = null

function bindRoot(value: unknown): void {
  const element = value instanceof HTMLElement ? value : null
  if (element === root.value)
    return
  clamp?.stop()
  root.value = element
  truncation.bind(element)
  clamp = element == null ? null : observeClamp(element)
}

// 渲染之后再查一遍；不渲染的变化由 clampFocusables 里的观察者负责。
onMounted(() => clamp?.sync())
onUpdated(() => clamp?.sync())
onBeforeUnmount(() => {
  clamp?.stop()
  clamp = null
})

// 焦点离开后，刚才因为持有焦点而没藏的链接如果被裁掉了，现在可以藏了。
function onFocusout(event: FocusEvent): void {
  clamp?.sync(event.relatedTarget instanceof Element ? event.relatedTarget : null)
}
</script>

<template>
  <component
    :is="as"
    :ref="bindRoot"
    v-bind="{ ...attrs, [ROOT_ATTRIBUTE]: '' }"
    class="astryx-line-clamp"
    :style="style"
    :tabindex="tabindex"
    @pointerenter="tooltip.onPointerenter"
    @pointerleave="tooltip.onPointerleave"
    @pointerdown="tooltip.onPointerdown"
    @focusin="tooltip.onFocusin"
    @focusout="onFocusout"
  >
    <slot />
    <Tooltip
      v-if="tooltip.isMounted.value"
      :anchor="root"
      :is-enabled="isTooltipEnabled"
      :content="truncation.fullText.value"
      :placement="truncateTooltipPlacement"
      :has-hover-indication="false"
      is-default-open
    />
  </component>
</template>
