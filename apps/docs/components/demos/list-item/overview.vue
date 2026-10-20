<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { List, ListItem } from '@astryx-vue/core/List'

function onSelect(): void {}
</script>

<template>
  <List header="Settings">
    <ListItem label="Notifications" description="Push, email, and SMS alerts" @click="onSelect">
      <template #startContent>
        <Icon icon="info" size="md" />
      </template>
      <template #endContent>
        <Badge label="3 new" variant="blue" />
      </template>
    </ListItem>
    <ListItem label="Privacy" description="Manage data sharing preferences" @click="onSelect">
      <template #startContent>
        <Icon icon="eyeSlash" size="md" />
      </template>
    </ListItem>
    <ListItem label="Appearance" description="Theme, font size, and display" @click="onSelect">
      <template #startContent>
        <Icon icon="wrench" size="md" />
      </template>
    </ListItem>
    <ListItem label="Billing" description="Plans and payment methods" @click="onSelect">
      <template #startContent>
        <Icon icon="copy" size="md" />
      </template>
      <template #endContent>
        <Badge label="Pro" variant="purple" />
      </template>
    </ListItem>
  </List>
</template>
