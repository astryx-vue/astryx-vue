<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { ScheduleHeaderContent } from './types.js'
import { Heading, Spinner, useAnnounce } from '@astryx-vue/core'
import { h, useSlots, watch } from 'vue'
import { useScheduleContext } from './context.js'
import { VNodeHost } from './VNodeHost.js'

defineOptions({ name: 'AstryxScheduleFrame' })

const props = defineProps<{
  titleLabel: string
  isLoading: boolean
}>()

const ctx = useScheduleContext()
const slots = useSlots()
const announce = useAnnounce()

// 圆环本身不出声，由日程通过共享播报通道说一次「开始加载」。
// 页面还在加载时已经在加载的不播报，免得进页面就念一遍。
watch(() => props.isLoading, (loading) => {
  if (loading && document.readyState === 'complete')
    announce('Loading events', 'polite')
}, { immediate: typeof document !== 'undefined' })

function header(): ScheduleHeaderContent {
  let content: ScheduleHeaderContent = {
    startContent: null,
    centerContent: h('span', { class: 'astryx-schedule__title' }, [
      h(Heading, { level: 2 }, { default: () => slots.title?.() }),
      h('span', {
        'class': ['astryx-schedule__spinner', !props.isLoading && 'is-hidden'],
        'aria-hidden': props.isLoading ? undefined : 'true',
      }, [
        h(Spinner, { 'size': 'md', 'aria-label': 'Loading events', 'aria-hidden': 'true' }),
      ]),
    ]),
    endContent: null,
  }
  for (const plugin of ctx.plugins) {
    if (plugin.renderHeader)
      content = plugin.renderHeader(content.startContent, content.centerContent, content.endContent)
  }
  return content
}

function children(nodes: VNodeChild): VNodeChild[] {
  return nodes == null ? [] : [nodes]
}

function bar() {
  const nodes = header()
  return h('div', { class: 'astryx-schedule__header' }, [
    h('div', { class: 'astryx-schedule__header-start' }, children(nodes.startContent)),
    h('div', { class: 'astryx-schedule__header-title' }, children(nodes.centerContent)),
    h('div', { class: 'astryx-schedule__header-end' }, children(nodes.endContent)),
  ])
}
</script>

<template>
  <section class="astryx-schedule__frame" :aria-label="titleLabel">
    <VNodeHost :nodes="bar()" />
    <slot />
  </section>
</template>
