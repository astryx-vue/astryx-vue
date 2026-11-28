<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { List, ListItem } from '@astryx-vue/core/List'
import { HStack } from '@astryx-vue/core/Stack'
import { createSwipe } from '@astryx-vue/core/Swipe'
import { ref } from 'vue'

const messages = ref([
  { id: 'invoice', subject: 'Invoice 1042', from: 'Billing', isRead: false },
  { id: 'standup', subject: 'Standup notes', from: 'Mira Hale', isRead: false },
  { id: 'launch', subject: 'Launch checklist', from: 'June Avenue', isRead: true },
  { id: 'offsite', subject: 'Offsite dates', from: 'Cobalt Rooms', isRead: false },
])

function toggleRead(id: string | number | undefined): void {
  messages.value = messages.value.map(message => message.id === id ? { ...message, isRead: !message.isRead } : message)
}

function remove(id: string | number | undefined): void {
  messages.value = messages.value.filter(message => message.id !== id)
}

const mailSwipe = createSwipe({
  leading: [
    { id: 'read', label: 'Read', onActivate: ({ itemKey }) => toggleRead(itemKey) },
  ],
  trailing: [
    { id: 'archive', label: 'Archive', onActivate: ({ itemKey }) => remove(itemKey), variant: 'neutral', hasRemoval: true },
    { id: 'delete', label: 'Delete', onActivate: ({ itemKey }) => remove(itemKey), variant: 'destructive', hasRemoval: true },
  ],
})
</script>

<template>
  <List has-dividers>
    <ListItem
      v-for="message in messages"
      :key="message.id"
      :item-key="message.id"
      :label="message.subject"
      :description="message.isRead ? message.from : `${message.from} · Unread`"
      :swipe="mailSwipe"
    >
      <template #endContent>
        <HStack :gap="2">
          <Button :label="message.isRead ? 'Unread' : 'Read'" size="sm" variant="secondary" @click="toggleRead(message.id)" />
          <Button label="Delete" size="sm" variant="secondary" @click="remove(message.id)" />
        </HStack>
      </template>
    </ListItem>
  </List>
</template>
