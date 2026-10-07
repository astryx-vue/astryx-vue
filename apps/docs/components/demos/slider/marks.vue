<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const quality = shallowRef(50)
const marks = [{ value: 0, label: '0' }, { value: 25, label: '25' }, { value: 50, label: '50' }, { value: 75, label: '75' }, { value: 100, label: '100' }]
</script>

<template>
  <Slider v-model="quality" label="Quality" description="Choose a mark or drag to adjust." :step="5" :marks="marks" value-display="text" />
</template>
