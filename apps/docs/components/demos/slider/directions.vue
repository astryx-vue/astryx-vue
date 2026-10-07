<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const level = shallowRef(60)
const rtl = shallowRef(35)
</script>

<template>
  <div class="slider-preview-stack">
    <Slider v-model="level" label="Level" orientation="vertical" value-display="text" :format-value="value => `${value}%`" />
    <Slider v-model="rtl" label="Right-to-left direction" dir="rtl" value-display="text" />
  </div>
</template>
