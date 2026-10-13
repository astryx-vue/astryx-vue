<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const terms = shallowRef(false)
const sharing = shallowRef(true)
const twoFactor = shallowRef(true)
</script>

<template>
  <VStack :gap="6" width="100%" style="max-width: 400px">
    <Switch
      v-model="terms"
      label="Accept terms and conditions"
      is-required
      :status="{ type: 'error', message: 'You must accept the terms to continue' }"
    />
    <Switch
      v-model="sharing"
      label="Share usage data"
      description="Help us improve by sharing anonymous usage statistics"
      :status="{ type: 'warning', message: 'This data may be shared with partners' }"
    />
    <Switch
      v-model="twoFactor"
      label="Two-factor authentication"
      :status="{ type: 'success', message: 'Your account is now more secure' }"
    />
  </VStack>
</template>
