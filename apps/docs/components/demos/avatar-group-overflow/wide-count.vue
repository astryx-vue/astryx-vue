<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack :gap="3" direction="vertical">
    <Text type="supporting" color="secondary">
      Wide count
    </Text>
    <AvatarGroup label="Avatars" size="lg">
      <Avatar name="Alex Daniels" />
      <Avatar name="Ann Smith" />
      <AvatarGroupOverflow :count="1245">
        1,245+
      </AvatarGroupOverflow>
    </AvatarGroup>
  </Stack>
</template>
