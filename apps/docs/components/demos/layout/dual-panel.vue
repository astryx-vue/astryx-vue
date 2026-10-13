<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card width="100%" style="max-width: 500px">
    <Layout>
      <template #header>
        <LayoutHeader has-divider>
          <p class="layout-title">
            File Browser
          </p>
        </LayoutHeader>
      </template>
      <template #start>
        <LayoutPanel :width="120" has-divider>
          <VStack :gap="1">
            <Text color="secondary" type="label">
              Folders
            </Text>
            <List>
              <ListItem label="Documents" />
              <ListItem is-selected label="Projects" />
              <ListItem label="Downloads" />
            </List>
          </VStack>
        </LayoutPanel>
      </template>
      <LayoutContent>
        <VStack :gap="2">
          <Text color="secondary" type="label">
            Files
          </Text>
          <Card variant="muted">
            <Text type="body">
              Select a folder to view its contents
            </Text>
          </Card>
        </VStack>
      </LayoutContent>
      <template #end>
        <LayoutPanel :width="120" has-divider>
          <VStack :gap="2">
            <Text color="secondary" type="label">
              Details
            </Text>
            <Text type="body">
              Select a file to view details
            </Text>
          </VStack>
        </LayoutPanel>
      </template>
    </Layout>
  </Card>
</template>
