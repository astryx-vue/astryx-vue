<script setup lang="ts">
defineOptions({
  name: 'ButtonSpinner',
})

defineProps<{
  label: string
}>()
</script>

<template>
  <span
    class="astryx-spinner astryx-button__spinner"
    role="status"
    :aria-label="label"
  />
</template>
