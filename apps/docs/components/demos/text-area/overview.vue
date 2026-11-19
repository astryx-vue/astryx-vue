<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const value = shallowRef('')
</script>

<template>
  <div class="text-area-overview">
    <TextArea v-model="value" label="Description" placeholder="Enter a description..." />
  </div>
</template>

<style scoped>
.text-area-overview {
  width: 400px;
  max-width: 100%;
}
</style>
