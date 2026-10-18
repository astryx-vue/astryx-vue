<script setup lang="ts">
import { useMediaQuery } from '@astryx-vue/core'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

// Product policy: bottom sheet only on a narrow screen with no hover and a coarse pointer.
const TOUCH_RANGE = '(max-width: 1024px) and (pointer: coarse) and (hover: none)'

const isTouchRange = useMediaQuery(TOUCH_RANGE)
const override = ref<'auto' | 'dialog' | 'bottom-sheet'>('auto')

const presentation = computed(() => {
  if (override.value !== 'auto')
    return override.value
  return isTouchRange.value ? 'bottom-sheet' : 'dialog'
})
</script>

<template>
  <div class="media-query-preview">
    <Text type="supporting" color="secondary">
      {{ TOUCH_RANGE }}
    </Text>
    <code class="media-query-preview__value">
      matches: {{ isTouchRange }}
    </code>
    <SegmentedControl v-model="override" label="Presentation override">
      <SegmentedControlItem label="Auto" value="auto" />
      <SegmentedControlItem label="Dialog" value="dialog" />
      <SegmentedControlItem label="Bottom sheet" value="bottom-sheet" />
    </SegmentedControl>
    <Text type="body">
      Presentation: {{ presentation }}
    </Text>
  </div>
</template>

<style scoped>
.media-query-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.media-query-preview__value {
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--astryx-color-background-muted);
  font-family: var(--astryx-font-family-code, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--astryx-color-text-secondary);
}
</style>
