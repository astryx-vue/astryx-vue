<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Text type="supporting" color="secondary">
      Icons reinforce the action
    </Text>
    <Stack align="center" direction="horizontal" :gap="3">
      <Button label="New item" variant="primary" @click="demo('New item')">
        <template #icon>
          <Icon icon="i-heroicons-plus" />
        </template>
      </Button>
      <Button label="Edit" variant="secondary" @click="demo('Edit')">
        <template #icon>
          <Icon icon="i-heroicons-pencil-square" />
        </template>
      </Button>
      <Button label="Download" variant="ghost" @click="demo('Download')">
        <template #icon>
          <Icon icon="i-heroicons-arrow-down-tray" />
        </template>
      </Button>
      <Button label="Delete" variant="destructive" @click="demo('Delete')">
        <template #icon>
          <Icon icon="i-heroicons-trash" />
        </template>
      </Button>
    </Stack>
  </Stack>
</template>
