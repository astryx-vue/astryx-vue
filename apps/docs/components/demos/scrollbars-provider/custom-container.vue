<script setup lang="ts">
import { ScrollbarsProvider, useScrollbars } from '@astryx-vue/core/Scrollbars'
import { Text } from '@astryx-vue/core/Text'
import { defineComponent, h, shallowRef } from 'vue'

/**
 * `useScrollbars` reads the nearest provider, so the hook lives in a child
 * component that sits inside `ScrollbarsProvider`.
 */
const Feed = defineComponent({
  name: 'DemoFeed',
  setup() {
    const el = shallowRef<HTMLElement | null>(null)
    const { active } = useScrollbars(el)
    const rows = Array.from({ length: 20 }, (_, index) => `Event ${index + 1}`)
    return () => h('div', {
      'ref': el,
      'class': 'scrollbars-provider-preview__feed',
      'data-active': String(active.value),
      'tabindex': 0,
      'role': 'region',
      'aria-label': 'Event feed',
    }, rows.map(row => h('div', { key: row, class: 'scrollbars-provider-preview__row' }, h(Text, { type: 'body' }, () => row))))
  },
})
</script>

<template>
  <ScrollbarsProvider>
    <Feed />
  </ScrollbarsProvider>
</template>
