<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const members = [
  { name: 'Alex Daniels', key: 'alex', href: '/team/alex' },
  { name: 'Ann Smith', key: 'ann', href: '/team/ann' },
  { name: 'Carol Davis', key: 'carol', href: '/team/carol' },
]
const totalMembers = 18
</script>

<template>
  <Stack direction="vertical" :gap="8">
    <Stack direction="vertical" :gap="3">
      <Text type="supporting" color="secondary">
        Reviewers
      </Text>
      <AvatarGroup size="lg" label="Reviewers">
        <Avatar v-for="member in members" :key="member.key" :name="member.name" :href="member.href" />
        <AvatarGroupOverflow :count="totalMembers - members.length" @click="() => {}" />
      </AvatarGroup>
    </Stack>
    <Stack direction="vertical" :gap="3">
      <Text type="supporting" color="secondary">
        Compact, static
      </Text>
      <AvatarGroup size="sm" label="Attendees">
        <Avatar v-for="member in members" :key="member.key" :name="member.name" />
        <AvatarGroupOverflow :count="totalMembers - members.length" />
      </AvatarGroup>
    </Stack>
  </Stack>
</template>
