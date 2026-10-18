<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack :gap="3" direction="vertical">
    <Text type="supporting" color="secondary">
      Team members
    </Text>
    <AvatarGroup label="Avatars" size="lg">
      <Avatar name="Alex Daniels" />
      <Avatar name="Ann Smith" />
      <Avatar name="Carol Davis" />
      <AvatarGroupOverflow :count="12">
        12+
      </AvatarGroupOverflow>
    </AvatarGroup>
  </Stack>
</template>
