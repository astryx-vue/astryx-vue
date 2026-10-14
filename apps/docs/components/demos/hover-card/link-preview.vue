<script setup lang="ts">
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { Icon } from '@astryx-vue/core/Icon'
import { Link } from '@astryx-vue/core/Link'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { h } from 'vue'

function LinkIcon() {
  return h('svg', {
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('path', { d: 'M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.5 5.43' }),
    h('path', { d: 'M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07L13.5 18.57' }),
  ])
}
</script>

<template>
  <Text type="body">
    Read more in the
    <HoverCard placement="below">
      <Link href="#" has-underline>
        Getting Started Guide
      </Link>
      <template #content>
        <VStack :gap="2" style="max-width: 280px">
          <HStack v-align="start" :gap="2">
            <Icon :icon="LinkIcon" size="sm" color="secondary" />
            <VStack :gap="1">
              <Text type="label">
                Getting Started Guide
              </Text>
              <Text type="body" color="secondary">
                Learn how to set up your first project, invite team members, and configure your workspace.
              </Text>
              <Text type="supporting" color="secondary">
                docs.example.com/getting-started
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </template>
    </HoverCard>.
  </Text>
</template>
