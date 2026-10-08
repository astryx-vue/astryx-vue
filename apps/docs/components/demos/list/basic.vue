<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <List header="Inbox">
    <ListItem label="Mentions" description="Comments that name you">
      <template #startContent>
        <span class="css-icon i-carbon-information" style="color: var(--astryx-icon-accent-foreground)" />
      </template>
      <template #endContent>
        <Badge variant="info">
          3
        </Badge>
      </template>
    </ListItem>
    <ListItem label="Assigned to you" description="Two issues are waiting for a review">
      <template #startContent>
        <span class="css-icon i-carbon-warning" style="color: var(--astryx-icon-warning-foreground)" />
      </template>
      <template #endContent>
        <Badge variant="warning">
          2
        </Badge>
      </template>
    </ListItem>
    <ListItem label="Build finished" description="main passed every check">
      <template #startContent>
        <span class="css-icon i-carbon-checkmark-filled" style="color: var(--astryx-icon-success-foreground)" />
      </template>
      <template #endContent>
        <span class="css-icon css-icon--sm i-carbon-chevron-right" />
      </template>
    </ListItem>
  </List>
</template>
