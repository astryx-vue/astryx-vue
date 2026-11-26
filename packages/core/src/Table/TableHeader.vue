<script setup lang="ts">
import { provideTableSection } from './tableRowPlacement.js'

defineOptions({ name: 'AstryxTableHeader' })
provideTableSection('header')
</script>

<template>
  <thead>
    <slot />
  </thead>
</template>
