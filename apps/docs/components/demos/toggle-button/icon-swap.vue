<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const isFavorited = ref(false)
const isBookmarked = ref(true)
const isMuted = ref(false)
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Text type="supporting" color="secondary">
      Outline → solid icon swap on press
    </Text>
    <Stack align="center" direction="horizontal" :gap="3">
      <ToggleButton label="Favorite" :is-pressed="isFavorited" is-icon-only @update:is-pressed="isFavorited = $event">
        <template #icon>
          <Icon icon="i-heroicons-star" />
        </template>
        <template #pressedIcon>
          <Icon icon="i-heroicons-star-solid" />
        </template>
      </ToggleButton>
      <ToggleButton label="Bookmark" :is-pressed="isBookmarked" is-icon-only @update:is-pressed="isBookmarked = $event">
        <template #icon>
          <Icon icon="i-heroicons-bookmark" />
        </template>
        <template #pressedIcon>
          <Icon icon="i-heroicons-bookmark-solid" />
        </template>
      </ToggleButton>
      <ToggleButton
        :label="isMuted ? 'Unmute notifications' : 'Mute notifications'"
        :is-pressed="isMuted"
        is-icon-only
        @update:is-pressed="isMuted = $event"
      >
        <template #icon>
          <Icon icon="i-heroicons-bell" />
        </template>
        <template #pressedIcon>
          <Icon icon="i-heroicons-bell-slash" />
        </template>
      </ToggleButton>
    </Stack>
  </Stack>
</template>
