<script setup lang="ts">
import { Item } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="item-basic">
    <Item label="Quarterly planning" description="Agenda, notes, and action items">
      <template #endContent>
        <Text color="secondary">
          Today
        </Text>
      </template>
    </Item>
    <Item label="Customer research" description="Interview notes from the latest study">
      <template #endContent>
        <Text color="secondary">
          Yesterday
        </Text>
      </template>
    </Item>
    <Item label="Launch checklist" description="Remaining tasks before release">
      <template #endContent>
        <Text color="secondary">
          Fri
        </Text>
      </template>
    </Item>
  </div>
</template>

<style scoped>
.item-basic {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
