<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <List header="Inbox">
    <ListItem label="Mentions" description="Comments that name you" />
    <ListItem label="Assigned to you" description="Two issues are waiting" />
  </List>
</template>
