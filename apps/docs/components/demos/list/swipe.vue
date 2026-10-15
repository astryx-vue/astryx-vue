<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { List, ListItem } from '@astryx-vue/core/List'
import { ref } from 'vue'

const note = ref('Swipe the row on a touch screen. Archive stays in the row for keyboard and mouse.')

function archive(): void {
  note.value = 'Archived.'
}
</script>

<template>
  <List>
    <ListItem
      label="Invoice 1042"
      description="Due Friday"
      :swipe-actions="{ trailing: [{ label: 'Archive', onActivate: archive, variant: 'accent' }] }"
    >
      <template #endContent>
        <Button label="Archive" size="sm" variant="secondary" @click="archive" />
      </template>
    </ListItem>
  </List>
  <p>{{ note }}</p>
</template>
