<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
import { ref } from 'vue'

const sections = [
  { id: 'notifications', label: 'Notifications', description: 'Alerts, digests and reminders' },
  { id: 'privacy', label: 'Privacy', description: 'Who can see your activity' },
  { id: 'billing', label: 'Billing', description: 'Not available on this plan' },
]

const selected = ref('privacy')
</script>

<template>
  <List has-dividers>
    <ListItem
      v-for="section in sections"
      :key="section.id"
      :description="section.description"
      :is-disabled="section.id === 'billing'"
      :is-selected="selected === section.id"
      :label="section.label"
      @click="selected = section.id"
    >
      <template #endContent>
        <span
          v-if="selected === section.id"
          class="css-icon i-carbon-checkmark"
          style="color: var(--astryx-icon-accent-foreground)"
        />
      </template>
    </ListItem>
  </List>
</template>
