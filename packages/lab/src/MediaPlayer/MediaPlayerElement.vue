<script setup lang="ts">
import type { MediaPlayerElementProps, MediaPlayerElementSlots } from './types.js'
import { onBeforeUnmount } from 'vue'
import { useMediaPlayerContext } from './context.js'

defineOptions({ name: 'AstryxMediaPlayerElement' })
withDefaults(defineProps<MediaPlayerElementProps>(), { playsInline: true })
defineSlots<MediaPlayerElementSlots>()

const { store } = useMediaPlayerContext('MediaPlayerElement')

// 换成另一种元素（video ↔ audio）时，新元素挂上、旧元素卸下，仓库总是看着当前那个。
function attach(element: unknown): void {
  if (element instanceof HTMLMediaElement)
    store.attachMedia(element)
}
onBeforeUnmount(() => store.attachMedia(null))
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
