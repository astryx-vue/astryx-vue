<script setup lang="ts">
import { provideTableSection } from './tableRowPlacement.js'

defineOptions({ name: 'AstryxTableBody' })
provideTableSection('body')
</script>

<template>
  <tbody>
    <slot />
  </tbody>
</template>
