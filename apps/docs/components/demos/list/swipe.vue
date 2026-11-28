<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { List, ListItem } from '@astryx-vue/core/List'
import { createSwipe } from '@astryx-vue/core/Swipe'
import { ref } from 'vue'

const messages = ref([
  { id: 'invoice', subject: 'Invoice 1042', from: 'Billing' },
  { id: 'standup', subject: 'Standup notes', from: 'Mira Hale' },
  { id: 'launch', subject: 'Launch checklist', from: 'June Avenue' },
])

function archive(id: string | number | undefined): void {
  messages.value = messages.value.filter(message => message.id !== id)
}

const mailSwipe = createSwipe({
  trailing: [
    { id: 'archive', label: 'Archive', onActivate: ({ itemKey }) => archive(itemKey), hasRemoval: true },
  ],
})
</script>

<template>
  <List>
    <ListItem
      v-for="message in messages"
      :key="message.id"
      :item-key="message.id"
      :label="message.subject"
      :description="message.from"
      :swipe="mailSwipe"
    >
      <template #endContent>
        <Button label="Archive" size="sm" variant="secondary" @click="archive(message.id)" />
      </template>
    </ListItem>
  </List>
</template>
