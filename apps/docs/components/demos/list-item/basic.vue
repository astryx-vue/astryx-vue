<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <List header="Account settings" has-dividers>
    <ListItem label="Profile" description="Name, avatar, and bio" />
    <ListItem label="Notifications" description="Email and push alerts" />
    <ListItem label="Security" description="Password and two-factor auth" />
  </List>
</template>
