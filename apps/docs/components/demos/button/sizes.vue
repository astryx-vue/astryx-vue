<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const sizes = [
  { size: 'sm' as const, label: 'Small' },
  { size: 'md' as const, label: 'Medium' },
  { size: 'lg' as const, label: 'Large' },
]
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Primary
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Button v-for="item in sizes" :key="item.size" :label="item.label" variant="primary" :size="item.size" @click="demo(item.label)" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Secondary
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Button v-for="item in sizes" :key="item.size" :label="item.label" variant="secondary" :size="item.size" @click="demo(item.label)" />
      </Stack>
    </Stack>
  </Stack>
</template>
