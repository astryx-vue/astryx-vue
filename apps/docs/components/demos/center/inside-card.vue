<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
import { Icon } from '@astryx-vue/core/Icon'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card :width="400">
    <Center :height="200">
      <VStack :gap="2" h-align="center">
        <Icon color="secondary" icon="i-heroicons-inbox" size="lg" />
        <Text type="body" weight="bold">
          No messages yet
        </Text>
        <Text color="secondary" type="supporting">
          Messages from your team will appear here.
        </Text>
      </VStack>
    </Center>
  </Card>
</template>
