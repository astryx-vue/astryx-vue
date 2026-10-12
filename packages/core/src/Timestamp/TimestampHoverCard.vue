<script setup lang="ts">
import type { TimestampTooltipLine } from './tooltipEntries.js'
import { computed, ref } from 'vue'
import HoverCard from '../HoverCard/HoverCard.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/context.js'
import '../../styles/timestamp.css'

const props = defineProps<{
  lines: readonly TimestampTooltipLine[]
  label: string
}>()

const messages = useAstryxMessages()
const copiedKey = ref<string>()
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
  try {
    await navigator.clipboard.writeText(value)
  }
  catch {
    return
  }
  copiedKey.value = key
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    if (copiedKey.value === key)
      copiedKey.value = undefined
  }, 1500)
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
              :label="copiedKey === String(index) ? messages.timestamp.copied : messages.timestamp.copyValue(line.value)"
              @click="copy(line.value, String(index))"
            >
              <Icon :icon="copiedKey === String(index) ? 'check' : 'copy'" size="sm" />
            </IconButton>
          </div>
        </div>
      </dl>
    </template>
  </HoverCard>
</template>
