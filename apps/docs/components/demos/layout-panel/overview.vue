<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <Card variant="muted" />
      </LayoutHeader>
    </template>
    <template #start>
      <LayoutPanel :width="140" role="navigation" label="Sections">
        <List>
          <ListItem is-selected label="Overview" />
          <ListItem label="Analytics" />
          <ListItem label="Reports" />
          <ListItem label="Settings" />
        </List>
      </LayoutPanel>
    </template>
    <LayoutContent>
      <Card variant="muted" />
    </LayoutContent>
    <template #footer>
      <LayoutFooter has-divider>
        <Card variant="muted" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
