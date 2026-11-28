<script setup lang="ts">
import type { MediaPlayButtonProps } from './types.js'
import { IconButton } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { useMediaIcon } from './mediaIcons.js'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaPlayButton' })
withDefaults(defineProps<MediaPlayButtonProps>(), { variant: 'ghost' })

const { store } = useMediaPlayerContext('MediaPlayButton')
const messages = useMediaPlayerMessages()
const mode = computed(() => store.state.value.isEnded ? 'replay' : store.state.value.isPaused ? 'play' : 'pause')
const label = computed(() => messages.value[mode.value])
const icon = useMediaIcon(mode)
</script>

<template>
  <IconButton
    class="astryx-media-play-button"
    :label="label"
    :tooltip="label"
    :icon="icon"
    :variant="variant"
    :size="size"
    @click="store.actions.togglePaused()"
  />
</template>
