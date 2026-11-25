<script setup lang="ts">
import { useSnapPaging } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Carousel } from '@astryx-vue/core/Carousel'
import { Stack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const screens = [
  { title: 'Welcome', body: 'Swipe to see what is new.' },
  { title: 'Shared albums', body: 'Invite friends to add their photos.' },
  { title: 'Memories', body: 'See a day from years ago.' },
  { title: 'Search', body: 'Find a photo by what is in it.' },
  { title: 'All set', body: 'Your library is ready.' },
]

const isOneCard = ref(false)
// A flick moves one view, or one card with pages: 'item'.
const paging = useSnapPaging(() => ({ pages: isOneCard.value ? 'item' : 'view' }))
</script>

<template>
  <Stack direction="vertical" :gap="3" :max-width="520" style="padding: 8px">
    <Switch v-model="isOneCard" label="One card per flick" />
    <Carousel :gap="2" :has-snap="paging" label="Onboarding">
      <Card v-for="screen in screens" :key="screen.title" :width="220" :min-height="160">
        <Stack direction="vertical" :gap="1">
          <Text type="body" weight="bold">
            {{ screen.title }}
          </Text>
          <Text type="body" color="secondary">
            {{ screen.body }}
          </Text>
        </Stack>
      </Card>
    </Carousel>
  </Stack>
</template>
