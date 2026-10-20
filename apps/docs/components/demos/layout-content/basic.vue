<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
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
    <LayoutContent>
      <VStack :gap="3">
        <Heading :level="5">
          Main Content
        </Heading>
        <Text type="body" color="secondary">
          LayoutContent fills the remaining space and scrolls when its content overflows, while the header stays fixed.
        </Text>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
