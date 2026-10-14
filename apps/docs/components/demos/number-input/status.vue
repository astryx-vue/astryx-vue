<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const error = ref<number | null>(-5)
const warning = ref<number | null>(150)
const success = ref<number | null>(25)
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="4">
      <NumberInput
        v-model="error"
        label="Budget"
        :status="{ type: 'error', message: 'Must be a positive amount' }"
      />
      <NumberInput
        v-model="warning"
        label="Headcount"
        :status="{ type: 'warning', message: 'Exceeds typical team size' }"
      />
      <NumberInput
        v-model="success"
        label="Completion"
        units="%"
        :status="{ type: 'success', message: 'On track' }"
      />
    </VStack>
  </div>
</template>
