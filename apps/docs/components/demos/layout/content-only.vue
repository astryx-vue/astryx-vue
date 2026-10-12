<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent } from '@astryx-vue/core/Layout'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card width="100%" style="max-width: 400px">
    <Layout>
      <LayoutContent>
        <VStack :gap="3">
          <p class="layout-title">
            Simple Content
          </p>
          <Text type="body">
            A layout can have just content without header or footer. This is useful for simple cards or content blocks that don't need structured sections.
          </Text>
        </VStack>
      </LayoutContent>
    </Layout>
  </Card>
</template>
