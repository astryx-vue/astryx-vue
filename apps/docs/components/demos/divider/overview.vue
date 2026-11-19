<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="vertical" :gap="4" :width="500" max-width="100%">
    <Divider variant="subtle" />
    <Divider variant="strong" />
    <Divider label="or" />
  </Stack>
</template>
