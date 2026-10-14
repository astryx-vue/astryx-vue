<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HStack :gap="4">
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:search" size="xsm" />
      <Text type="supporting">
        xsm
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:search" size="sm" />
      <Text type="supporting">
        sm
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:search" size="md" />
      <Text type="supporting">
        md
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:search" size="lg" />
      <Text type="supporting">
        lg
      </Text>
    </VStack>
  </HStack>
</template>
