<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <List has-dividers>
    <ListItem label="Alex Johnson" description="Hey, are we still on for lunch tomorrow?" @click="() => {}">
      <template #startContent>
        <Avatar name="Alex Johnson" :size="40" />
      </template>
      <template #endContent>
        <Badge>2</Badge>
      </template>
    </ListItem>
    <ListItem label="Sam Rivera" description="I pushed the latest changes to the repo" @click="() => {}">
      <template #startContent>
        <Avatar name="Sam Rivera" :size="40" />
      </template>
    </ListItem>
    <ListItem label="Jordan Lee" description="Can you review the design spec when you get a chance?" @click="() => {}">
      <template #startContent>
        <Avatar name="Jordan Lee" :size="40" />
      </template>
      <template #endContent>
        <Badge>5</Badge>
      </template>
    </ListItem>
  </List>
</template>
