<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="3">
    <Banner status="info" title="Your trial expires in 3 days" description="Upgrade now to keep access to all features.">
      <template #end>
        <Button label="Upgrade" variant="secondary" size="sm" />
      </template>
    </Banner>
    <Banner status="warning" title="API key expires soon" description="Generate a new key before December 1 to avoid service interruption.">
      <template #end>
        <Button label="Renew key" variant="secondary" size="sm" />
      </template>
    </Banner>
    <Banner status="error" title="Payment failed" description="We could not process your last payment.">
      <template #end>
        <Button label="Retry" variant="secondary" size="sm" />
      </template>
    </Banner>
  </VStack>
</template>
