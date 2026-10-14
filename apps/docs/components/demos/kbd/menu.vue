<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Kbd } from '@astryx-vue/core/Kbd'
import { List, ListItem } from '@astryx-vue/core/List'

const menuItems = [
  { label: 'Cut', keys: 'mod+x' },
  { label: 'Copy', keys: 'mod+c' },
  { label: 'Paste', keys: 'mod+v' },
  { label: 'Undo', keys: 'mod+z' },
  { label: 'Redo', keys: 'mod+shift+z' },
]
</script>

<template>
  <Card :padding="0">
    <List density="compact">
      <ListItem v-for="item in menuItems" :key="item.label" :label="item.label">
        <template #endContent>
          <Kbd :keys="item.keys" />
        </template>
      </ListItem>
    </List>
  </Card>
</template>
