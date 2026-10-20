<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { List, ListItem } from '@astryx-vue/core/List'

function onSelect(): void {}
</script>

<template>
  <List header="Team" has-dividers>
    <ListItem label="Ada Lovelace" description="Design systems engineer" @click="onSelect">
      <template #startContent>
        <Avatar name="Ada Lovelace" size="sm" />
      </template>
      <template #endContent>
        <Badge label="Owner" variant="purple" />
      </template>
    </ListItem>
    <ListItem label="Grace Hopper" description="Platform infrastructure" @click="onSelect">
      <template #startContent>
        <Avatar name="Grace Hopper" size="sm" />
      </template>
      <template #endContent>
        <Badge label="On call" variant="blue" />
      </template>
    </ListItem>
    <ListItem label="Invite teammate" description="Send an invitation to collaborate" @click="onSelect">
      <template #startContent>
        <Icon icon="info" size="sm" color="secondary" />
      </template>
    </ListItem>
  </List>
</template>
