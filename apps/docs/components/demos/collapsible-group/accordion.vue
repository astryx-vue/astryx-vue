<script setup lang="ts">
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <CollapsibleGroup default-value="account" type="single">
    <VStack :gap="2" width="100%">
      <Collapsible trigger="Account" value="account">
        <Text color="secondary" type="body">
          Manage your profile details, email address, and password.
        </Text>
      </Collapsible>
      <Collapsible trigger="Notifications" value="notifications">
        <Text color="secondary" type="body">
          Choose which activity triggers email and push notifications.
        </Text>
      </Collapsible>
      <Collapsible trigger="Billing" value="billing">
        <Text color="secondary" type="body">
          View invoices and update your payment method.
        </Text>
      </Collapsible>
    </VStack>
  </CollapsibleGroup>
</template>
