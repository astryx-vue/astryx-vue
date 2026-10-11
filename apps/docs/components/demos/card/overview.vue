<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card width="100%">
    <VStack :gap="3">
      <VStack :gap="1">
        <Heading :level="3">
          Weekly report
        </Heading>
        <Text color="secondary">
          Your team closed 24 issues this week.
        </Text>
      </VStack>
      <HStack :gap="2">
        <Button label="View report" size="sm" />
        <Button label="Share" size="sm" variant="secondary" />
      </HStack>
    </VStack>
  </Card>
</template>
