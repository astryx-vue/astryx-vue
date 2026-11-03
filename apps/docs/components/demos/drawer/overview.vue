<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Drawer, DrawerHeader } from '@astryx-vue/core/Drawer'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div>
    <Button @click="isOpen = true">
      Open filters
    </Button>
    <Drawer :is-open="isOpen" label="Filters" @open-change="isOpen = $event">
      <DrawerHeader title="Filters" subtitle="Narrow the list" @open-change="isOpen = false" />
      <p>Category, price range and availability would go here.</p>
    </Drawer>
  </div>
</template>
