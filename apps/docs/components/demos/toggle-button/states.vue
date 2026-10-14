<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Default
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <ToggleButton label="Favorite" :is-pressed="false">
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-star-solid" />
          </template>
        </ToggleButton>
        <ToggleButton label="Favorite" :is-pressed="false" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-star-solid" />
          </template>
        </ToggleButton>
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Pressed
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <ToggleButton label="Favorite" :is-pressed="true">
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-star-solid" />
          </template>
        </ToggleButton>
        <ToggleButton label="Favorite" :is-pressed="true" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
          <template #pressedIcon>
            <Icon icon="i-heroicons-star-solid" />
          </template>
        </ToggleButton>
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Disabled
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <ToggleButton label="Favorite" :is-pressed="false" is-disabled>
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
        </ToggleButton>
        <ToggleButton label="Favorite" :is-pressed="false" is-icon-only is-disabled>
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
        </ToggleButton>
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Loading
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <ToggleButton label="Favorite" :is-pressed="false" is-loading>
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
        </ToggleButton>
        <ToggleButton label="Favorite" :is-pressed="false" is-icon-only is-loading>
          <template #icon>
            <Icon icon="i-heroicons-star" />
          </template>
        </ToggleButton>
      </Stack>
    </Stack>
  </Stack>
</template>
