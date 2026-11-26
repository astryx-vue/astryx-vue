<script setup lang="ts">
import { IconButton } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaIcon } from './mediaIcons.js'
import { useMediaPlayerMessages } from './messages.js'

/** 上一首或下一首。播放队列归产品管，这个按钮只负责通知。 */
defineOptions({ name: 'AstryxMediaTrackButton' })
const props = defineProps<{ direction: 'previous' | 'next' }>()

const messages = useMediaPlayerMessages()
const label = computed(() => props.direction === 'previous' ? messages.value.previousTrack : messages.value.nextTrack)
const icon = useMediaIcon(() => props.direction === 'previous' ? 'previousTrack' : 'nextTrack')
</script>

<template>
  <IconButton class="astryx-media-track-button" :label="label" :tooltip="label" :icon="icon" variant="ghost" />
</template>
