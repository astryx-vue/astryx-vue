<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Carousel } from '@astryx-vue/core/Carousel'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const features = [
  { title: 'Design System', desc: 'Tokens, components, and patterns' },
  { title: 'Documentation', desc: 'API reference and usage guides' },
  { title: 'Sandbox', desc: 'Visual testing and previews' },
  { title: 'Library', desc: 'Component and hook information' },
  { title: 'Contributing', desc: 'Open source development' },
]
</script>

<template>
  <Stack direction="vertical" :gap="3" :max-width="520" style="padding: 8px">
    <Text type="body" weight="bold">
      Browse features
    </Text>
    <Carousel :gap="2" has-snap label="Feature cards">
      <Card v-for="item in features" :key="item.title" :width="200" :min-height="100">
        <Stack direction="vertical" :gap="1">
          <Text type="body" weight="bold">
            {{ item.title }}
          </Text>
          <Text type="supporting" color="secondary">
            {{ item.desc }}
          </Text>
        </Stack>
      </Card>
    </Carousel>
  </Stack>
</template>
