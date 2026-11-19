<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Center :width="500" max-width="100%">
    <Layout style="width: 100%" height="fill">
      <template #header>
        <LayoutHeader has-divider>
          <Card variant="muted" />
        </LayoutHeader>
      </template>
      <template #start>
        <LayoutPanel has-divider :width="140">
          <Card variant="muted" />
        </LayoutPanel>
      </template>
      <LayoutContent role="main">
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
  </Center>
</template>
