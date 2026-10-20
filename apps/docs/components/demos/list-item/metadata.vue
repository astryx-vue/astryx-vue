<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Icon } from '@astryx-vue/core/Icon'
import { List, ListItem } from '@astryx-vue/core/List'
import { Text } from '@astryx-vue/core/Text'

function onSelect(): void {}
</script>

<template>
  <List header="Inbox" density="compact" has-dividers>
    <ListItem label="Launch checklist" description="3 tasks still need an owner" is-selected @click="onSelect">
      <template #startContent>
        <Icon icon="check" size="sm" color="success" />
      </template>
      <template #endContent>
        <Badge label="3" variant="blue" />
      </template>
    </ListItem>
    <ListItem label="Security review" description="Waiting on approval" @click="onSelect">
      <template #startContent>
        <Icon icon="warning" size="sm" color="warning" />
      </template>
      <template #endContent>
        <Text color="secondary">
          Yesterday
        </Text>
      </template>
    </ListItem>
    <ListItem label="Old incident report" description="Archived and read-only" is-disabled>
      <template #startContent>
        <Icon icon="copy" size="sm" color="secondary" />
      </template>
      <template #endContent>
        <Text color="secondary">
          Apr 12
        </Text>
      </template>
    </ListItem>
  </List>
</template>
