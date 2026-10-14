<script setup lang="ts">
import type { BottomSheetHeight, BottomSheetPurpose } from '@astryx-vue/core/BottomSheet'
import type { DialogPurpose } from '@astryx-vue/core/Dialog'
import { useMediaQuery } from '@astryx-vue/core'
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextArea } from '@astryx-vue/core/TextArea'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const TOUCH_ORIENTED_LG_QUERY = '(max-width: 1024px) and (pointer: coarse) and (hover: none)'

type AdaptivePresentation = 'dialog' | 'fullscreen' | 'bottom-sheet'

const isOpen = ref(false)
const name = ref('Ruby Cheung')
const email = ref('ruby@example.com')
const notes = ref('')
const isTouchOriented = useMediaQuery(TOUCH_ORIENTED_LG_QUERY)

const purpose: DialogPurpose = 'form'
const touchPresentation: AdaptivePresentation = 'bottom-sheet'
const bottomSheetHeight: BottomSheetHeight = 'tall'

function resolvedPresentation(): AdaptivePresentation {
  return isTouchOriented.value ? touchPresentation : 'dialog'
}
</script>

<template>
  <Button label="Edit profile" @click="isOpen = true" />
  <BottomSheet
    v-if="resolvedPresentation() === 'bottom-sheet'"
    v-model:is-open="isOpen"
    :height="bottomSheetHeight"
    label="Edit profile"
    :purpose="purpose as BottomSheetPurpose"
  >
    <VStack :gap="4">
      <Heading :level="3">
        Edit profile
      </Heading>
      <Text type="supporting" color="secondary">
        Dialog remains the default presentation. This example explicitly opts into a Bottom Sheet only at lg and below when the device has a coarse pointer and no hover. Pass the presentation prop to make tests or unusual environments deterministic.
      </Text>
      <Text type="supporting" color="secondary">
        In Bottom Sheet presentation, purpose="form" blocks scrim clicks and swipe dismissal while preserving Escape. Use this opt-in only when that contract is acceptable; keep AlertDialog/destructive confirmations on Dialog unless a product deliberately chooses otherwise.
      </Text>
      <TextInput v-model="name" label="Name" />
      <TextInput v-model="email" label="Email" type="email" />
      <TextArea v-model="notes" label="Notes" :rows="6" />
      <HStack :gap="2" h-align="end" wrap="wrap">
        <Button label="Cancel" variant="secondary" @click="isOpen = false" />
        <Button label="Save profile" variant="primary" @click="isOpen = false" />
      </HStack>
    </VStack>
  </BottomSheet>
  <Dialog
    v-else
    :is-open="isOpen"
    max-height="75dvh"
    :purpose="purpose"
    :variant="resolvedPresentation() === 'fullscreen' ? 'fullscreen' : 'standard'"
    :width="480"
    @open-change="isOpen = $event"
  >
    <Layout>
      <template #header>
        <DialogHeader title="Edit profile" @open-change="isOpen = $event" />
      </template>
      <LayoutContent>
        <VStack :gap="4">
          <Text type="supporting" color="secondary">
            Dialog remains the default presentation. This example explicitly opts into a Bottom Sheet only at lg and below when the device has a coarse pointer and no hover. Pass the presentation prop to make tests or unusual environments deterministic.
          </Text>
          <Text type="supporting" color="secondary">
            In Bottom Sheet presentation, purpose="form" blocks scrim clicks and swipe dismissal while preserving Escape. Use this opt-in only when that contract is acceptable; keep AlertDialog/destructive confirmations on Dialog unless a product deliberately chooses otherwise.
          </Text>
          <TextInput v-model="name" label="Name" />
          <TextInput v-model="email" label="Email" type="email" />
          <TextArea v-model="notes" label="Notes" :rows="6" />
        </VStack>
      </LayoutContent>
      <template #footer>
        <LayoutFooter>
          <HStack :gap="2" h-align="end" wrap="wrap">
            <Button label="Cancel" variant="secondary" @click="isOpen = false" />
            <Button label="Save profile" variant="primary" @click="isOpen = false" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Dialog>
</template>
