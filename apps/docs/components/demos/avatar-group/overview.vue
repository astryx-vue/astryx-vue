<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const users = [
  { name: 'Alex Daniels', key: 'alex' },
  { name: 'Ann Smith', key: 'ann' },
  { name: 'Carol Davis', key: 'carol' },
  { name: 'Gina Wilson', key: 'gina' },
  { name: 'Eve Park', key: 'eve' },
]
</script>

<template>
  <Stack direction="vertical" :gap="8">
    <Stack direction="vertical" :gap="3">
      <Text type="supporting" color="secondary">
        Team members
      </Text>
      <AvatarGroup size="lg">
        <Avatar v-for="user in users" :key="user.key" :name="user.name" />
      </AvatarGroup>
    </Stack>
    <Stack direction="vertical" :gap="3">
      <Text type="supporting" color="secondary">
        With overflow
      </Text>
      <AvatarGroup size="lg">
        <Avatar v-for="user in users.slice(0, 3)" :key="user.key" :name="user.name" />
        <AvatarGroupOverflow :count="users.length - 3" />
      </AvatarGroup>
    </Stack>
  </Stack>
</template>
