<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { Item } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="item-metadata">
    <Item label="Build passed" description="Production deploy completed">
      <template #startContent>
        <Icon icon="check" size="sm" color="success" />
      </template>
      <template #endContent>
        <Text color="secondary">
          2m ago
        </Text>
      </template>
    </Item>
    <Item label="High memory usage" description="Worker pool is above the warning threshold" is-highlighted>
      <template #startContent>
        <Icon icon="warning" size="sm" color="warning" />
      </template>
      <template #endContent>
        <Badge label="Warning" variant="warning" />
      </template>
    </Item>
    <Item label="Sync failed" description="Retry after checking service credentials" is-selected>
      <template #startContent>
        <Icon icon="error" size="sm" color="error" />
      </template>
      <template #endContent>
        <Badge label="Action" variant="error" />
      </template>
    </Item>
  </div>
</template>

<style scoped>
.item-metadata {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
