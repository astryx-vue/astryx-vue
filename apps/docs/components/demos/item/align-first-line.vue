<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Item } from '@astryx-vue/core/List'
import { StatusDot } from '@astryx-vue/core/StatusDot'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="item-align-first-line">
    <Item
      align="first-line"
      :label-lines="2"
      label="Quarterly planning notes are ready for the team to review"
      description="Agenda, decisions, and follow-ups"
    >
      <template #startContent>
        <StatusDot label="Active" variant="success" />
      </template>
      <template #endContent>
        <Text color="secondary">
          12m
        </Text>
      </template>
    </Item>
    <Item
      align="first-line"
      :label-lines="2"
      label="Customer research interviews are scheduled for next week"
    >
      <template #startContent>
        <StatusDot label="Away" variant="warning" />
      </template>
      <template #endContent>
        <Badge label="New" variant="blue" />
      </template>
    </Item>
    <Item
      align="first-line"
      label="Launch checklist"
      description="Remaining tasks before release"
    >
      <template #startContent>
        <StatusDot label="Online" variant="success" />
      </template>
      <template #endContent>
        <Text color="secondary">
          Fri
        </Text>
      </template>
    </Item>
  </div>
</template>

<style scoped>
.item-align-first-line {
  display: flex;
  flex-direction: column;
  width: min(100%, 340px);
  min-width: 0;
}
</style>
