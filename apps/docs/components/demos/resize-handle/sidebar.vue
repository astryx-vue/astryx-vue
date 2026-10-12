<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const sidebar = useResizable({
  defaultSize: 240,
  minSize: 160,
  maxSize: 360,
  collapsible: true,
  snaps: [200, 280],
})
</script>

<template>
  <Card :height="240" variant="muted" :width="500">
    <Layout height="fill">
      <template #start>
        <LayoutPanel :has-divider="false" :width="sidebar.size">
          <Text v-if="!sidebar.isCollapsed" color="secondary">
            {{ Math.round(sidebar.size) }}px wide
          </Text>
        </LayoutPanel>
        <ResizeHandle
          direction="horizontal"
          has-divider
          label="Resize sidebar"
          :resizable="sidebar.props"
        />
      </template>
      <LayoutContent>
        <VStack :gap="2">
          <Text color="secondary">
            Drag the handle — it snaps at 200px and 280px. Drag all the way left to collapse the sidebar.
          </Text>
          <Button
            v-if="sidebar.isCollapsed"
            label="Expand sidebar"
            size="sm"
            variant="secondary"
            @click="sidebar.expand()"
          />
        </VStack>
      </LayoutContent>
    </Layout>
  </Card>
</template>
