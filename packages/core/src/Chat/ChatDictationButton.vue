<script setup lang="ts">
import type { ChatDictationButtonProps } from './types.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatDictationButton', inheritAttrs: false })

const props = withDefaults(defineProps<ChatDictationButtonProps>(), {
  size: 'md',
  isHiddenWhenUnsupported: true,
})

const messages = useAstryxMessages()
const listening = computed(() => props.dictation.isListening)
const label = computed(() => props.label ?? (
  listening.value ? messages.value.chat.stopDictation : messages.value.chat.startDictation
))

const BAR_COUNT = 5
const BAR_MIN = 0.08
const sizes = {
  sm: { width: 2, gap: 1.5, height: 14 },
  md: { width: 2.5, gap: 2, height: 18 },
} as const

const metrics = computed(() => sizes[props.size])
const bars = computed(() => props.dictation.bands.slice(0, BAR_COUNT).map((level, index) => ({
  key: `band-${index}`,
  scale: BAR_MIN + Math.min(Math.sqrt(level / 0.2), 1) * (1 - BAR_MIN),
})))
const clipping = computed(() => {
  const volume = props.dictation.volume
  if (volume < 0.2)
    return 0
  return Math.min((volume - 0.2) / 0.1, 1) * 100
})
const barColor = computed(() => clipping.value > 0
  ? `color-mix(in srgb, var(--astryx-color-accent), var(--astryx-color-error) ${clipping.value}%)`
  : 'var(--astryx-color-accent)')
</script>

<template>
  <span
    v-if="dictation.isSupported || !isHiddenWhenUnsupported"
    v-bind="$attrs"
    class="astryx-chat-dictation"
  >
    <span
      v-if="listening"
      class="astryx-chat-dictation__bars"
      aria-hidden="true"
      :style="{ gap: `${metrics.gap}px`, height: `${metrics.height}px` }"
    >
      <span
        v-for="bar in bars"
        :key="bar.key"
        class="astryx-chat-dictation__bar"
        :style="{
          width: `${metrics.width}px`,
          backgroundColor: barColor,
          transform: `scaleY(${bar.scale})`,
        }"
      />
    </span>
    <Button
      :label="label"
      variant="ghost"
      :size="size"
      is-icon-only
      :is-disabled="!dictation.isSupported"
      @click="dictation.toggle()"
    >
      <template v-if="!listening" #icon>
        <Icon icon="microphone" />
      </template>
    </Button>
  </span>
</template>
