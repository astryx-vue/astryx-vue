<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Drawer, DrawerHeader } from '@astryx-vue/core/Drawer'
import { Layout, LayoutContent } from '@astryx-vue/core/Layout'
import { Text } from '@astryx-vue/core/Text'
import { shallowRef } from 'vue'

const isOpen = shallowRef(false)
</script>

<template>
  <Button label="Open drawer" @click="isOpen = true" />
  <Drawer :is-open="isOpen" label="Details" :width="360" @open-change="isOpen = $event">
    <Layout>
      <template #header>
        <DrawerHeader title="Details" has-close-button @open-change="isOpen = $event" />
      </template>
      <LayoutContent>
        <Text type="body">
          Close with Escape, the scrim, or the close button.
        </Text>
      </LayoutContent>
    </Layout>
  </Drawer>
</template>
