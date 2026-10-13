<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="6">
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        System status
      </Text>
      <HStack :gap="2" align="center">
        <Badge variant="success">
          Active
        </Badge>
        <Badge variant="warning">
          Pending
        </Badge>
        <Badge variant="error">
          Failed
        </Badge>
      </HStack>
    </VStack>
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        Workflow
      </Text>
      <HStack :gap="2" align="center">
        <Badge variant="neutral">
          Draft
        </Badge>
        <Badge variant="info">
          In Review
        </Badge>
      </HStack>
    </VStack>
  </VStack>
</template>
