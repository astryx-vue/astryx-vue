<script setup lang="ts">
import type { LayerFocusRecord } from '../layer/layerFocusReturn.js'
import type { LightboxEmits, LightboxMedia, LightboxProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, ref, toRef, useId, useTemplateRef, watch } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../layer/layerFocusReturn.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useComponentMessages } from '../locale/context.js'
import { lightboxMessages } from '../locale/messages/lightbox.js'
import LightboxCaption from './LightboxCaption.vue'
import { createModalAnnouncer, toWholeIndex } from './lightboxViewer.js'
import '../../styles/lightbox.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxLightbox', inheritAttrs: false })

const props = withDefaults(defineProps<LightboxProps>(), {
  defaultIndex: 0,
  hasAutoPlay: false,
  hasZoom: false,
})
const emit = defineEmits<LightboxEmits>()

const messages = useComponentMessages({ lightbox: lightboxMessages })
// 模态灯箱打开时，外面的页面是 inert 的，读屏只听得到灯箱里面的播报。
const liveRegionRef = useTemplateRef<HTMLElement>('liveRegion')
const announce = createModalAnnouncer(() => liveRegionRef.value)

// 灯箱内容是这一层的成员边界：外面组里的尺寸、禁用、选中值都不再算数。
resetLayerScopedContext()
const dialogRef = useTemplateRef<HTMLDialogElement>('dialog')
const containerRef = ref<HTMLElement | null>(null)
const mediaRef = useTemplateRef<HTMLElement>('mediaBox')
const frameRef = useTemplateRef<HTMLElement>('frame')
const closeRef = useTemplateRef<InstanceType<typeof IconButton>>('close')
const captionId = `astryx-lightbox-caption-${useId()}`
useScrollLock(toRef(props, 'isOpen'))

const mediaList = computed(() => Array.isArray(props.media) ? props.media : [props.media])
const isGallery = computed(() => Array.isArray(props.media) && mediaList.value.length > 1)
const internalIndex = ref(props.defaultIndex)
// 越界的序号显示最近的一项；小数四舍五入，NaN 当 0。
const index = computed(() => {
  const last = Math.max(0, mediaList.value.length - 1)
  return Math.min(Math.max(0, toWholeIndex(props.index ?? internalIndex.value)), last)
})
const current = computed<LightboxMedia | undefined>(() => mediaList.value[index.value])
const isVideo = computed(() => current.value?.type === 'video')
// 图集每页都有图注区域；单张照片有图注时也放进同样的区域，坐在同一块底色上。
const hasCaptionBand = computed(() => isGallery.value || Boolean(current.value?.caption))
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < mediaList.value.length - 1)

const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })
const dragging = ref(false)
const didDrag = ref(false)
const dragStart = { x: 0, y: 0, panX: 0, panY: 0 }
let focusRecord: LayerFocusRecord | null = null

const zoomable = computed(() => props.hasZoom && !isVideo.value)
const imageTransform = computed(() => zoom.value === 1
  ? undefined
  : `scale(${zoom.value}) translate(${pan.value.x / zoom.value}px, ${pan.value.y / zoom.value}px)`)

function close(): void {
  emit('update:isOpen', false)
}

function setIndex(next: number): void {
  const last = Math.max(0, mediaList.value.length - 1)
  const clamped = Math.min(Math.max(0, toWholeIndex(next)), last)
  internalIndex.value = clamped
  emit('update:index', clamped)
}

function resetZoom(): void {
  zoom.value = 1
  pan.value = { x: 0, y: 0 }
  dragging.value = false
}

function applyZoom(next: number): void {
  if (!zoomable.value || next === zoom.value)
    return
  zoom.value = next
  pan.value = { x: 0, y: 0 }
  announce(next > 1 ? messages.value.lightbox.zoomedIn : messages.value.lightbox.zoomedOut)
}

function toggleZoom(): void {
  applyZoom(zoom.value === 1 ? 2 : 1)
}

function onCancel(event: Event): void {
  // 里面冒上来的 cancel（文件选择器被取消）不是关闭请求，平台自己的 cancel 直接发给 dialog。
  if (event.target !== event.currentTarget)
    return
  event.preventDefault()
  close()
}

function onBackdropClick(event: MouseEvent): void {
  if (didDrag.value) {
    didDrag.value = false
    return
  }
  // 点在照片和图注区域以外的地方都关闭：遮罩、容器，以及照片旁边的媒体列空白。
  const target = event.target
  if (target === event.currentTarget || target === containerRef.value || target === mediaRef.value)
    close()
}

function onKeyDown(event: KeyboardEvent): void {
  if (zoomable.value) {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      applyZoom(2)
      return
    }
    if (event.key === '-' || event.key === '_') {
      event.preventDefault()
      applyZoom(1)
      return
    }
    // 0 回到适应大小。Ctrl / Cmd + 0 是浏览器自己的页面缩放，留给它。
    if (event.key === '0' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      applyZoom(1)
      return
    }
    const step = 50
    const offsets: Record<string, [number, number]> = {
      ArrowDown: [0, -step],
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
    }
    const offset = zoom.value > 1 ? offsets[event.key] : undefined
    if (offset != null) {
      event.preventDefault()
      pan.value = { x: pan.value.x + offset[0], y: pan.value.y + offset[1] }
      return
    }
  }
  // 方向键跟着书写方向走：RTL 下「下一张」按钮在左边，ArrowLeft 就去下一张。
  // 放大后的平移不镜像，照片本身没有翻转。
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    return
  const dialog = dialogRef.value
  const isRtl = dialog != null && getComputedStyle(dialog).direction === 'rtl'
  const towardEnd = (event.key === 'ArrowRight') !== isRtl
  if (towardEnd && canNext.value) {
    event.preventDefault()
    setIndex(index.value + 1)
  }
  else if (!towardEnd && canPrev.value) {
    event.preventDefault()
    setIndex(index.value - 1)
  }
}

function onImageKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleZoom()
  }
}

function onPointerDown(event: PointerEvent): void {
  if (!zoomable.value || zoom.value <= 1)
    return
  dragging.value = true
  didDrag.value = false
  dragStart.x = event.clientX
  dragStart.y = event.clientY
  dragStart.panX = pan.value.x
  dragStart.panY = pan.value.y
}

function onPointerMove(event: PointerEvent): void {
  if (!dragging.value)
    return
  didDrag.value = true
  pan.value = {
    x: dragStart.panX + event.clientX - dragStart.x,
    y: dragStart.panY + event.clientY - dragStart.y,
  }
}

function onPointerUp(): void {
  dragging.value = false
}

// 原生 showModal() 让 Tab 能跑到浏览器自己的界面上，这里把 Tab 圈在灯箱里。
useFocusTrap({
  container: dialogRef,
  isEnabled: () => props.isOpen && current.value != null,
})

function pauseVideos(): void {
  for (const video of dialogRef.value?.querySelectorAll('video') ?? []) {
    if (!video.paused)
      video.pause()
  }
}

// 只有有内容时才渲染 dialog：在第一项到达之前就打开的灯箱，等它到了再打开。
watch([() => props.isOpen, () => current.value != null], ([open]) => {
  const dialog = dialogRef.value
  if (dialog == null)
    return
  if (open && !dialog.open) {
    focusRecord?.stop()
    focusRecord = trackLayerFocus({ getLayer: () => dialogRef.value })
    dialog.showModal()
    const video = dialog.querySelector('video')
    if (props.hasAutoPlay && video != null && video.paused)
      void video.play()?.catch(() => {})
  }
  else if (!open && dialog.open) {
    const record = focusRecord
    focusRecord = null
    const wasStranded = record != null && isLayerFocusStranded(record, dialog)
    // 关着的 dialog 还挂着视频元素，正在播的要停下，不然声音会接着放。
    pauseVideos()
    dialog.close()
    resetZoom()
    if (record != null) {
      if (wasStranded)
        restoreLayerFocus(record, { layer: dialog, name: 'Lightbox' })
      record.stop()
    }
  }
}, { flush: 'post' })

/**
 * 从图注的「更多」「收起」上翻页时，旧图注随页面换掉，焦点会掉到 body。
 * 这时把焦点交给新一页的照片（能缩放时），否则交给关闭按钮，方向键还能接着翻页。
 */
watch(index, () => {
  const active = document.activeElement
  if (active instanceof HTMLElement && active.closest('.astryx-lightbox__caption-band') != null) {
    void nextTick(() => {
      const target = zoomable.value ? frameRef.value : closeRef.value?.element
      target?.focus()
    })
  }
}, { flush: 'pre' })

watch(index, () => {
  resetZoom()
  if (!props.isOpen)
    return
  const item = current.value
  if (item == null || mediaList.value.length < 2)
    return
  const position = { index: index.value + 1, total: mediaList.value.length }
  announce(item.alt
    ? messages.value.lightbox.mediaPosition(item.alt, position.index, position.total)
    : messages.value.lightbox.imagePosition(position.index, position.total))
})

watch([dragging], ([isDragging]) => {
  if (!isDragging)
    return
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}, { flush: 'post' })

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  // 打开着就被卸载（只在打开时渲染、或随整个视图移除）：离开文档后把焦点还给打开者。
  const record = focusRecord
  focusRecord = null
  if (record == null)
    return
  const wasStranded = dialogRef.value?.open === true && isLayerFocusStranded(record, dialogRef.value)
  queueMicrotask(() => {
    if (wasStranded)
      restoreLayerFocus(record, { layer: null, name: 'Lightbox' })
    record.stop()
  })
})

watch(dragging, (isDragging, wasDragging) => {
  if (wasDragging && !isDragging) {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点在 dialog 自身上等于点遮罩；键盘走 Escape 和方向键。 -->
  <dialog
    v-if="current"
    ref="dialog"
    class="astryx-lightbox astryx-layer"
    :class="$attrs.class"
    :style="$attrs.style"
    :aria-label="current.alt || messages.lightbox.mediaViewer"
    :aria-describedby="current.caption ? captionId : undefined"
    :data-gallery="isGallery || undefined"
    :data-caption-band="hasCaptionBand || undefined"
    data-component="lightbox"
    @cancel="onCancel"
    @click="onBackdropClick"
    @keydown="onKeyDown"
  >
    <div ref="containerRef" class="astryx-lightbox__container">
      <IconButton
        ref="close"
        class="astryx-lightbox__close"
        variant="ghost"
        size="sm"
        :label="messages.lightbox.close"
        @click="close"
      >
        <Icon icon="close" size="sm" />
      </IconButton>

      <IconButton
        v-if="isGallery"
        class="astryx-lightbox__nav astryx-lightbox__nav--prev"
        variant="ghost"
        size="sm"
        :label="messages.lightbox.previous"
        :is-disabled="!canPrev"
        @click="setIndex(index - 1)"
      >
        <Icon icon="chevronLeft" size="sm" />
      </IconButton>

      <div ref="mediaBox" class="astryx-lightbox__media">
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 可缩放时 role、tabindex 和 aria 从脚本绑上；视频没有这些交互。 -->
        <div
          ref="frame"
          class="astryx-lightbox__frame"
          :data-zoomable="zoomable || undefined"
          :data-zoomed="zoom > 1 || undefined"
          :data-dragging="dragging || undefined"
          :role="zoomable ? 'button' : undefined"
          :tabindex="zoomable ? 0 : undefined"
          :aria-pressed="zoomable ? zoom > 1 : undefined"
          :aria-label="zoomable ? messages.lightbox.zoom : undefined"
          @dblclick="isVideo ? undefined : toggleZoom()"
          @keydown="zoomable ? onImageKeyDown($event) : undefined"
          @pointerdown="isVideo ? undefined : onPointerDown($event)"
        >
          <!-- eslint-disable-next-line vue-a11y/media-has-caption -- 说明文字在灯箱 caption 里；媒体文件本身不带字幕轨。 -->
          <video
            v-if="isVideo"
            class="astryx-lightbox__video"
            :src="current.src"
            :aria-label="current.alt"
            controls
            :autoplay="hasAutoPlay && isOpen"
          />
          <img
            v-else
            class="astryx-lightbox__image"
            :src="current.src"
            :alt="current.alt"
            draggable="false"
            :style="imageTransform ? { transform: imageTransform } : undefined"
            :data-dragging="dragging || undefined"
          >
        </div>
        <LightboxCaption v-if="hasCaptionBand" :id="captionId" :key="index" :text="current.caption" />
      </div>

      <IconButton
        v-if="isGallery"
        class="astryx-lightbox__nav astryx-lightbox__nav--next"
        variant="ghost"
        size="sm"
        :label="messages.lightbox.next"
        :is-disabled="!canNext"
        @click="setIndex(index + 1)"
      >
        <Icon icon="chevronRight" size="sm" />
      </IconButton>

      <p v-if="isGallery" class="astryx-lightbox__counter">
        {{ index + 1 }} / {{ mediaList.length }}
      </p>
    </div>
    <div ref="liveRegion" class="astryx-lightbox__announcer astryx-visually-hidden" aria-live="polite" aria-atomic="true" />
  </dialog>
</template>
