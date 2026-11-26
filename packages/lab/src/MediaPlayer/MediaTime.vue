<script setup lang="ts">
import type { MediaTimeProps } from './types.js'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import { formatClock } from './mediaFormat.js'
import { useMediaPlayerMessages } from './messages.js'

defineOptions({ name: 'AstryxMediaTime' })
const props = withDefaults(defineProps<MediaTimeProps>(), { display: 'current-duration' })

const { store, scrubTime } = useMediaPlayerContext('MediaTime')
const messages = useMediaPlayerMessages()
const text = computed(() => {
  const { currentTime, duration } = store.state.value
  const time = scrubTime.value ?? currentTime
  const hasHours = Number.isFinite(duration) && duration >= 3600
  if (duration === Infinity)
    return messages.value.live
  switch (props.display) {
    case 'current':
      return formatClock(time, hasHours)
    case 'duration':
      return formatClock(duration, hasHours)
    case 'remaining':
      return messages.value.timeRemaining(formatClock(Math.max(duration - time, 0), hasHours))
    default:
      return messages.value.timeReadout(formatClock(time, hasHours), formatClock(duration, hasHours))
  }
})
</script>

<template>
  <!-- 时间和时间轴一样，在任何书写方向下都从左往右读。 -->
  <span class="astryx-media-time" :data-display="display" dir="ltr">{{ text }}</span>
</template>
