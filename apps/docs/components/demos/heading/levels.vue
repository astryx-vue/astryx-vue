<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <div class="heading-preview__stack">
    <Heading :level="1">
      Level 1 heading
    </Heading>
    <Heading :level="2">
      Level 2 heading
    </Heading>
    <Heading :level="3">
      Level 3 heading
    </Heading>
  </div>
</template>
