<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const volume = shallowRef(65)
const opacity = shallowRef(0.75)
</script>

<template>
  <div class="slider-preview-stack">
    <Slider v-model="volume" label="Volume" description="Adjust playback volume." :format-value="value => `${value}%`" />
    <Slider v-model="opacity" label="Opacity" :min="0" :max="1" :step="0.05" value-display="text" :format-value="value => `${Math.round(value * 100)}%`" />
  </div>
</template>
