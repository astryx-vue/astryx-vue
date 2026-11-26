<script setup lang="ts">
import type { MediaButtonPartProps } from './types.js'
import { IconButton } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { useMediaIcon } from './mediaIcons.js'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaFullscreenButton' })
defineProps<MediaButtonPartProps>()

const { store } = useMediaPlayerContext('MediaFullscreenButton')
const messages = useMediaPlayerMessages()
const isFullscreen = computed(() => store.state.value.isFullscreen)
const label = computed(() => isFullscreen.value ? messages.value.exitFullscreen : messages.value.enterFullscreen)
const icon = useMediaIcon(() => isFullscreen.value ? 'fullscreenExit' : 'fullscreenEnter')
</script>

<template>
  <IconButton
    v-if="store.state.value.canFullscreen"
    class="astryx-media-fullscreen-button"
    :label="label"
    :tooltip="label"
    :icon="icon"
    variant="ghost"
    :size="size"
    @click="store.actions.toggleFullscreen()"
  />
</template>
