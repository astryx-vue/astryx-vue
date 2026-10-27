<script setup lang="ts">
import type { LogEntry } from './types.js'
import { computed } from 'vue'

defineOptions({ name: 'AstryxLogStreamRow' })

const props = defineProps<{
  entry: LogEntry
  hasTimestamps: boolean
  hasSource: boolean
  isExpanded: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()

const isExpandable = computed(() => props.entry.detail != null)

// 列组合决定栅格模板：时间、来源两列各自可以缺。
const cols = computed(() => {
  if (props.hasTimestamps)
    return props.hasSource ? 'full' : 'no-source'
  return props.hasSource ? 'no-timestamp' : 'message-only'
})

// 展开时详情面板里的默认文字；有 `detail` 插槽时由使用方接管。
const detailText = computed(() => props.entry.detail)
</script>

<template>
  <div v-if="!isExpandable" class="astryx-log-stream__row" :data-level="entry.level" :data-cols="cols">
    <span v-if="hasTimestamps" class="astryx-log-stream__time">{{ entry.timestamp }}</span>
    <span class="astryx-log-stream__level">{{ entry.level }}</span>
    <span v-if="hasSource" class="astryx-log-stream__source" :title="entry.source">{{ entry.source }}</span>
    <span class="astryx-log-stream__message">{{ entry.message }}</span>
  </div>
  <template v-else>
    <button
      type="button" class="astryx-log-stream__row astryx-log-stream__row--button" :data-level="entry.level"
      :data-cols="cols" :aria-expanded="isExpanded" @click="emit('toggle')"
    >
      <span v-if="hasTimestamps" class="astryx-log-stream__time">{{ entry.timestamp }}</span>
      <span class="astryx-log-stream__level">{{ entry.level }}</span>
      <span v-if="hasSource" class="astryx-log-stream__source" :title="entry.source">{{ entry.source }}</span>
      <span class="astryx-log-stream__message">{{ entry.message }}</span>
    </button>
    <div v-if="isExpanded" class="astryx-log-stream__detail">
      <slot name="detail" :entry="entry">
        {{ detailText }}
      </slot>
    </div>
  </template>
</template>
