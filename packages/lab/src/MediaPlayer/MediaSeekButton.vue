<script setup lang="ts">
import type { MediaSeekButtonProps } from './types.js'
import { IconButton } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { useMediaIcon } from './mediaIcons.js'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaSeekButton' })
const props = defineProps<MediaSeekButtonProps>()

const { store } = useMediaPlayerContext('MediaSeekButton')
const messages = useMediaPlayerMessages()
const label = computed(() => {
  const seconds = Math.abs(Math.round(props.offset))
  return props.offset < 0 ? messages.value.skipBack(seconds) : messages.value.skipForward(seconds)
})
const icon = useMediaIcon(() => props.offset < 0 ? 'skipBack' : 'skipForward')
// 媒体报出时长之前不能跳。
const isDisabled = computed(() => {
  const duration = store.state.value.duration
  return !(Number.isFinite(duration) && duration > 0)
})
</script>

<template>
  <IconButton
    class="astryx-media-seek-button"
    :label="label"
    :tooltip="label"
    :icon="icon"
    variant="ghost"
    :size="size"
    :is-disabled="isDisabled"
    @click="store.actions.seekBy(offset)"
  />
</template>
