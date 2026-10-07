<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <section>
      <span>Horizontal</span>
      <Stack direction="horizontal" :gap="2">
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </Stack>
    </section>
    <section>
      <span>Vertical</span>
      <Stack direction="vertical" :gap="2">
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </Stack>
    </section>
  </Stack>
</template>
