<script setup lang="ts">
import type { ThumbnailScene } from './images'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { ref } from 'vue'
import { thumbnailScenes } from './images'

const items = ref<ThumbnailScene[]>([...thumbnailScenes])
const selected = ref<string | null>(null)

function remove(id: number) {
  items.value = items.value.filter(item => item.id !== id)
}
</script>

<template>
  <Stack direction="vertical" :gap="3">
    <Text type="supporting" color="secondary">
      {{ 'Click to preview, dismiss to remove' }}
    </Text>
    <Stack align="center" direction="horizontal" :gap="2">
      <Thumbnail
        v-for="item in items"
        :key="item.id"
        :src="item.src"
        :alt="item.alt"
        :label="item.label"
        show-remove-on="always"
        @click="selected = item.label"
        @remove="remove(item.id)"
      />
    </Stack>
    <Text v-if="selected" type="supporting" color="secondary">
      Selected: {{ selected }}
    </Text>
  </Stack>
</template>
