<script setup lang="ts">
import type { MediaPlayerEmits, MediaPlayerProps, MediaPlayerSlots } from './types.js'
import { useAnnounce, useAstryxLocale } from '@astryx-vue/core'
import { onBeforeUnmount, provide, ref, useTemplateRef, watch } from 'vue'
import { mediaPlayerKey } from './context.js'
import { isFocusVisible, readInteractionModality, trackInteractionModality } from './interactionModality.js'
import { createMediaStore } from './mediaStore.js'
import { useMediaPlayerMessages } from './messages.js'
import { useControlsVisibility } from './useControlsVisibility.js'
import { useMediaShortcuts } from './useMediaShortcuts.js'
import '../../styles/media-player.css'

defineOptions({ name: 'AstryxMediaPlayer' })
defineProps<MediaPlayerProps>()
const emit = defineEmits<MediaPlayerEmits>()
defineSlots<MediaPlayerSlots>()

const store = createMediaStore()
const root = useTemplateRef<HTMLDivElement>('root')
const scrubTime = ref<number | null>(null)
const visibility = useControlsVisibility(store.state)
const announce = useAnnounce()
const messages = useMediaPlayerMessages()
const locale = useAstryxLocale()
const handleShortcut = useMediaShortcuts({ store, announce, messages, locale })

trackInteractionModality()

// 同步触发，每次状态转换只回调一次。
watch(store.state, (next, previous) => {
  if (previous.isPaused && !next.isPaused)
    emit('play')
  if (!previous.isPaused && next.isPaused && !next.isEnded)
    emit('pause')
  if (!previous.isEnded && next.isEnded)
    emit('ended')
  if (previous.error == null && next.error != null) {
    announce(messages.value.error, 'assertive')
    emit('error', next.error)
  }
}, { flush: 'sync' })

watch(root, element => store.attachContainer(element ?? null), { flush: 'sync' })
onBeforeUnmount(() => store.attachContainer(null))

function focusPlayer(): void {
  root.value?.focus({ preventScroll: true })
}

provide(mediaPlayerKey, {
  store,
  isControlsVisible: visibility.isControlsVisible,
  wakeControls: visibility.wakeControls,
  holdControls: visibility.holdControls,
  toggleControls: visibility.toggleControls,
  focusPlayer,
  scrubTime,
})

function onKeydown(event: KeyboardEvent): void {
  visibility.wakeControls()
  handleShortcut(event)
}

function onPointermove(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    visibility.wakeControls()
}

function onPointerdown(event: PointerEvent): void {
  if (event.pointerType === 'touch')
    visibility.markTouch()
  else
    visibility.wakeControls()
}

function onPointerleave(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    visibility.hideControls()
}

// 指针带来的焦点（比如点了时间轴）不留住控件，鼠标离开时控件照样藏起。
function onFocusin(event: FocusEvent): void {
  const target = event.target
  visibility.holdControls('focus', readInteractionModality() === 'keyboard' && target instanceof Element && isFocusVisible(target))
}

function onFocusout(event: FocusEvent): void {
  const next = event.relatedTarget
  if (!(next instanceof Node) || !(event.currentTarget as HTMLElement).contains(next))
    visibility.holdControls('focus', false)
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 播放器是可聚焦的分组，快捷键和指针唤醒控件都挂在这一层。 -->
  <div
    ref="root"
    class="astryx-media-player"
    :class="{ 'astryx-media-player--idle': !visibility.isControlsVisible.value }"
    role="group"
    :aria-label="label"
    tabindex="0"
    :data-controls="visibility.isControlsVisible.value ? 'visible' : 'hidden'"
    @keydown="onKeydown"
    @pointermove="onPointermove"
    @pointerdown="onPointerdown"
    @pointerleave="onPointerleave"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <slot />
  </div>
</template>
