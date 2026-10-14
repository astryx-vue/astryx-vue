<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { reactive } from 'vue'

const toolbar = reactive({ bold: true, italic: false, underline: true, strikethrough: false, link: false })
const reactions = reactive({ star: false, heart: false, bookmark: true, bell: false })

function toggleToolbar(key: keyof typeof toolbar) {
  toolbar[key] = !toolbar[key]
}
function toggleReaction(key: keyof typeof reactions) {
  reactions[key] = !reactions[key]
}
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Toolbar
      </Text>
      <Stack direction="horizontal" :gap="1">
        <ToggleButton label="Bold" :is-pressed="toolbar.bold" is-icon-only @update:is-pressed="toggleToolbar('bold')">
          <template #icon>
            <Icon icon="i-heroicons-bold" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-bold" color="accent" />
          </template>
        </ToggleButton>
        <ToggleButton label="Italic" :is-pressed="toolbar.italic" is-icon-only @update:is-pressed="toggleToolbar('italic')">
          <template #icon>
            <Icon icon="i-heroicons-italic" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-italic" color="accent" />
          </template>
        </ToggleButton>
        <ToggleButton label="Underline" :is-pressed="toolbar.underline" is-icon-only @update:is-pressed="toggleToolbar('underline')">
          <template #icon>
            <Icon icon="i-heroicons-underline" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-underline" color="accent" />
          </template>
        </ToggleButton>
        <ToggleButton label="Strikethrough" :is-pressed="toolbar.strikethrough" is-icon-only @update:is-pressed="toggleToolbar('strikethrough')">
          <template #icon>
            <Icon icon="i-heroicons-strikethrough" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-strikethrough" color="accent" />
          </template>
        </ToggleButton>
        <ToggleButton label="Link" :is-pressed="toolbar.link" is-icon-only @update:is-pressed="toggleToolbar('link')">
          <template #icon>
            <Icon icon="i-heroicons-link" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-link" color="accent" />
          </template>
        </ToggleButton>
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Reactions
      </Text>
      <Stack direction="horizontal" :gap="1">
        <ToggleButton label="Star" :is-pressed="reactions.star" is-icon-only @update:is-pressed="toggleReaction('star')">
          <template #icon>
            <Icon icon="i-heroicons-star" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-star-solid" color="yellow" />
          </template>
        </ToggleButton>
        <ToggleButton label="Like" :is-pressed="reactions.heart" is-icon-only @update:is-pressed="toggleReaction('heart')">
          <template #icon>
            <Icon icon="i-heroicons-heart" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-heart-solid" color="red" />
          </template>
        </ToggleButton>
        <ToggleButton label="Save" :is-pressed="reactions.bookmark" is-icon-only @update:is-pressed="toggleReaction('bookmark')">
          <template #icon>
            <Icon icon="i-heroicons-bookmark" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-bookmark-solid" color="blue" />
          </template>
        </ToggleButton>
        <ToggleButton label="Follow" :is-pressed="reactions.bell" is-icon-only @update:is-pressed="toggleReaction('bell')">
          <template #icon>
            <Icon icon="i-heroicons-bell" color="secondary" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-bell-solid" color="accent" />
          </template>
        </ToggleButton>
      </Stack>
    </Stack>
  </Stack>
</template>
