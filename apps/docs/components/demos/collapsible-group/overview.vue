<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <CollapsibleGroup type="single" default-value="shipping">
    <Stack :gap="2" width="100%" :max-width="420">
      <Card>
        <Collapsible trigger="Shipping" value="shipping">
          <Text type="body" color="secondary">
            Standard delivery takes 3–5 business days and is free over $50.
            Express is next business day if you order before 2pm.
          </Text>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible trigger="Returns" value="returns">
          <Text type="body" color="secondary">
            30 days from delivery, unused and in the original packaging.
            Return shipping is on us for anything that arrived damaged or was
            not what you ordered.
          </Text>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible trigger="Payment" value="payment">
          <Text type="body" color="secondary">
            All major cards, PayPal, and bank transfer. Cards are charged when
            the order ships, not when it is placed.
          </Text>
        </Collapsible>
      </Card>
    </Stack>
  </CollapsibleGroup>
</template>
