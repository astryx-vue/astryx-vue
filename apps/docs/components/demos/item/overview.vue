<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { Item } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'

function onSelect(): void {}
</script>

<template>
  <div class="item-stage">
    <Item label="Alice Johnson" description="Engineering Lead" @click="onSelect">
      <template #startContent>
        <Avatar name="Alice Johnson" :size="40" />
      </template>
      <template #endContent>
        <Badge label="Admin" />
      </template>
    </Item>
    <Item label="Build completed successfully" description="Pipeline #4521 — all 42 tests passed" @click="onSelect">
      <template #startContent>
        <Icon icon="i-carbon-notification" size="sm" />
      </template>
      <template #endContent>
        <Text color="secondary">
          5h ago
        </Text>
      </template>
    </Item>
    <Item label="design-spec.pdf" description="Modified 2 hours ago" is-selected @click="onSelect">
      <template #startContent>
        <Icon icon="i-carbon-document" size="sm" />
      </template>
      <template #endContent>
        <Text color="secondary">
          2.4 MB
        </Text>
      </template>
    </Item>
    <Item label="Compact menu item" density="compact" @click="onSelect">
      <template #startContent>
        <Icon icon="i-carbon-user" size="sm" />
      </template>
    </Item>
  </div>
</template>

<style scoped>
.item-stage {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
