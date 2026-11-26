<script setup lang="ts">
import { Button } from '@astryx-vue/core'

defineOptions({ name: 'AstryxDiffViewerFold' })

defineProps<{
  /** 折起来的改动行数：删掉的加上新增的。 */
  changedLines: number
  isExpanded: boolean
  /** 不换行时，文字跟着代码横向滚动时停在可见的开头。 */
  isSticky?: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <span class="astryx-diff-viewer__fold-content" :class="{ 'astryx-diff-viewer__fold-content--sticky': isSticky }">
    <span>Large change: {{ changedLines.toLocaleString('en') }} {{ changedLines === 1 ? 'line' : 'lines' }}</span>
    <Button
      size="sm"
      variant="secondary"
      :label="isExpanded ? 'Hide full diff' : 'Show full diff'"
      :aria-expanded="isExpanded"
      @click="emit('toggle')"
    />
  </span>
</template>
