<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Banner
    status="warning"
    title="Configuration changes detected"
    description="Review the changes before they take effect."
    :default-is-open="true"
    is-dismissable
  >
    <template #end>
      <Button label="Review" variant="secondary" size="sm" />
    </template>
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        Changed settings:
      </Text>
      <ul class="banner-preview-list">
        <li>Authentication method updated</li>
        <li>Rate limits modified</li>
      </ul>
    </VStack>
  </Banner>
</template>
