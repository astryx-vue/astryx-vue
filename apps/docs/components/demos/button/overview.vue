<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="horizontal" :gap="3" align="center">
    <Button label="Primary" variant="primary" />
    <Button label="Secondary" variant="secondary" />
    <Button label="Ghost" variant="ghost" />
    <Button label="Destructive" variant="destructive" />
  </Stack>
</template>
