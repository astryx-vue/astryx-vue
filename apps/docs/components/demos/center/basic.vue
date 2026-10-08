<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Center } from '@astryx-vue/core/Center'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Center class="center-preview__stage" :height="180" :padding="4">
    <VStack class="center-preview__content" :gap="2" h-align="center">
      <Badge variant="info">
        Draft
      </Badge>
      <Text weight="medium">
        No projects yet
      </Text>
      <Text type="supporting" color="secondary">
        Create a project to see it listed here.
      </Text>
    </VStack>
  </Center>
</template>
