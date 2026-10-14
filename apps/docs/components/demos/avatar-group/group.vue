<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const users = [
  { name: 'Ami Pena', src: '/template-assets/DATA-Ami-Pena.png' },
  { name: 'Drew Young', src: '/template-assets/DATA-Drew-Young.png' },
  { name: 'Gabriela Fernandez', src: '/template-assets/DATA-Gabriela-Fernandez.png' },
  { name: 'Jihoo Song', src: '/template-assets/DATA-Jihoo-Song.png' },
  { name: 'Nam Tran', src: '/template-assets/DATA-Nam-Tran.png' },
]
</script>

<template>
  <Stack direction="vertical" :gap="8">
    <Stack direction="vertical" :gap="3">
      <Text type="supporting" color="secondary">
        Team members
      </Text>
      <AvatarGroup size="lg">
        <Avatar v-for="user in users" :key="user.name" :src="user.src" :name="user.name" />
        <AvatarGroupOverflow :count="3" />
      </AvatarGroup>
    </Stack>
    <Stack direction="vertical" :gap="3">
      <Text type="supporting" color="secondary">
        Larger group
      </Text>
      <AvatarGroup size="lg">
        <Avatar v-for="user in users.slice(0, 3)" :key="user.name" :src="user.src" :name="user.name" />
        <AvatarGroupOverflow :count="8" />
      </AvatarGroup>
    </Stack>
  </Stack>
</template>
