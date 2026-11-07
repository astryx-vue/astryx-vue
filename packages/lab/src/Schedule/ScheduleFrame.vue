<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { ScheduleHeaderContent } from './types.js'
import { Heading, Spinner } from '@astryx-vue/core'
import { h, ref, useSlots, watch } from 'vue'
import { useScheduleContext } from './context.js'
import { VNodeHost } from './VNodeHost.js'

defineOptions({ name: 'AstryxScheduleFrame' })

const props = defineProps<{
  titleLabel: string
  isLoading: boolean
}>()

const ctx = useScheduleContext()
const slots = useSlots()
const announce = ref('')

watch(() => props.isLoading, (loading, previous) => {
  if (previous === undefined)
    return
  announce.value = loading ? 'Loading events' : ''
})

function header(): ScheduleHeaderContent {
  let content: ScheduleHeaderContent = {
    startContent: null,
    centerContent: h('span', { class: 'astryx-schedule__title' }, [
      h(Heading, { level: 2 }, { default: () => slots.title?.() }),
      h('span', {
        'class': ['astryx-schedule__spinner', !props.isLoading && 'is-hidden'],
        'aria-hidden': props.isLoading ? undefined : 'true',
      }, [
        h(Spinner, { 'size': 'md', 'aria-label': 'Loading events' }),
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
    <div class="astryx-schedule__live" aria-live="polite">
      {{ announce }}
    </div>
    <VNodeHost :nodes="bar()" />
    <slot />
  </section>
</template>
