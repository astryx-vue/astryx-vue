<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card :width="360">
    <VStack :gap="2">
      <Heading :level="3">
        Project Overview
      </Heading>
      <Text type="body" color="secondary">
        This project tracks the redesign of the onboarding flow. The goal is to reduce drop-off by 15% in Q2.
      </Text>
      <Text type="supporting" color="secondary">
        Last updated 2 hours ago
      </Text>
    </VStack>
  </Card>
</template>
