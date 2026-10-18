<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { Item } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'

function onSelect(): void {}
</script>

<template>
  <div class="item-start-content">
    <Item label="Ada Lovelace" description="Design systems engineer" @click="onSelect">
      <template #startContent>
        <Avatar name="Ada Lovelace" size="sm" />
      </template>
      <template #endContent>
        <Badge label="Owner" variant="purple" />
      </template>
    </Item>
    <Item label="Grace Hopper" description="Compiler platform" @click="onSelect">
      <template #startContent>
        <Avatar name="Grace Hopper" size="sm" />
      </template>
      <template #endContent>
        <Text color="secondary">
          Online
        </Text>
      </template>
    </Item>
    <Item label="Review handoff notes" description="Updated guidance is ready for the team" @click="onSelect">
      <template #startContent>
        <Icon icon="info" size="sm" color="secondary" />
      </template>
      <template #endContent>
        <Badge label="New" variant="blue" />
      </template>
    </Item>
  </div>
</template>

<style scoped>
.item-start-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
