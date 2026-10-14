<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
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
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Default
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Button v-for="item in variants" :key="item.variant" :label="item.label" :variant="item.variant" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Disabled
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Button v-for="item in variants" :key="item.variant" :label="item.label" :variant="item.variant" is-disabled />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Loading
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Button v-for="item in variants" :key="item.variant" :label="item.label" :variant="item.variant" is-loading />
      </Stack>
    </Stack>
  </Stack>
</template>
