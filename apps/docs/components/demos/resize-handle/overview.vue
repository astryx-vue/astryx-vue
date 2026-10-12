<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'
import { Text } from '@astryx-vue/core/Text'

const sidebar = useResizable({
  defaultSize: 96,
  minSize: 72,
  maxSize: 160,
})
</script>

<template>
  <Card height="120" variant="muted" width="100%">
    <Layout height="fill">
      <template #start>
        <LayoutPanel :has-divider="false" :resizable="sidebar.props">
          <Text color="secondary" type="supporting">
            {{ Math.round(sidebar.size) }}px
          </Text>
        </LayoutPanel>
        <ResizeHandle direction="horizontal" has-divider label="Resize sidebar" :resizable="sidebar.props" />
      </template>
      <LayoutContent>
        <Text color="secondary" type="supporting">
          Content
        </Text>
      </LayoutContent>
    </Layout>
  </Card>
</template>
