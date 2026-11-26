<script setup lang="ts">
import type { TimestampTooltipLine } from './tooltipEntries.js'
import { computed, ref } from 'vue'
import { writeClipboardText } from '../composables/internal/clipboardWrite.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import HoverCard from '../HoverCard/HoverCard.vue'
import ComponentIcon from '../Icon/ComponentIcon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useComponentMessages } from '../locale/context.js'
import { timestampMessages } from '../locale/messages/timestamp.js'
import '../../styles/timestamp.css'

const props = defineProps<{
  lines: readonly TimestampTooltipLine[]
  label: string
}>()

const messages = useComponentMessages({ timestamp: timestampMessages })
const announce = useAnnounce()
const copiedKey = ref<string>()
const failedKey = ref<string>()
let resetTimer: ReturnType<typeof setTimeout> | undefined

const hasLabel = computed(() => props.lines.some(line => line.label != null && line.label !== ''))
const hasAction = computed(() => props.lines.some(line => line.isCopyable))
const columns = computed(() => {
  if (hasLabel.value && hasAction.value)
    return 'label-value-action'
  if (hasLabel.value)
    return 'label-value'
  if (hasAction.value)
    return 'value-action'
  return 'value'
})

async function copy(value: string, key: string) {
  clearTimeout(resetTimer)
  try {
    await writeClipboardText(value)
  }
  catch {
    // 失败也要说：按钮换成叉，名字换成失败的话，并走更紧迫的播报，因为失败是错误。
    copiedKey.value = undefined
    failedKey.value = key
    announce(messages.value.timestamp.copyFailed, 'assertive')
    resetTimer = setTimeout(() => {
      if (failedKey.value === key)
        failedKey.value = undefined
    }, 1500)
    return
  }
  failedKey.value = undefined
  copiedKey.value = key
  resetTimer = setTimeout(() => {
    if (copiedKey.value === key)
      copiedKey.value = undefined
  }, 1500)
}

function copyLabel(line: TimestampTooltipLine, key: string): string {
  if (failedKey.value === key)
    return messages.value.timestamp.copyFailed
  return copiedKey.value === key ? messages.value.timestamp.copied : messages.value.timestamp.copyValue(line.value)
}

function copyIcon(key: string): 'check' | 'close' | 'copy' {
  if (failedKey.value === key)
    return 'close'
  return copiedKey.value === key ? 'check' : 'copy'
}
</script>

<template>
  <HoverCard
    :label="label"
    focus-trigger="always"
    :has-hover-indication="true"
    placement="above"
  >
    <slot />
    <template #content>
      <dl class="astryx-timestamp__card" :data-columns="columns" :aria-label="label">
        <div v-for="(line, index) in lines" :key="index" class="astryx-timestamp__row">
          <dt v-if="hasLabel" class="astryx-timestamp__label">
            {{ line.label ?? '' }}
          </dt>
          <dd class="astryx-timestamp__value">
            {{ line.value }}
          </dd>
          <div v-if="hasAction" class="astryx-timestamp__action">
            <IconButton
              v-if="line.isCopyable"
              variant="ghost"
              size="sm"
              :label="copyLabel(line, String(index))"
              @click="copy(line.value, String(index))"
            >
              <ComponentIcon
                icon-slot="timestamp-copy"
                :state="{ copied: copiedKey === String(index) }"
                :fallback="{ icon: copyIcon(String(index)), size: 'sm' }"
              />
            </IconButton>
          </div>
        </div>
      </dl>
    </template>
  </HoverCard>
</template>
