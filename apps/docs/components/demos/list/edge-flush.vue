<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <div class="list-preview__section">
    <Heading :level="4">
      Shipping
    </Heading>
    <List edge="flush" has-dividers>
      <ListItem label="Standard" description="Arrives in 5–7 days" />
      <ListItem label="Express" description="Arrives tomorrow" />
      <ListItem label="Pickup" description="Ready at the counter" />
    </List>
  </div>
</template>
