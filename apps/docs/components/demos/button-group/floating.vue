<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Stack direction="vertical" :gap="3" h-align="start">
    <Text type="supporting" color="secondary">
      The whole group shares one raised surface — a floating action bar
    </Text>
    <ButtonGroup label="Zoom controls" elevation="med">
      <Button label="Zoom out" @click="demo('Zoom out')" />
      <Button label="Reset" @click="demo('Reset')" />
      <Button label="Zoom in" @click="demo('Zoom in')" />
    </ButtonGroup>
  </Stack>
</template>
