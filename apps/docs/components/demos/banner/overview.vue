<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="vertical" :gap="3" style="max-width: 800px">
    <Banner status="info" title="A new software update is available." />
    <Banner status="success" title="Your changes have been saved." />
    <Banner
      status="warning"
      title="Your trial expires in 3 days."
      description="Upgrade to keep access to all features."
    />
    <Banner
      status="error"
      title="Payment failed."
      description="Update your billing information to continue."
    />
  </Stack>
</template>
