<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
</script>

<template>
  <p class="citation-overview">
    See the
    <Citation :number="1" :source="{ title: 'React Docs', url: 'https://react.dev' }" />
    guide
    <Citation :number="2" variant="number" :source="{ title: 'Hooks', url: 'https://react.dev/reference/react' }" />
    .
  </p>
</template>
