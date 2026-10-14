<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const cpu = ref(95)
const memory = ref(50)
const disk = ref(75)
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="6">
      <Slider v-model="cpu" label="CPU Usage" :status="{ type: 'error', message: 'CPU usage is critically high' }" />
      <Slider v-model="memory" label="Memory" :status="{ type: 'warning', message: 'Memory usage is moderate' }" />
      <Slider v-model="disk" label="Disk" :status="{ type: 'success', message: 'Disk usage is healthy' }" />
    </VStack>
  </div>
</template>
