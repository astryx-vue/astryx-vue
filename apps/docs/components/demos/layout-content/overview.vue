<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <Card variant="muted" />
      </LayoutHeader>
    </template>
    <template #start>
      <LayoutPanel :width="140">
        <Card variant="muted" />
      </LayoutPanel>
    </template>
    <LayoutContent>
      <VStack :gap="3">
        <Heading :level="5">
          Main Content Area
        </Heading>
        <Text type="body" color="secondary">
          LayoutContent provides automatic padding and scroll containment. It fills the remaining space between the header and footer.
        </Text>
        <Text type="body" color="secondary">
          Content that overflows will scroll within this area while the header and footer remain fixed.
        </Text>
      </VStack>
    </LayoutContent>
    <template #footer>
      <LayoutFooter has-divider>
        <Card variant="muted" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
