<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <Center :width="400" max-width="100%">
    <Layout style="width: 100%" height="fill">
      <template #header>
        <LayoutHeader has-divider>
          <Card variant="muted" />
        </LayoutHeader>
      </template>
      <template #start>
        <LayoutPanel has-divider :width="140" role="navigation">
          <List>
            <ListItem label="Overview" is-selected />
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
  </Center>
</template>
