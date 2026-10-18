<script setup lang="ts">
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { shallowRef } from 'vue'

const activeSheet = shallowRef<string | null>(null)
</script>

<template>
  <Button label="Review settings" variant="secondary" @click="activeSheet = 'review'" />
  <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Review settings">
    <BottomSheet sheet-id="review" label="Review settings" height="hug">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            Review settings
          </Heading>
          <Text color="secondary" type="supporting">
            Daily summaries will be sent by email.
          </Text>
        </VStack>
        <HStack :gap="2">
          <Button label="Cancel" variant="secondary" @click="activeSheet = null" />
          <Button label="Continue" variant="secondary" @click="activeSheet = 'confirm'" />
        </HStack>
      </VStack>
    </BottomSheet>

    <BottomSheet sheet-id="confirm" label="Confirm settings" height="hug">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            Confirm settings
          </Heading>
          <Text color="secondary" type="supporting">
            Your notification settings are ready to save.
          </Text>
        </VStack>
        <HStack :gap="2">
          <Button label="Back" variant="secondary" @click="activeSheet = 'review'" />
          <Button label="Save" variant="secondary" @click="activeSheet = null" />
        </HStack>
      </VStack>
    </BottomSheet>
  </BottomSheetSwitcher>
</template>
