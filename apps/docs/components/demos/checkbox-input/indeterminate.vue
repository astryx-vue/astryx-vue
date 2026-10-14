<script setup lang="ts">
import type { CheckboxValue } from '@astryx-vue/core/CheckboxInput'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Divider } from '@astryx-vue/core/Divider'
import { VStack } from '@astryx-vue/core/Stack'
import { computed, ref } from 'vue'

const items = ref({
  email: true,
  push: false,
  sms: true,
  slack: false,
})

const checkedCount = computed(() => Object.values(items.value).filter(Boolean).length)
const totalCount = computed(() => Object.keys(items.value).length)
const selectAll = computed<CheckboxValue>({
  get() {
    if (checkedCount.value === 0)
      return false
    if (checkedCount.value === totalCount.value)
      return true
    return 'indeterminate'
  },
  set(checked: CheckboxValue) {
    const next = checked === true
    items.value = { email: next, push: next, sms: next, slack: next }
  },
})
</script>

<template>
  <VStack :gap="3">
    <CheckboxInput
      v-model="selectAll"
      label="Select all notifications"
      :description="`${checkedCount} of ${totalCount} enabled`"
    />
    <Divider />
    <VStack :gap="3">
      <CheckboxInput v-model="items.email" label="Email notifications" />
      <CheckboxInput v-model="items.push" label="Push notifications" />
      <CheckboxInput v-model="items.sms" label="SMS alerts" />
      <CheckboxInput v-model="items.slack" label="Slack messages" />
    </VStack>
  </VStack>
</template>
