<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="card-preview__row">
    <Card width="min(100%, 360px)">
      <VStack :gap="3">
        <VStack :gap="1">
          <Heading :level="3">
            Weekly report
          </Heading>
          <Text color="secondary">
            Your team closed 24 issues and merged 11 pull requests this week.
          </Text>
        </VStack>
        <Divider />
        <HStack :gap="2">
          <Button label="View report" size="sm" />
          <Button label="Share" size="sm" variant="secondary" />
        </HStack>
      </VStack>
    </Card>
  </div>
</template>
