<script setup lang="ts">
import type { ChartSwatchProps } from './types.js'
import { computed } from 'vue'

import '../../styles/chart-swatch.css'

defineOptions({ name: 'AstryxChartSwatch' })

const props = withDefaults(defineProps<ChartSwatchProps>(), {
  variant: 'square',
})

const classes = computed(() => ['astryx-chart-swatch', `astryx-chart-swatch--${props.variant}`])
</script>

<template>
  <!-- 颜色是运行时值，只能走内联样式；形状和尺寸在样式表里。 -->
  <div
    aria-hidden="true"
    :class="classes"
    :style="{ backgroundColor: color }"
  />
</template>
