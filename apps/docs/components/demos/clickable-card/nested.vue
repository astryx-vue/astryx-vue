<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ClickableCard } from '@astryx-vue/core/ClickableCard'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <ClickableCard href="#" label="Product" :width="320">
    <VStack :gap="3">
      <VStack :gap="1">
        <Heading :level="4">
          Wireless Headphones
        </Heading>
        <Text color="secondary" type="body">
          $79.99
        </Text>
      </VStack>
      <Button label="Add to cart" variant="primary" />
    </VStack>
  </ClickableCard>
</template>
