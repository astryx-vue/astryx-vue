<script setup lang="ts">
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref, shallowRef } from 'vue'

const activeSheet = shallowRef<string | null>(null)
const frequency = shallowRef('daily')
const channels = ref({ email: true, push: false, sms: false })
</script>

<template>
  <Button label="Set up notifications" variant="secondary" @click="activeSheet = 'step-1'" />
  <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Set up notifications">
    <BottomSheet sheet-id="step-1" label="Set up notifications" height="hug">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            Set up notifications
          </Heading>
          <Text color="secondary" type="supporting">
            Step 1 of 3
          </Text>
        </VStack>
        <Divider variant="subtle" />
        <Text color="secondary" type="supporting">
          Stay informed about activity that matters without checking back throughout the day.
        </Text>
        <VStack :gap="3">
          <VStack :gap="1">
            <Text type="label">
              Important activity
            </Text>
            <Text color="secondary" type="supporting">
              Know when someone mentions you or needs your attention.
            </Text>
          </VStack>
          <VStack :gap="1">
            <Text type="label">
              Timely reminders
            </Text>
            <Text color="secondary" type="supporting">
              Get a reminder before work reaches its due date.
            </Text>
          </VStack>
          <VStack :gap="1">
            <Text type="label">
              Useful summaries
            </Text>
            <Text color="secondary" type="supporting">
              Catch up on anything you may have missed.
            </Text>
          </VStack>
        </VStack>
        <HStack :gap="2">
          <Button label="Cancel" variant="secondary" @click="activeSheet = null" />
          <Button label="Continue" variant="secondary" @click="activeSheet = 'step-2'" />
        </HStack>
      </VStack>
    </BottomSheet>

    <BottomSheet sheet-id="step-2" label="How often?" height="hug">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            How often?
          </Heading>
          <Text color="secondary" type="supporting">
            Step 2 of 3
          </Text>
        </VStack>
        <Divider variant="subtle" />
        <RadioList v-model="frequency" label="Notification frequency">
          <RadioListItem label="Immediately" value="immediately" />
          <RadioListItem label="Daily" value="daily" />
          <RadioListItem label="Weekly" value="weekly" />
        </RadioList>
        <HStack :gap="2">
          <Button label="Back" variant="secondary" @click="activeSheet = 'step-1'" />
          <Button label="Continue" variant="secondary" @click="activeSheet = 'step-3'" />
        </HStack>
      </VStack>
    </BottomSheet>

    <BottomSheet sheet-id="step-3" label="Where should we notify you?" height="hug">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            Where should we notify you?
          </Heading>
          <Text color="secondary" type="supporting">
            Step 3 of 3
          </Text>
        </VStack>
        <Divider variant="subtle" />
        <Text color="secondary" type="supporting">
          Choose any combination. You can change these preferences later.
        </Text>
        <VStack :gap="3">
          <CheckboxInput v-model="channels.email" label="Email" />
          <CheckboxInput v-model="channels.push" label="Push notifications" />
          <CheckboxInput v-model="channels.sms" label="Text messages" />
        </VStack>
        <HStack :gap="2">
          <Button label="Back" variant="secondary" @click="activeSheet = 'step-2'" />
          <Button label="Finish" variant="secondary" @click="activeSheet = null" />
        </HStack>
      </VStack>
    </BottomSheet>
  </BottomSheetSwitcher>
</template>
