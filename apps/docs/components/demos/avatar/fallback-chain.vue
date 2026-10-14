<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4">
    <HStack align="center" :gap="3">
      <Avatar src="/template-assets/DATA-Daniela-Gimenez.png" name="Daniela Gimenez" size="lg" />
      <Text type="supporting">
        Valid src
      </Text>
    </HStack>
    <HStack align="center" :gap="3">
      <Avatar
        src="/template-assets/does-not-exist-primary.jpg"
        fallback-src="/template-assets/DATA-Ami-Pena.png"
        name="Invalid User"
        size="lg"
      />
      <Text type="supporting">
        Invalid src, valid fallbackSrc
      </Text>
    </HStack>
    <HStack align="center" :gap="3">
      <Avatar
        src="/template-assets/does-not-exist-primary.jpg"
        fallback-src="/template-assets/does-not-exist-fallback.jpg"
        name="Test User"
        size="lg"
      />
      <Text type="supporting">
        Both invalid, has name
      </Text>
    </HStack>
    <HStack align="center" :gap="3">
      <Avatar src="/template-assets/does-not-exist-primary.jpg" size="lg" />
      <Text type="supporting">
        All invalid, no name
      </Text>
    </HStack>
  </VStack>
</template>
