<script setup lang="ts">
import type { MediaTimelineMarker } from './types.js'
import { Popover } from '@astryx-vue/core'
import { defineComponent } from 'vue'
import { MARKER_CONTENT_ATTRIBUTE } from './context.js'

/**
 * 带内容的标记：时间轴上的一个点，按下时跳到它的时间，并在气泡里打开内容。
 * 气泡挂到页面上，所以用的是页面的主题，不是媒体表面的主题。
 */
defineOptions({ name: 'AstryxMediaTimelineMarker' })

const props = defineProps<{
  marker: MediaTimelineMarker
  x: number
}>()

const emit = defineEmits<{
  press: []
  openChange: [isOpen: boolean]
}>()

/** 气泡的宽度。 */
const MARKER_POPOVER_WIDTH = 360

// 把 `content` 函数当成一个组件渲染，它读到的响应式数据变了也会跟着更新。
const MarkerContent = defineComponent({
  name: 'AstryxMediaTimelineMarkerContent',
  setup: () => () => props.marker.content?.(),
})
const contentAttrs = { [MARKER_CONTENT_ATTRIBUTE]: '' }
</script>

<template>
  <div class="astryx-media-timeline__marker-anchor" :style="{ insetInlineStart: `${x}px` }">
    <Popover
      :label="marker.label"
      placement="above"
      alignment="center"
      :width="MARKER_POPOVER_WIDTH"
      :padding="0"
      @open-change="isOpen => emit('openChange', isOpen)"
    >
      <button
        type="button"
        class="astryx-media-timeline__marker-button"
        :aria-label="marker.label"
        data-media-marker=""
        @click="emit('press')"
      >
        <span class="astryx-media-timeline__marker-dot" aria-hidden="true" />
      </button>
      <template #content>
        <div class="astryx-media-timeline__marker-content" v-bind="contentAttrs">
          <MarkerContent />
        </div>
      </template>
    </Popover>
  </div>
</template>
