<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const price = shallowRef<[number, number]>([20, 80])
</script>

<template>
  <Slider v-model="price" label="Price range" description="Keep at least $10 between the minimum and maximum." :step="5" :min-steps-between-thumbs="2" value-display="text" :format-value="value => `$${value}`" />
</template>
