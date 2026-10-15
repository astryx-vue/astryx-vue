<script setup lang="ts">
import type { InputGroupTextProps, InputGroupTextSlots } from './types.js'

defineOptions({ name: 'AstryxInputGroupText', inheritAttrs: false })

defineProps<InputGroupTextProps>()
defineSlots<InputGroupTextSlots>()
</script>

<template>
  <span class="astryx-input-group-text" v-bind="$attrs">
    <slot />
  </span>
</template>
