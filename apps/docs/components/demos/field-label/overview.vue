<script setup lang="ts">
import { FieldLabel } from '@astryx-vue/core/Field'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="4" style="width: min(100%, 20rem)">
    <FieldLabel label="Email address" input-id="email-input" is-required />
    <FieldLabel
      label="Phone number"
      input-id="phone-input"
      is-optional
      description="Include country code for international numbers"
    />
    <FieldLabel
      label="API key"
      input-id="api-input"
      label-tooltip="Your API key can be found in the developer settings"
    >
      <template #labelIcon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </template>
    </FieldLabel>
    <FieldLabel label="Disabled field" input-id="disabled-input" is-disabled />
  </VStack>
</template>
