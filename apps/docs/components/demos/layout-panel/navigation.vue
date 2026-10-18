<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <Layout>
    <template #start>
      <LayoutPanel :width="140" role="navigation" label="Sections">
        <List>
          <ListItem is-selected label="Overview" />
          <ListItem label="Analytics" />
          <ListItem label="Settings" />
        </List>
      </LayoutPanel>
    </template>
    <LayoutContent>
      <Card variant="muted" />
    </LayoutContent>
  </Layout>
</template>
