<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ResolvedLayerInset } from '../LayerProvider/context.js'
import type { ToastDismissReason, ToastPlacement } from './types.js'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useActiveModalOutlet, whenModalSettled } from '../layer/modalOutlet.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useLayerConfig } from '../LayerProvider/context.js'
import { readToastMotionDurationMs } from './motionDuration.js'
import { toastStore } from './store.js'
import Toast from './Toast.vue'

const props = defineProps<{
  placement?: ToastPlacement
}>()

// toast 内容是这一层的成员边界：外面组里的尺寸、禁用、选中值都不再算数。
resetLayerScopedContext()

// LayerProvider 可以给 toast 视口定位置、可见上限和逐边偏移。
const layer = useLayerConfig()

// 打开的模态对话框会压住页面其它部分，toast 得搬进去才能看见、才能点。
const activeModal = useActiveModalOutlet()
const mountTarget = ref<string | HTMLElement>('body')

const viewportRef = ref<HTMLElement | null>(null)

/** 等两帧，让浏览器把上一步的样式算完。没有 `requestAnimationFrame` 时立刻返回。 */
function afterTwoFrames(): Promise<void> {
  if (typeof requestAnimationFrame !== 'function')
    return Promise.resolve()
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

/**
 * 把视口放进顶层（`popover="manual"`）：顶层元素画在页面最上面。
 *
 * 节点被搬过（`remove` + `insert`）浏览器会自己把 popover 关掉，所以每次搬完都要
 * 重新打开一次；浏览器不支持时什么也不做。
 */
function syncTopLayer(): void {
  const element = viewportRef.value
  if (element == null || typeof element.showPopover !== 'function')
    return
  let isShowing = false
  try {
    isShowing = element.matches(':popover-open')
  }
  catch {
    // 不支持 `:popover-open` 的引擎当作没打开，重开一次也无害。
  }
  if (isShowing)
    return
  try {
    element.showPopover()
  }
  catch {
    // 已经在顶层，或者环境不支持。
  }
}

// 节点被搬来搬去时浏览器会把它当成重新插入文档：`@starting-style` 里的进场动画
// 会重放一遍，toast 就在原位上下跳一下。搬之前先关掉过渡，搬完再打开。
const isRehosting = ref(false)

onMounted(syncTopLayer)
watch(mountTarget, () => {
  isRehosting.value = true
}, { flush: 'pre' })
watch(mountTarget, () => {
  syncTopLayer()
  if (typeof requestAnimationFrame !== 'function') {
    isRehosting.value = false
    return
  }
  // 关掉过渡要撑到进场动画本该走完的时间：浏览器在插入那一刻就把
  // `@starting-style` 当成了起始值，一恢复过渡它就会从起始值补一遍动画。
  setTimeout(() => {
    isRehosting.value = false
  }, readToastMotionDurationMs(viewportRef.value))
}, { flush: 'post' })

/**
 * 打开的对话框会压住页面其它部分，视口得搬进它里面才点得到。
 *
 * 但搬运要等它把进场动画跑完：动画里的 `transform` 会成为搬进去的 `position: fixed`
 * 元素的参照物，toast 会被按对话框的位置摆一次，动画结束才弹回原来的角落。等的
 * 这段时间视口留在原处，先把顶层顺序放到对话框上面，用户看到的位置就不变。
 */
watch(activeModal, async (modal) => {
  if (modal == null) {
    mountTarget.value = 'body'
    return
  }

  const element = viewportRef.value
  if (element != null && typeof element.hidePopover === 'function') {
    try {
      element.hidePopover()
      element.showPopover()
    }
    catch {
      // 引擎不支持顶层，保持原样。
    }
  }

  await whenModalSettled(modal)
  // 动画刚结束的那一帧浏览器还没把 `transform` 算掉，再等两帧才搬。
  await afterTwoFrames()
  if (activeModal.value === modal)
    mountTarget.value = modal
}, { immediate: true })

const placement = computed(() => props.placement ?? layer?.value.toast.position ?? 'bottom-end')

const isTopPlacement = computed(() => placement.value.startsWith('top'))

const classes = computed(() => [
  'astryx-toast-viewport',
  // 浮层根：切断外面继承进来的排版（`layer.css` 的重置）。
  'astryx-layer',
  `astryx-toast-viewport--placement-${placement.value}`,
  { 'astryx-toast-viewport--rehosting': isRehosting.value },
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
  <Teleport :to="mountTarget">
    <div
      ref="viewportRef"
      :class="classes"
      :style="viewportStyle"
      popover="manual"
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
