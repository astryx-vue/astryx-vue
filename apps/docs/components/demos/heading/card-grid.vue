<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card :width="300">
    <VStack :gap="2">
      <Heading :level="3">
        Card Title
      </Heading>
      <Text type="body" display="block" :max-lines="2">
        This is a card description that might be quite long and needs to be truncated after two lines to keep the card compact and uniform.
      </Text>
      <Text type="supporting" display="block">
        Updated 1 hour ago
      </Text>
    </VStack>
  </Card>
</template>
