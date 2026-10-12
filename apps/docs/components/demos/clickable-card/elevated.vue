<script setup lang="ts">
import { ClickableCard } from '@astryx-vue/core/ClickableCard'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <ClickableCard elevation="med" href="#" label="Open report" :width="320">
    <VStack :gap="2">
      <Heading :level="4">
        Quarterly report
      </Heading>
      <Text color="secondary" type="body">
        A raised shadow signals the whole card is clickable, lifting it above the surrounding content.
      </Text>
    </VStack>
  </ClickableCard>
</template>
