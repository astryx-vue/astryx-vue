<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card width="100%" style="max-width: 500px">
    <Layout>
      <template #header>
        <LayoutHeader has-divider>
          <p class="layout-title">
            Settings
          </p>
        </LayoutHeader>
      </template>
      <template #start>
        <LayoutPanel :width="150" has-divider label="Settings sections" role="navigation">
          <List>
            <ListItem is-selected label="General" />
            <ListItem label="Account" />
            <ListItem label="Privacy" />
            <ListItem label="Notifications" />
            <ListItem label="Security" />
          </List>
        </LayoutPanel>
      </template>
      <LayoutContent>
        <VStack :gap="3">
          <p class="layout-title">
            General Settings
          </p>
          <Text type="body">
            Configure your general preferences here. The sidebar navigation allows you to switch between different settings sections.
          </Text>
        </VStack>
      </LayoutContent>
      <template #footer>
        <LayoutFooter has-divider>
          <HStack :gap="2" h-align="end">
            <Button label="Reset" variant="secondary" />
            <Button label="Save Changes" variant="primary" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Card>
</template>
