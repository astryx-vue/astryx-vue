<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const teams = [
  { name: 'Design Systems', members: 8 },
  { name: 'Frontend Platform', members: 12 },
  { name: 'Developer Experience', members: 6 },
  { name: 'Accessibility', members: 4 },
  { name: 'Performance', members: 7 },
  { name: 'Mobile Infrastructure', members: 9 },
]

const gridPanel = useResizable({
  defaultSize: 480,
  minSize: 100,
  maxSize: 480,
})
</script>

<template>
  <Card :height="400" :padding="0" variant="muted" width="100%" style="max-width: 500px">
    <Layout height="fill">
      <template #start>
        <LayoutPanel :has-divider="false" :width="gridPanel.size" style="padding: var(--astryx-spacing-4, 16px)">
          <Grid :columns="{ minWidth: 180, repeat: 'fit' }" :gap="4" width="100%">
            <Card v-for="team in teams" :key="team.name">
              <VStack :gap="1">
                <Text display="block" type="label">
                  {{ team.name }}
                </Text>
                <Text display="block" type="supporting">
                  {{ team.members }} members
                </Text>
              </VStack>
            </Card>
          </Grid>
        </LayoutPanel>
        <ResizeHandle
          direction="horizontal"
          has-divider
          is-always-visible
          label="Resize grid"
          :resizable="gridPanel.props"
        />
      </template>
      <LayoutContent />
    </Layout>
  </Card>
</template>
