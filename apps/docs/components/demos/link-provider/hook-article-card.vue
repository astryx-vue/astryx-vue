<script setup lang="ts">
import type { Component, FunctionalComponent, PropType } from 'vue'
import { Card } from '@astryx-vue/core/Card'
import { LinkProvider, useLinkComponent } from '@astryx-vue/core/LinkProvider'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineComponent, h, ref } from 'vue'

const route = ref('/')

/** A stand-in for a router link: it moves the router instead of loading a page. */
const RouterLink: FunctionalComponent<{ href?: string, to?: string }> = (props, { slots }) => h('a', {
  href: props.to ?? props.href,
  onClick: (event: MouseEvent) => {
    event.preventDefault()
    route.value = props.to ?? props.href ?? '/'
  },
}, slots.default?.())
RouterLink.props = ['href', 'to']

/** A custom card whose title link follows the nearest LinkProvider, unless `as` says otherwise. */
const ArticleCard = defineComponent({
  name: 'ArticleCard',
  props: {
    title: { type: String, required: true },
    href: { type: String, required: true },
    resolvedBy: { type: String, required: true },
    as: { type: [String, Object] as PropType<string | Component>, default: undefined },
  },
  setup(props) {
    const linkComponent = useLinkComponent()
    return () => {
      const link = props.as ?? linkComponent.value ?? 'a'
      const linkProps = typeof link === 'string' ? { href: props.href } : { href: props.href, to: props.href }
      return h(Card, { padding: 3 }, () => h(VStack, { gap: 1 }, () => [
        h(Text, { type: 'body', weight: 'bold' }, () => h(link, linkProps, () => props.title)),
        h(Text, { type: 'supporting', color: 'secondary' }, () => props.resolvedBy),
      ]))
    }
  },
})
</script>

<template>
  <VStack :gap="3">
    <Text type="body">
      Router location: {{ route }}
    </Text>
    <LinkProvider :component="RouterLink">
      <ArticleCard
        title="Getting started"
        href="/articles/getting-started"
        resolved-by="LinkProvider: the router's link, no page load"
      />
      <ArticleCard
        title="Style guide (PDF)"
        href="#style-guide"
        resolved-by="as=&quot;a&quot;: a native anchor, even inside the provider"
        as="a"
      />
    </LinkProvider>
    <ArticleCard
      title="Release notes"
      href="#release-notes"
      resolved-by="Outside the provider: the app's LinkProvider, or a native anchor"
    />
  </VStack>
</template>
