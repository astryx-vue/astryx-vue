<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const step = ref<'details' | 'pay' | null>(null)

function onOpenChange(open: boolean): void {
  if (!open)
    step.value = null
}
</script>

<template>
  <Button label="Start checkout" @click="step = 'details'" />
  <BottomSheet :is-open="step === 'details'" label="Details" height="capped" @open-change="onOpenChange">
    <VStack :gap="3">
      <Text type="body">
        Confirm the order, then continue to payment.
      </Text>
      <Button label="Continue" @click="step = 'pay'" />
    </VStack>
  </BottomSheet>
  <BottomSheet :is-open="step === 'pay'" label="Payment" height="hug" @open-change="onOpenChange">
    <VStack :gap="3">
      <Text type="body">
        The payment sheet replaces the details sheet in place.
      </Text>
      <Button label="Back" variant="secondary" @click="step = 'details'" />
      <Button label="Done" @click="step = null" />
    </VStack>
  </BottomSheet>
</template>
