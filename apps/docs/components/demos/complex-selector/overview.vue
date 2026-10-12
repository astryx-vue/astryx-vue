<script setup lang="ts">
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { ref } from 'vue'

const value = ref('Apple, Juicy')
</script>

<template>
  <ComplexSelector v-model="value" label="Fruit blend" trigger-label="Apple, Juicy" width="100%">
    <p>Apple, Juicy</p>
  </ComplexSelector>
</template>
