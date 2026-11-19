<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const value = shallowRef('')
</script>

<template>
  <div class="text-input-overview">
    <TextInput v-model="value" label="Name" placeholder="Enter your name" />
  </div>
</template>

<style scoped>
.text-input-overview {
  width: 300px;
}
</style>
