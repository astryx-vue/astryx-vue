<script setup lang="ts">
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent } from '@astryx-vue/core/Layout'
import { Text } from '@astryx-vue/core/Text'

// 正式使用时去掉 is-inline：对话框应该是模态的。
</script>

<template>
  <Dialog is-open is-inline>
    <Layout>
      <template #header>
        <DialogHeader title="Modal Title" has-close-button />
      </template>
      <LayoutContent>
        <Text type="body">
          Dialog content goes here.
        </Text>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>
