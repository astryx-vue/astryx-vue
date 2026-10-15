<script setup lang="ts">
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const activeSheet = ref<string | null>(null)
</script>

<template>
  <Button label="Start checkout" @click="activeSheet = 'details'" />
  <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Checkout">
    <BottomSheet sheet-id="details" label="Details">
      <VStack :gap="3">
        <Text type="body">
          Confirm the order, then continue to payment.
        </Text>
        <Button label="Continue" @click="activeSheet = 'pay'" />
      </VStack>
    </BottomSheet>
    <BottomSheet sheet-id="pay" label="Payment">
      <VStack :gap="3">
        <Text type="body">
          Payment details stay in the same sheet.
        </Text>
        <Button label="Back" variant="secondary" @click="activeSheet = 'details'" />
        <Button label="Done" @click="activeSheet = null" />
      </VStack>
    </BottomSheet>
  </BottomSheetSwitcher>
</template>
