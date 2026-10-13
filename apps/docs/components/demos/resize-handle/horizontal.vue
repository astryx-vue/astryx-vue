<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const sidebar = useResizable({
  defaultSize: 200,
  minSize: 120,
  maxSize: 400,
})
</script>

<template>
  <Card :height="280" variant="muted" :width="600">
    <Layout height="fill">
      <template #start>
        <LayoutPanel :has-divider="false" :width="sidebar.size">
          <VStack :gap="2">
            <Heading :level="4">
              Sidebar
            </Heading>
            <Text color="secondary">
              {{ Math.round(sidebar.size) }}px wide
            </Text>
          </VStack>
        </LayoutPanel>
        <ResizeHandle direction="horizontal" has-divider label="Resize sidebar" :resizable="sidebar.props" />
      </template>
      <LayoutContent>
        <VStack :gap="2">
          <Heading :level="4">
            Content
          </Heading>
          <Text color="secondary">
            Drag the handle to resize the sidebar.
          </Text>
        </VStack>
      </LayoutContent>
    </Layout>
  </Card>
</template>
