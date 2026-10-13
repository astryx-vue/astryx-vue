<script setup lang="ts">
import { Card, Heading, Layout, LayoutContent, Text, VStack } from '@astryx-vue/core'
</script>

<template>
  <Layout height="fill" :content-width="1100">
    <LayoutContent :padding="6">
      <VStack :gap="4">
        <Heading :level="1">Org directory</Heading>
        <Text color="secondary">Nested rows with breadcrumbs and detail drawer.</Text>
        <Card variant="muted" :padding="6" width="100%" :height="480">
          <Text type="supporting" color="secondary">
            Full template port for <code>table-tree</code> — upstream React page mirrors this layout; expand in playground editor.
          </Text>
        </Card>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
