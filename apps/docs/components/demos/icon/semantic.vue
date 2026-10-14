<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HStack :gap="4" wrap="wrap">
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:search" color="primary" />
      <Text type="supporting">
        primary
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:menu" color="secondary" />
      <Text type="supporting">
        secondary
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:information" color="tertiary" />
      <Text type="supporting">
        tertiary
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:time" color="disabled" />
      <Text type="supporting">
        disabled
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:calendar" color="accent" />
      <Text type="supporting">
        accent
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:checkmark-filled" color="success" />
      <Text type="supporting">
        success
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:error" color="error" />
      <Text type="supporting">
        error
      </Text>
    </VStack>
    <VStack :gap="1" h-align="center">
      <Icon name="carbon:warning" color="warning" />
      <Text type="supporting">
        warning
      </Text>
    </VStack>
  </HStack>
</template>
