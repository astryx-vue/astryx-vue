<script setup lang="ts">
import type { LightboxEmits, LightboxMedia, LightboxProps } from './types.js'
import { computed, onBeforeUnmount, ref, toRef, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useScrollLock } from '../composables/useScrollLock.js'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { resetLayerScopedContext } from '../layer/scopedProvide.js'
import { useAstryxMessages } from '../locale/context.js'
import '../../styles/lightbox.css'

defineOptions({ name: 'AstryxLightbox', inheritAttrs: false })

const props = withDefaults(defineProps<LightboxProps>(), {
  defaultIndex: 0,
  hasAutoPlay: false,
  hasZoom: false,
})
const emit = defineEmits<LightboxEmits>()

const messages = useAstryxMessages()
const announce = useAnnounce()

// 灯箱内容是这一层的成员边界：外面组里的尺寸、禁用、选中值都不再算数。
resetLayerScopedContext()
const dialogRef = useTemplateRef<HTMLDialogElement>('dialog')
const containerRef = ref<HTMLElement | null>(null)
useScrollLock(toRef(props, 'isOpen'))

const mediaList = computed(() => Array.isArray(props.media) ? props.media : [props.media])
const isGallery = computed(() => Array.isArray(props.media) && mediaList.value.length > 1)
const internalIndex = ref(props.defaultIndex)
const index = computed(() => {
  const raw = props.index ?? internalIndex.value
  const last = Math.max(0, mediaList.value.length - 1)
  return Math.min(Math.max(0, raw), last)
})
const current = computed<LightboxMedia | undefined>(() => mediaList.value[index.value])
const isVideo = computed(() => current.value?.type === 'video')
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < mediaList.value.length - 1)

const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })
const dragging = ref(false)
const didDrag = ref(false)
const dragStart = { x: 0, y: 0, panX: 0, panY: 0 }
let restoreFocus: HTMLElement | null = null

const zoomable = computed(() => props.hasZoom && !isVideo.value)
const imageTransform = computed(() => zoom.value === 1
  ? undefined
  : `scale(${zoom.value}) translate(${pan.value.x / zoom.value}px, ${pan.value.y / zoom.value}px)`)

function close(): void {
  emit('update:isOpen', false)
}

function setIndex(next: number): void {
  const last = Math.max(0, mediaList.value.length - 1)
  const clamped = Math.min(Math.max(0, next), last)
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
  event.preventDefault()
  close()
}

function onBackdropClick(event: MouseEvent): void {
  if (didDrag.value) {
    didDrag.value = false
    return
  }
  if (event.target === event.currentTarget || event.target === containerRef.value)
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
  if (event.key === 'ArrowLeft' && canPrev.value) {
    event.preventDefault()
    setIndex(index.value - 1)
  }
  else if (event.key === 'ArrowRight' && canNext.value) {
    event.preventDefault()
    setIndex(index.value + 1)
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

watch(() => props.isOpen, (open) => {
  const dialog = dialogRef.value
  if (dialog == null)
    return
  if (open && !dialog.open) {
    const active = document.activeElement
    restoreFocus = active instanceof HTMLElement ? active : null
    dialog.showModal()
  }
  else if (!open && dialog.open) {
    dialog.close()
    resetZoom()
    restoreFocus?.focus()
    restoreFocus = null
  }
}, { flush: 'post' })

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
    data-component="lightbox"
    @cancel="onCancel"
    @click="onBackdropClick"
    @keydown="onKeyDown"
  >
    <div ref="containerRef" class="astryx-lightbox__container">
      <IconButton
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

      <div class="astryx-lightbox__media">
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 可缩放时 role、tabindex 和 aria 从脚本绑上；视频没有这些交互。 -->
        <div
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
            :autoplay="hasAutoPlay"
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
        <p v-if="current.caption" class="astryx-lightbox__caption">
          {{ current.caption }}
        </p>
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
  </dialog>
</template>
