<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const isFavorited = shallowRef(false)
const isBookmarked = shallowRef(true)
const isMuted = shallowRef(false)
</script>

<template>
  <Stack align="center" direction="horizontal" :gap="3">
    <ToggleButton v-model:is-pressed="isFavorited" label="Favorite" is-icon-only>
      <template #icon>
        <Icon icon="i-heroicons-star" />
      </template>
      <template #pressedIcon>
        <Icon icon="i-heroicons-star-solid" />
      </template>
    </ToggleButton>
    <ToggleButton v-model:is-pressed="isBookmarked" label="Bookmark" is-icon-only>
      <template #icon>
        <Icon icon="i-heroicons-bookmark" />
      </template>
      <template #pressedIcon>
        <Icon icon="i-heroicons-bookmark-solid" />
      </template>
    </ToggleButton>
    <ToggleButton v-model:is-pressed="isMuted" label="Notifications">
      <template #icon>
        <Icon icon="i-heroicons-bell" />
      </template>
      <template #pressedIcon>
        <Icon icon="i-heroicons-bell-slash" />
      </template>
      Notifications
    </ToggleButton>
  </Stack>
</template>
