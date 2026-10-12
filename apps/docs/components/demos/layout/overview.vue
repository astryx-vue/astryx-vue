<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card height="180" width="100%">
    <Layout>
      <template #header>
        <LayoutHeader has-divider>
          <Text type="label" weight="semibold">
            Title
          </Text>
        </LayoutHeader>
      </template>
      <LayoutContent>
        <Text type="supporting">
          Content
        </Text>
      </LayoutContent>
      <template #footer>
        <LayoutFooter has-divider>
          <Text type="supporting">
            Footer
          </Text>
        </LayoutFooter>
      </template>
    </Layout>
  </Card>
</template>
