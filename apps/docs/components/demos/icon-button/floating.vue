<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const variants = [
  { variant: 'primary' as const, label: 'Primary' },
  { variant: 'secondary' as const, label: 'Secondary' },
  { variant: 'ghost' as const, label: 'Ghost' },
  { variant: 'destructive' as const, label: 'Destructive' },
]
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Text type="supporting" color="secondary">
      FABs are usually icon-only — raise one with `elevation="high"`
    </Text>
    <Stack align="center" direction="horizontal" :gap="3">
      <IconButton v-for="item in variants" :key="item.variant" :label="item.label" :variant="item.variant" elevation="high" @click="demo(item.label)">
        <Icon icon="i-heroicons-plus" />
      </IconButton>
    </Stack>
  </Stack>
</template>
