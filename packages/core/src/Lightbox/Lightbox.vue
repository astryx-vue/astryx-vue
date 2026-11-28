<script setup lang="ts">
import type { LayerFocusRecord } from '../layer/layerFocusReturn.js'
import type { LightboxEmits, LightboxMedia, LightboxProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, ref, toRef, useId, useTemplateRef, watch } from 'vue'
import { useCoarsePointer } from '../composables/useCoarsePointer.js'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../layer/layerFocusReturn.js'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useComponentMessages } from '../locale/context.js'
import { lightboxMessages } from '../locale/messages/lightbox.js'
import { zoomMedia } from '../motion/uikit/zoomMedia.js'
import { isRtlElement } from '../utils/isRtlElement.js'
import LightboxCaption from './LightboxCaption.vue'
import { isClickOutsideMedia, markPointerOverPhoto, OVER_PHOTO_ATTRIBUTE } from './lightboxPointer.js'
import { createModalAnnouncer, toWholeIndex } from './lightboxViewer.js'
import { useLightboxStage } from './useLightboxStage.js'
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
const containerRef = useTemplateRef<HTMLElement>('container')
const viewportRef = useTemplateRef<HTMLElement>('viewport')
const trackRef = useTemplateRef<HTMLElement>('track')
const closeRef = useTemplateRef<InstanceType<typeof IconButton>>('close')
const captionId = `astryx-lightbox-caption-${useId()}`
useScrollLock(toRef(props, 'isOpen'))
const isTouch = useCoarsePointer()

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
// 当前页和它两边的邻居：翻页时邻居已经画好，跟着轨道滑进来。
const pageIndexes = computed(() => [index.value - 1, index.value, index.value + 1]
  .filter(i => i >= 0 && i < mediaList.value.length))
const isZoomTarget = computed(() => props.hasZoom && !isVideo.value)
const isZoomed = ref(false)

// 这次按下是哪种指针、按在哪；放大后的拖动或下拉之后松开的点击不关闭。
let pointerType = ''
let pressPoint: { x: number, y: number } | null = null
let didDrag = false
let focusRecord: LayerFocusRecord | null = null

function close(): void {
  emit('update:isOpen', false)
}

function setIndex(next: number): void {
  const last = Math.max(0, mediaList.value.length - 1)
  const clamped = Math.min(Math.max(0, toWholeIndex(next)), last)
  internalIndex.value = clamped
  emit('update:index', clamped)
}

const { zoom } = useLightboxStage({
  dialog: () => dialogRef.value,
  container: () => containerRef.value,
  viewport: () => viewportRef.value,
  track: () => trackRef.value,
  stage: () => trackRef.value?.querySelector<HTMLElement>('[data-current] > [data-lightbox-page-media]') ?? null,
  captionBand: () => trackRef.value?.querySelector<HTMLElement>('[data-current] > .astryx-lightbox__caption-band') ?? null,
  isOpen: () => props.isOpen,
  isZoomTarget: () => isZoomTarget.value,
  isVideo: () => isVideo.value,
  isGallery: () => isGallery.value,
  isTouch: () => isTouch.value,
  index: () => index.value,
  count: () => mediaList.value.length,
  itemKey: () => current.value,
  close,
  onSwipe: setIndex,
  // 缩放只改变换，读屏听不到，在灯箱自己的播报区域说一声。
  onZoomedChange: (next) => {
    isZoomed.value = next
    announce(next ? messages.value.lightbox.zoomedIn : messages.value.lightbox.zoomedOut)
  },
  onDragStart: () => {
    didDrag = true
  },
})

function onCancel(event: Event): void {
  // 里面冒上来的 cancel（文件选择器被取消）不是关闭请求，平台自己的 cancel 直接发给 dialog。
  if (event.target !== event.currentTarget)
    return
  event.preventDefault()
  close()
}

// 每次按下都记下位置和指针种类。鼠标或触控笔在哪里按下都清掉拖动标记，手指只在舞台上按下才清。
function onContainerPointerDown(event: PointerEvent): void {
  pointerType = event.pointerType
  pressPoint = { x: event.clientX, y: event.clientY }
  const isOnStage = event.target instanceof Node && viewportRef.value?.contains(event.target) === true
  if (event.pointerType !== 'touch' || isOnStage)
    didDrag = false
}

function onBackdropClick(event: MouseEvent): void {
  if (didDrag) {
    didDrag = false
    return
  }
  const target = event.target
  const isMediaClose = pointerType !== 'touch' && isClickOutsideMedia(event, {
    viewport: viewportRef.value,
    page: trackRef.value?.querySelector('[data-current]') ?? null,
    pressPoint,
  })
  if (target === event.currentTarget || target === containerRef.value || isMediaClose)
    close()
}

/** 放大时每按一次方向键平移的距离（px）。按右键露出右边的内容，所以照片本身往左移。 */
const KEYBOARD_PAN_STEP = 50
const KEYBOARD_PAN_OFFSETS: Record<string, [number, number]> = {
  ArrowDown: [0, -KEYBOARD_PAN_STEP],
  ArrowLeft: [KEYBOARD_PAN_STEP, 0],
  ArrowRight: [-KEYBOARD_PAN_STEP, 0],
  ArrowUp: [0, KEYBOARD_PAN_STEP],
}

function onKeyDown(event: KeyboardEvent): void {
  if (isZoomTarget.value) {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      zoom.zoomIn()
      return
    }
    // 0 回到适应大小。Ctrl / Cmd + 0 是浏览器自己的页面缩放，留给它。
    if (event.key === '-' || event.key === '_' || (event.key === '0' && !event.ctrlKey && !event.metaKey && !event.altKey)) {
      event.preventDefault()
      zoom.zoomOut()
      return
    }
    const offset = zoom.isZoomed() ? KEYBOARD_PAN_OFFSETS[event.key] : undefined
    if (offset != null) {
      event.preventDefault()
      zoom.panBy(offset[0], offset[1])
      return
    }
  }
  // 方向键跟着书写方向走：RTL 下「下一张」按钮在左边，ArrowLeft 就去下一张。
  // 放大后的平移不镜像，照片本身没有翻转。
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    return
  const towardEnd = (event.key === 'ArrowRight') !== isRtlElement(dialogRef.value)
  if (towardEnd && canNext.value) {
    event.preventDefault()
    setIndex(index.value + 1)
  }
  else if (!towardEnd && canPrev.value) {
    event.preventDefault()
    setIndex(index.value - 1)
  }
}

// 照片盒子获得焦点时，Enter / Space 切换缩放。从子元素冒上来的按键归子元素。
function onStageKeyDown(event: KeyboardEvent): void {
  if (event.target !== event.currentTarget)
    return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    zoom.toggle()
  }
}

// 手指的双击由舞台自己处理；鼠标和触控笔的双击走浏览器的 dblclick。
function onViewportDblclick(event: MouseEvent): void {
  if (isZoomTarget.value && pointerType !== 'touch')
    zoom.doubleClickAt(event.clientX, event.clientY)
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
    const video = dialog.querySelector<HTMLVideoElement>('[data-current] video')
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
    zoom.zoomOut()
    if (record != null) {
      if (wasStranded)
        restoreLayerFocus(record, { layer: dialog, name: 'Lightbox' })
      record.stop()
    }
  }
}, { flush: 'post' })

/**
 * 翻页让原来的当前页变成 inert，里面的焦点（图注的「更多」「收起」、照片盒子）会掉到 body。
 * 这时把焦点交给新一页的照片（能缩放时），否则交给关闭按钮，方向键还能接着翻页。
 */
watch(index, () => {
  const active = document.activeElement
  const page = trackRef.value?.querySelector('[data-current]')
  if (active instanceof HTMLElement && page?.contains(active) === true) {
    void nextTick(() => {
      const stage = trackRef.value?.querySelector<HTMLElement>('[data-current] > [data-lightbox-page-media]')
      const target = isZoomTarget.value ? stage : closeRef.value?.element
      target?.focus()
    })
  }
}, { flush: 'pre' })

watch(index, () => {
  pauseVideos()
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

onBeforeUnmount(() => {
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

function pageStyle(i: number): Record<string, string> {
  return { insetInlineStart: `calc(${i} * (100% + ${zoomMedia.viewer.pageGap}px))` }
}
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
    :data-has-zoom="hasZoom || undefined"
    data-component="lightbox"
    @cancel="onCancel"
    @click="onBackdropClick"
    @keydown="onKeyDown"
  >
    <div ref="container" class="astryx-lightbox__container" @pointerdown="onContainerPointerDown">
      <div class="astryx-lightbox__chrome" data-lightbox-chrome>
        <span class="astryx-lightbox__control astryx-lightbox__close">
          <IconButton ref="close" variant="ghost" size="sm" :label="messages.lightbox.close" @click="close">
            <Icon icon="close" size="sm" />
          </IconButton>
        </span>
        <span v-if="isGallery" class="astryx-lightbox__control astryx-lightbox__nav astryx-lightbox__nav--prev">
          <IconButton
            variant="ghost"
            size="sm"
            :label="messages.lightbox.previous"
            :is-disabled="!canPrev"
            @click="setIndex(index - 1)"
          >
            <Icon icon="chevronLeft" size="sm" />
          </IconButton>
        </span>
      </div>

      <div class="astryx-lightbox__media" data-lightbox-media>
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 舞台上的指针悬停和鼠标双击；键盘走照片盒子的 Enter / Space 和方向键。 -->
        <div
          ref="viewport"
          class="astryx-lightbox__viewport"
          :data-zoomable="(isZoomTarget && !isZoomed) || undefined"
          :data-zoomed="(isZoomTarget && isZoomed) || undefined"
          @pointermove="isZoomTarget ? markPointerOverPhoto($event) : undefined"
          @pointerleave="viewportRef?.removeAttribute(OVER_PHOTO_ATTRIBUTE)"
          @dblclick="onViewportDblclick"
        >
          <div
            ref="track"
            class="astryx-lightbox__track"
            :data-zoom-target="isZoomTarget || undefined"
            :data-dismiss-target="(isTouch && !isZoomTarget && !isVideo) || undefined"
          >
            <div
              v-for="i in pageIndexes"
              :key="i"
              class="astryx-lightbox__page"
              :data-lightbox-page="i"
              :data-current="i === index ? '' : undefined"
              :inert="i !== index || undefined"
              :style="pageStyle(i)"
            >
              <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 能缩放时当前页的照片盒子是缩放按钮，role 和 tabindex 从脚本绑上。 -->
              <div
                class="astryx-lightbox__frame"
                data-lightbox-page-media
                :data-zoomable="(isZoomTarget && i === index) || undefined"
                :role="isZoomTarget && i === index ? 'button' : undefined"
                :tabindex="isZoomTarget && i === index ? 0 : undefined"
                :aria-pressed="isZoomTarget && i === index ? isZoomed : undefined"
                :aria-label="isZoomTarget && i === index ? messages.lightbox.zoom : undefined"
                @keydown="isZoomTarget && i === index ? onStageKeyDown($event) : undefined"
              >
                <!-- eslint-disable-next-line vue-a11y/media-has-caption -- 说明文字在灯箱 caption 里；媒体文件本身不带字幕轨。 -->
                <video
                  v-if="mediaList[i]!.type === 'video'"
                  class="astryx-lightbox__video"
                  :src="mediaList[i]!.src"
                  :aria-label="mediaList[i]!.alt"
                  controls
                  :autoplay="hasAutoPlay && isOpen && i === index"
                />
                <img
                  v-else
                  :ref="i === index ? zoom.contentRef : undefined"
                  class="astryx-lightbox__image"
                  :src="mediaList[i]!.src"
                  :alt="i === index ? mediaList[i]!.alt : ''"
                  draggable="false"
                >
              </div>
              <!-- 换成当前页时重新挂载：翻页合上展开的图注。 -->
              <LightboxCaption
                v-if="hasCaptionBand"
                :id="i === index ? captionId : `${captionId}-${i}`"
                :key="i === index ? 'current' : 'neighbour'"
                :text="mediaList[i]!.caption"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="astryx-lightbox__chrome" data-lightbox-chrome>
        <span v-if="isGallery" class="astryx-lightbox__control astryx-lightbox__nav astryx-lightbox__nav--next">
          <IconButton
            variant="ghost"
            size="sm"
            :label="messages.lightbox.next"
            :is-disabled="!canNext"
            @click="setIndex(index + 1)"
          >
            <Icon icon="chevronRight" size="sm" />
          </IconButton>
        </span>
        <p v-if="isGallery" class="astryx-lightbox__counter">
          {{ index + 1 }} / {{ mediaList.length }}
        </p>
      </div>
    </div>
    <div ref="liveRegion" class="astryx-lightbox__announcer astryx-visually-hidden" aria-live="polite" aria-atomic="true" />
  </dialog>
</template>
