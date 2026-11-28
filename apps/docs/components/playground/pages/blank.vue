<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { Layout, LayoutContent, Text } from '@astryx-vue/core'

const pageStyle: CSSProperties = {
  minHeight: '100%',
}
</script>

<template>
  <Layout :style="pageStyle">
    <LayoutContent role="main" :padding="6">
      <Text as="h1" type="large">
        New Page
      </Text>
    </LayoutContent>
  </Layout>
</template>
