<script setup lang="ts">
import type { ThumbnailScene } from './images'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { ref } from 'vue'
import { thumbnailScenes } from './images'

const items = ref<ThumbnailScene[]>([...thumbnailScenes])

function remove(id: number) {
  items.value = items.value.filter(item => item.id !== id)
}
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Text type="supporting" color="secondary">
      {{ 'Remove button adapts contrast to image luminance' }}
    </Text>
    <Stack align="center" direction="horizontal" :gap="3">
      <Thumbnail
        v-for="item in items"
        :key="item.id"
        :src="item.src"
        :alt="item.alt"
        :label="item.label"
        show-remove-on="always"
        @remove="remove(item.id)"
      />
      <Text v-if="items.length === 0" type="supporting" color="secondary">
        {{ 'All removed.' }}
      </Text>
    </Stack>
  </Stack>
</template>
