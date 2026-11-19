<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { Item } from '@astryx-vue/core/List'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

function onSelect(): void {}
</script>

<template>
  <Stack :gap="0">
    <Item label="Alice Johnson" description="Engineering Lead" @click="onSelect">
      <template #startContent>
        <Avatar name="Alice Johnson" :size="40" />
      </template>
      <template #endContent>
        <Badge label="Admin" />
      </template>
    </Item>
    <Item label="Build completed successfully" description="Pipeline #4521 — all 42 tests passed" :description-lines="1" @click="onSelect">
      <template #startContent>
        <Icon icon="i-heroicons-bell" size="sm" />
      </template>
      <template #endContent>
        <Text color="secondary">
          5h ago
        </Text>
      </template>
    </Item>
    <Item label="design-spec.pdf" description="Modified 2 hours ago" is-selected @click="onSelect">
      <template #startContent>
        <Icon icon="i-heroicons-document" size="sm" />
      </template>
      <template #endContent>
        <Text color="secondary">
          2.4 MB
        </Text>
      </template>
    </Item>
    <Item label="Compact menu item" density="compact" @click="onSelect">
      <template #startContent>
        <Icon icon="i-heroicons-user" size="sm" />
      </template>
    </Item>
  </Stack>
</template>
