<script setup lang="ts">
import type { SVGIconVariation } from '@astryx-vue/lab'
import { homeIcon, SVGIcon } from '@astryx-vue/lab'

const variations: SVGIconVariation[] = ['linear', 'bold', 'twotone', 'bulk', 'broken']
</script>

<template>
  <div class="lab-demo-row">
    <SVGIcon
      v-for="variation in variations"
      :key="variation"
      :icon="homeIcon"
      :variation="variation"
      :aria-label="`${variation} home icon`"
      size="lg"
      color="accent"
    />
  </div>
</template>
