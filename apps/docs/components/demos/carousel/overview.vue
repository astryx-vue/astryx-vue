<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Carousel } from '@astryx-vue/core/Carousel'
import { Heading } from '@astryx-vue/core/Heading'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const items = [
  { title: 'Design', body: 'Create wireframes and prototypes.' },
  { title: 'Develop', body: 'Build components and pages.' },
  { title: 'Test', body: 'Write tests and fix bugs.' },
  { title: 'Deploy', body: 'Ship to production.' },
  { title: 'Monitor', body: 'Track performance and errors.' },
]
</script>

<template>
  <Carousel :gap="2" has-snap :has-buttons="false" label="Workflow steps" style="max-width: 500px">
    <Card v-for="item in items" :key="item.title" :padding="3" style="min-width: 200px">
      <Stack direction="vertical" :gap="1">
        <Heading :level="5">
          {{ item.title }}
        </Heading>
        <Text type="supporting" color="secondary">
          {{ item.body }}
        </Text>
      </Stack>
    </Card>
  </Carousel>
</template>
