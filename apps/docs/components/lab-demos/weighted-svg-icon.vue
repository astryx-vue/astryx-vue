<script setup lang="ts">
import { bellWeightedIcon, WeightedSVGIcon } from '@astryx-vue/lab'

const weights = [300, 400, 500, 600, 700] as const
</script>

<template>
  <div class="lab-demo-row">
    <span v-for="weight in weights" :key="weight" :style="{ fontWeight: weight }">
      <WeightedSVGIcon :icon="bellWeightedIcon" color="inherit" /> Alerts {{ weight }}
    </span>
  </div>
</template>
