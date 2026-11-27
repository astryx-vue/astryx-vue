<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { Stack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Stack direction="horizontal" :gap="6" align="center">
    <ButtonGroup label="Clipboard actions">
      <Button label="Copy" @click="demo('Copy')">
        <template #icon>
          <Icon icon="i-heroicons-clipboard-document" />
        </template>
      </Button>
      <Button label="Cut" @click="demo('Cut')">
        <template #icon>
          <Icon icon="i-heroicons-scissors" />
        </template>
      </Button>
      <Button label="Paste" @click="demo('Paste')">
        <template #icon>
          <Icon icon="i-heroicons-clipboard" />
        </template>
      </Button>
    </ButtonGroup>
    <ButtonGroup label="Save options">
      <Button label="Save" variant="primary" @click="demo('Save')" />
      <IconButton label="Save options" variant="primary" @click="demo('Save options')">
        <Icon icon="i-heroicons-chevron-down" />
      </IconButton>
    </ButtonGroup>
  </Stack>
</template>
