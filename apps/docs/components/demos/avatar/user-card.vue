<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const users = [
  { name: 'Itai Jordaan', src: '/template-assets/DATA-Itai-Jordaan.png', role: 'Engineering Lead', variant: 'success' as const },
  { name: 'Margot Schroder', src: '/template-assets/DATA-Margot-Schroder.png', role: 'Product Designer', variant: 'neutral' as const },
  { name: 'Daniela Gimenez', src: '/template-assets/DATA-Daniela-Gimenez.png', role: 'Engineering Manager', variant: 'error' as const },
]
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack v-for="user in users" :key="user.name" align="center" direction="horizontal" :gap="3">
      <Avatar :src="user.src" :name="user.name" size="lg">
        <template #status>
          <AvatarStatusDot :variant="user.variant" :label="user.variant" />
        </template>
      </Avatar>
      <Stack direction="vertical" :gap="0">
        <Text type="body" weight="bold">
          {{ user.name }}
        </Text>
        <Text type="supporting" color="secondary">
          {{ user.role }}
        </Text>
      </Stack>
    </Stack>
  </Stack>
</template>
