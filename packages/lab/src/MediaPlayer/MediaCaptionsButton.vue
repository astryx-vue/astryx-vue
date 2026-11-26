<script setup lang="ts">
import type { MediaButtonPartProps } from './types.js'
import { Icon, ToggleButton } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { useMediaIcon } from './mediaIcons.js'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaCaptionsButton' })
defineProps<MediaButtonPartProps>()

const { store } = useMediaPlayerContext('MediaCaptionsButton')
const messages = useMediaPlayerMessages()
const hasTracks = computed(() => store.state.value.textTracks.length > 0)
const isOn = computed(() => store.state.value.activeTextTrackId != null)
const icon = useMediaIcon('captions')
</script>

<template>
  <ToggleButton
    v-if="hasTracks"
    class="astryx-media-captions-button"
    :label="messages.captions"
    :tooltip="messages.captions"
    is-icon-only
    :is-pressed="isOn"
    :size="size"
    @pressed-change="store.actions.toggleCaptions()"
  >
    <template #icon>
      <Icon v-if="typeof icon === 'string'" :icon="icon" />
      <component :is="icon" v-else />
    </template>
  </ToggleButton>
</template>
