<script setup lang="ts">
import type { InfoTipProps } from './types.js'
import { computed, onMounted, onUpdated, ref, shallowRef, useAttrs, useTemplateRef } from 'vue'
import { useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import Icon from '../Icon/Icon.vue'
import { useComponentMessages } from '../locale/context.js'
import { infoTipMessages } from '../locale/messages/info-tip.js'
import TooltipSurface from '../Tooltip/TooltipSurface.vue'
import { useTooltip } from '../Tooltip/useTooltip.js'
import '../../styles/info-tip.css'

defineOptions({ name: 'AstryxInfoTip', inheritAttrs: false })

/**
 * 对应原版 `InfoTip`：一个小「i」按钮。悬停和键盘聚焦预览帮助文字，
 * 点击、轻点、回车或空格把它钉住，直到 Escape、再按一次、点到外面或焦点离开。
 *
 * 按钮是 `useTooltip` 的 `show()` / `hide()` 开关：hook 负责预览、保持、播报和关闭。
 */
withDefaults(defineProps<InfoTipProps>(), {
  content: '',
  label: undefined,
  size: 'sm',
})

defineSlots<{
  /** 需要富文本时代替 `content` 属性。 */
  content?: () => unknown
}>()

const messages = useComponentMessages({ infoTip: infoTipMessages })
const attrs = useAttrs()
const button = useTemplateRef<HTMLButtonElement>('button')
const element = computed(() => button.value ?? null)
const anchor = shallowRef<HTMLElement | null>(null)

defineExpose({ element })

// 粗指针下按钮周围长出看不见的点击带，朝 44px 长，碰到邻居就停在一半间距。
useTouchHitArea(element, true)

// 按压是否钉住了帮助。悬停或聚焦的预览不算钉住。
const isPinned = ref(false)
// 帮助是否显示（钉住或预览）：只有这时按钮才用 aria-controls 指向它。
const isShown = ref(false)

// 每一次关闭都结束钉住：再按一次、Escape、点到外面或焦点离开。
const tooltip = useTooltip({
  onShow: () => {
    isShown.value = true
  },
  onHide: () => {
    isShown.value = false
    isPinned.value = false
  },
})

function syncTrigger(): void {
  anchor.value = button.value
  tooltip.triggerRef.value = button.value
}
onMounted(syncTrigger)
onUpdated(syncTrigger)

// 主键的鼠标或笔按在预览上时先 show()：hook 自己的「按下即关」就会让它保持打开，随后的点击把它钉住。
function onPointerDownCapture(event: PointerEvent): void {
  if (event.button !== 0 || event.pointerType === 'touch' || isPinned.value || !isShown.value)
    return
  tooltip.show()
}

// 点击、轻点、回车或空格钉住帮助，再来一次就关闭。
// 这一下停在按钮上：外面可点击的行、卡片或标签不会响应，document 上的监听照样看得到。
function onClick(event: MouseEvent): void {
  event.stopPropagation()
  event.preventDefault()
  if (isPinned.value) {
    tooltip.hide()
    return
  }
  tooltip.show()
  isPinned.value = true
}
// Escape 不在这里处理：气泡在共用的关闭栈里，一次 Escape 不会同时关掉帮助和外层 Dialog。
</script>

<template>
  <button
    v-bind="attrs"
    ref="button"
    type="button"
    class="astryx-info-tip astryx-touch-hit-area"
    :aria-label="label ?? messages.infoTip.label"
    :aria-expanded="isPinned"
    :aria-controls="isShown ? tooltip.describedBy : undefined"
    @pointerdown.capture="onPointerDownCapture"
    @click="onClick"
  >
    <Icon icon="info" :size="size" />
  </button>
  <TooltipSurface :tooltip="tooltip" :anchor="anchor" :content="content">
    <slot name="content">
      {{ content }}
    </slot>
  </TooltipSurface>
</template>
