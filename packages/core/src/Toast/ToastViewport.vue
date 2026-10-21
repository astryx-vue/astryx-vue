<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ResolvedLayerInset } from '../LayerProvider/context.js'
import type { ToastDismissReason, ToastPlacement } from './types.js'
import { computed, reactive, watch } from 'vue'
import { useActiveModalOutlet } from '../layer/modalOutlet.js'
import { useLayerConfig } from '../LayerProvider/context.js'
import { toastStore } from './store.js'
import Toast from './Toast.vue'

const props = defineProps<{
  placement?: ToastPlacement
}>()

// LayerProvider 可以给 toast 视口定位置、可见上限和逐边偏移。
const layer = useLayerConfig()

// 打开的模态对话框会压住页面其它部分，toast 得搬进去才能看见、才能点。
const activeModal = useActiveModalOutlet()
const teleportTarget = computed<string | HTMLElement>(() => activeModal.value ?? 'body')

const placement = computed(() => props.placement ?? layer?.value.toast.position ?? 'bottom-end')

const isTopPlacement = computed(() => placement.value.startsWith('top'))

const classes = computed(() => [
  'astryx-toast-viewport',
  // 浮层根：切断外面继承进来的排版（`layer.css` 的重置）。
  'astryx-layer',
  `astryx-toast-viewport--placement-${placement.value}`,
])

/** 超出可见上限时只渲染最新的几条。 */
const visibleToasts = computed(() => {
  const max = layer?.value.toast.maxVisible
  const toasts = toastStore.toasts
  if (max == null || max < 0 || toasts.length <= max)
    return toasts
  return toasts.slice(toasts.length - max)
})

const INSET_EDGES = [
  ['padding-block-start', 'blockStart', 'top'],
  ['padding-block-end', 'blockEnd', 'bottom'],
  ['padding-inline-start', 'inlineStart', 'left'],
  ['padding-inline-end', 'inlineEnd', 'right'],
] as const

/**
 * 逐边偏移叠在基础内边距上。基础内边距取间距第 4 档和设备安全区的较大者，
 * 和锚定浮层的视口空隙保持一致。没有 provider 时不写内联样式，保持原来的样子。
 */
const viewportStyle = computed<CSSProperties | undefined>(() => {
  const inset: ResolvedLayerInset | undefined = layer?.value.toast.inset
  if (inset == null)
    return undefined

  const style: Record<string, string> = {}
  for (const [property, edge, areaEdge] of INSET_EDGES) {
    const extra = inset[edge] ?? 0
    style[property] = `calc(max(var(--astryx-spacing-4, 16px), env(safe-area-inset-${areaEdge}, 0px)) + ${extra}px)`
  }
  return style as CSSProperties
})

// Rows clip their toast while the row track opens and closes. Once a row has
// settled the clip is released so the card shadow can paint.
const settled = reactive(new Set<string>())

function handleRowTransitionEnd(id: string, event: TransitionEvent) {
  if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows')
    return
  const item = toastStore.toasts.find(t => t.id === id)
  if (!item)
    return
  if (item.isExiting)
    toastStore.finalize(id)
  else
    settled.add(id)
}

function handleDismiss(id: string, reason: ToastDismissReason) {
  settled.delete(id)
  toastStore.dismissFromCard(id, reason)
}

watch(
  () => toastStore.toasts.map(t => t.id).join(','),
  () => {
    const live = new Set(toastStore.toasts.map(t => t.id))
    for (const id of [...settled]) {
      if (!live.has(id))
        settled.delete(id)
    }
  },
)
</script>

<template>
  <Teleport :to="teleportTarget">
    <div
      :class="classes"
      :style="viewportStyle"
      aria-live="polite"
      aria-atomic="false"
    >
      <div
        v-for="toast in visibleToasts"
        :key="toast.id"
        class="astryx-toast-viewport__row"
        :class="[
          isTopPlacement ? 'astryx-toast-viewport__row--from-top' : 'astryx-toast-viewport__row--from-bottom',
          { 'astryx-toast-viewport__row--exiting': toast.isExiting },
        ]"
        @transitionend="handleRowTransitionEnd(toast.id, $event)"
      >
        <div
          class="astryx-toast-viewport__clip"
          :class="{ 'astryx-toast-viewport__clip--settled': settled.has(toast.id) }"
        >
          <Toast
            :type="toast.type"
            :body="toast.body"
            :is-auto-hide="toast.isAutoHide"
            :auto-hide-duration="toast.autoHideDuration"
            :end-content="toast.endContent"
            :is-exiting="toast.isExiting"
            @dismiss="handleDismiss(toast.id, $event)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
