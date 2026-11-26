<script setup lang="ts">
import { useInteractiveRole } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Link } from '@astryx-vue/core/Link'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineComponent, h } from 'vue'

// 一个多态的 Tile：渲染成什么只由 hook 决定——href 优先，其次是点击处理，都没有就是普通内容。
const Tile = defineComponent({
  props: {
    href: { type: String, default: undefined },
    onClick: { type: Function, default: undefined },
  },
  setup(props, { slots }) {
    const { role } = useInteractiveRole({
      href: () => props.href,
      hasOnClick: () => props.onClick != null,
    })
    return () => {
      const body = h(Card, { padding: 3, width: 200 }, () => h(Text, { type: 'body' }, slots.default))
      if (role.value === 'link')
        return h(Link, { href: props.href }, () => body)
      if (role.value === 'button')
        return h('button', { type: 'button', class: 'role-tile__button', onClick: props.onClick }, body)
      return body
    }
  },
})

function noop(): void {}
</script>

<template>
  <VStack :gap="3" h-align="center" width="100%">
    <Tile href="https://example.com/docs">
      Renders as a link
    </Tile>
    <Tile :on-click="noop">
      Renders as a button
    </Tile>
    <Tile>Plain content</Tile>
  </VStack>
</template>

<style scoped>
:deep(.role-tile__button) {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
</style>
