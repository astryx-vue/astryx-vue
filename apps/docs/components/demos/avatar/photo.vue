<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack align="center" direction="horizontal" :gap="4">
    <Avatar src="/template-assets/DATA-Ami-Pena.png" name="Ami Pena" size="xsm" />
    <Avatar src="/template-assets/DATA-Ana-Thomas.png" name="Ana Thomas" size="md" />
    <Avatar src="/template-assets/DATA-Daniela-Gimenez.png" name="Daniela Gimenez" size="lg" />
    <Avatar src="/template-assets/DATA-Gabriela-Fernandez.png" name="Gabriela Fernandez" size="xl" />
  </Stack>
</template>
