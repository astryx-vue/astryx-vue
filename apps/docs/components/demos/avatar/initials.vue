<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const names = [
  { name: 'John Doe', note: 'First + last' },
  { name: 'Alice', note: 'Single name' },
  { name: 'Bob Smith Johnson', note: 'Multi-word' },
  { name: 'Dr. Sarah Connor', note: 'Prefixed' },
]
</script>

<template>
  <Stack align="center" direction="horizontal" :gap="6">
    <Stack v-for="item in names" :key="item.name" direction="vertical" :gap="2" h-align="center">
      <Avatar :name="item.name" size="lg" />
      <Text type="supporting" color="secondary">
        {{ item.note }}
      </Text>
    </Stack>
  </Stack>
</template>
