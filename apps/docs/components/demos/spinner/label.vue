<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HStack v-align="start" :gap="8">
    <Spinner label="Loading..." size="lg" />
    <Spinner aria-label="Fetching data" size="lg">
      <template #label>
        <VStack h-align="center" :gap="0">
          <Text type="body" weight="bold">
            Fetching data
          </Text>
          <Text type="supporting" color="secondary">
            This may take a moment
          </Text>
        </VStack>
      </template>
    </Spinner>
  </HStack>
</template>
