<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  className?: string
  component: Component
  dataKind?: string
}>()
</script>

<template>
  <div :class="className" :data-kind="dataKind">
    <component :is="component" />
  </div>
</template>
