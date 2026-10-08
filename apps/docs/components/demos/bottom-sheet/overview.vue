<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="bottom-sheet-preview">
    <BottomSheet is-inline is-open height="hug" label="Filters">
      <VStack :gap="3">
        <Heading :level="3">
          Filters
        </Heading>
        <Text type="body" color="secondary">
          Narrow the list by price, availability, and delivery window, then apply
          the result.
        </Text>
        <HStack :gap="2" justify="end">
          <Button label="Reset" variant="secondary" />
          <Button label="Apply" variant="primary" />
        </HStack>
      </VStack>
    </BottomSheet>
  </div>
</template>
