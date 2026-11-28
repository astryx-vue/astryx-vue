<script setup lang="ts">
import type { MediaPlayerElementProps, MediaPlayerElementSlots } from './types.js'
import { onBeforeUnmount, shallowRef } from 'vue'
import { useMediaPlayerContext } from './context.js'

defineOptions({ name: 'AstryxMediaPlayerElement' })
withDefaults(defineProps<MediaPlayerElementProps>(), { playsInline: true })
defineSlots<MediaPlayerElementSlots>()

const { store } = useMediaPlayerContext('MediaPlayerElement')
const element = shallowRef<HTMLMediaElement | null>(null)

// 换成另一种元素（video ↔ audio）时，新元素挂上、旧元素卸下，仓库总是看着当前那个。
function attach(next: unknown): void {
  if (next instanceof HTMLMediaElement) {
    element.value = next
    store.attachMedia(next)
  }
}
onBeforeUnmount(() => {
  element.value = null
  store.attachMedia(null)
})

/** 渲染出来的 `<video>` 或 `<audio>`。 */
defineExpose({ element })
</script>

<template>
  <video
    v-if="kind === 'video'"
    :ref="attach"
    class="astryx-media-player-element"
    data-kind="video"
    :src="src"
    :poster="poster"
    :preload="preload"
    :crossorigin="crossOrigin"
    :autoplay="autoplay || undefined"
    :muted="muted"
    :loop="loop || undefined"
    :playsinline="playsInline || undefined"
    :controls="false"
  >
    <slot />
  </video>
  <audio
    v-else
    :ref="attach"
    class="astryx-media-player-element"
    data-kind="audio"
    :src="src"
    :preload="preload"
    :crossorigin="crossOrigin"
    :autoplay="autoplay || undefined"
    :muted="muted"
    :loop="loop || undefined"
    :controls="false"
  >
    <slot />
  </audio>
</template>
