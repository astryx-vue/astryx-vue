<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

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
      Floating action buttons — raised above content with `elevation="med"`
    </Text>
    <Stack align="center" direction="horizontal" :gap="3">
      <Button v-for="item in variants" :key="item.variant" :label="item.label" :variant="item.variant" elevation="med">
        <template #icon>
          <Icon icon="i-heroicons-plus" />
        </template>
      </Button>
    </Stack>
  </Stack>
</template>
