<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Center :width="400">
    <CollapsibleGroup default-value="shipping" type="single">
      <VStack :gap="2" width="100%">
        <Card>
          <Collapsible trigger="Shipping Information" value="shipping">
            <Text color="secondary" type="body">
              Standard shipping takes 3–5 business days. Express shipping is available for an additional fee.
            </Text>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Return Policy" value="returns">
            <Text color="secondary" type="body">
              Items can be returned within 30 days of purchase. Items must be unused and in original packaging.
            </Text>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Payment Methods" value="payment">
            <Text color="secondary" type="body">
              We accept all major credit cards, PayPal, and bank transfers.
            </Text>
          </Collapsible>
        </Card>
      </VStack>
    </CollapsibleGroup>
  </Center>
</template>
