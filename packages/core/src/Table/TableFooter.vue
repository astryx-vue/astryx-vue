<script setup lang="ts">
import { provideTableSection } from './tableRowPlacement.js'

defineOptions({ name: 'AstryxTableFooter' })
provideTableSection('footer')
</script>

<template>
  <tfoot>
    <slot />
  </tfoot>
</template>
