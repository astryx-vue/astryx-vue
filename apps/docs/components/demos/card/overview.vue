<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card width="100%">
    <VStack :gap="2">
      <Heading :level="3">
        Weekly report
      </Heading>
      <Text color="secondary">
        Your team closed 24 issues this week.
      </Text>
    </VStack>
  </Card>
</template>
