<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="horizontal" :gap="6" align="center">
    <ButtonGroup label="Clipboard actions">
      <Button label="Copy">
        <template #icon>
          <Icon icon="i-heroicons-clipboard-document" />
        </template>
      </Button>
      <Button label="Cut">
        <template #icon>
          <Icon icon="i-heroicons-scissors" />
        </template>
      </Button>
      <Button label="Paste">
        <template #icon>
          <Icon icon="i-heroicons-clipboard" />
        </template>
      </Button>
    </ButtonGroup>
    <ButtonGroup label="Save options">
      <Button label="Save" variant="primary" />
      <IconButton label="Save options" variant="primary">
        <Icon icon="i-heroicons-chevron-down" />
      </IconButton>
    </ButtonGroup>
  </Stack>
</template>
