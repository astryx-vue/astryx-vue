<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const notifications = shallowRef(false)
const darkMode = shallowRef(true)
const autoSave = shallowRef(false)
</script>

<template>
  <Card width="100%" style="max-width: 300px">
    <VStack :gap="4">
      <Switch v-model="notifications" label="Enable notifications" />
      <Switch v-model="darkMode" label="Dark mode" />
      <Switch v-model="autoSave" label="Auto-save" />
    </VStack>
  </Card>
</template>
