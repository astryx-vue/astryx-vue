<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="3">
    <Banner
      status="warning"
      title="Scheduled downtime"
      description="All services will be unavailable on Sunday from 2:00–4:00 AM."
      container="section"
      is-dismissable
    />
    <Banner
      status="info"
      title="Welcome to the new dashboard"
      description="We have redesigned the layout based on your feedback."
      container="section"
    >
      <template #end>
        <Button label="Take a tour" variant="secondary" size="sm" />
      </template>
    </Banner>
  </VStack>
</template>
