<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <ButtonGroup label="Text editing actions">
    <Button label="Copy" @click="demo('Copy')" />
    <Button label="Cut" @click="demo('Cut')" />
    <Button label="Paste" @click="demo('Paste')" />
  </ButtonGroup>
</template>
