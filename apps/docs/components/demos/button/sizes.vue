<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

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
        <Button v-for="item in sizes" :key="item.size" :label="item.label" variant="primary" :size="item.size" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Secondary
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Button v-for="item in sizes" :key="item.size" :label="item.label" variant="secondary" :size="item.size" />
      </Stack>
    </Stack>
  </Stack>
</template>
