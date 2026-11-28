<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Stack direction="horizontal" :gap="3" align="center">
    <Button label="Primary" variant="primary" @click="demo('Primary')" />
    <Button label="Secondary" variant="secondary" @click="demo('Secondary')" />
    <Button label="Ghost" variant="ghost" @click="demo('Ghost')" />
    <Button label="Destructive" variant="destructive" @click="demo('Destructive')" />
  </Stack>
</template>
