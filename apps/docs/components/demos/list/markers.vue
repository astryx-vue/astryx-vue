<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <div class="list-preview__row">
    <div class="list-preview__marker">
      <span class="list-preview__note">disc</span>
      <List list-style="disc">
        <ListItem label="First point" />
        <ListItem label="Second point" />
        <ListItem label="Third point" />
      </List>
    </div>
    <div class="list-preview__marker">
      <span class="list-preview__note">circle</span>
      <List list-style="circle">
        <ListItem label="Nested point" />
        <ListItem label="Nested point" />
        <ListItem label="Nested point" />
      </List>
    </div>
    <div class="list-preview__marker">
      <span class="list-preview__note">decimal, starting at 3</span>
      <List list-style="decimal" :start="3">
        <ListItem label="Third step" />
        <ListItem label="Fourth step" />
        <ListItem label="Fifth step" />
      </List>
    </div>
  </div>
</template>
