<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="3">
    <Banner status="success" title="Deployment complete" description="Version 3.2.0 is now live in production." is-dismissable />
    <Banner status="warning" title="Scheduled maintenance tonight" description="The system will be briefly unavailable from 2:00–3:00 AM." is-dismissable />
    <Banner status="info" title="New feature available" description="Try the new dashboard layout in Settings." is-dismissable />
  </VStack>
</template>
