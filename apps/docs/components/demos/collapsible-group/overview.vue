<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <CollapsibleGroup default-value="shipping" type="single">
    <VStack :gap="2" width="100%">
      <Card>
        <Collapsible trigger="Shipping" value="shipping">
          <Text color="secondary" type="body">
            Standard shipping takes 3–5 business days.
          </Text>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Returns" value="returns">
          <Text color="secondary" type="body">
            Items can be returned within 30 days.
          </Text>
        </Collapsible>
      </Card>
    </VStack>
  </CollapsibleGroup>
</template>
