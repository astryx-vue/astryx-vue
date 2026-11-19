<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { Section } from '@astryx-vue/core/Section'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

type Step = 'overview' | 'frequency' | 'channels' | null

// One value names the open step. Moving on closes one sheet and opens the next
// in the same update, which replaces it in place.
const step = ref<Step>(null)
const frequency = ref('daily')
const email = ref(true)
const pushNotifications = ref(true)
const textMessages = ref(false)

function onOpenChange(id: Step, isOpen: boolean): void {
  // Clear the step only if it is still the open one: a step that closes
  // because the person moved on must not undo the move.
  if (!isOpen && step.value === id)
    step.value = null
}
</script>

<template>
  <Button label="Set up notifications" @click="step = 'overview'" />

  <BottomSheet
    :is-open="step === 'overview'"
    label="Set up notifications"
    height="hug"
    @open-change="onOpenChange('overview', $event)"
  >
    <Section :padding="4">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            Set up notifications
          </Heading>
          <Text type="supporting" color="secondary">
            Step 1 of 3
          </Text>
        </VStack>
        <Divider />
        <Text type="supporting" color="secondary">
          Stay informed about activity that matters without checking back throughout the day.
        </Text>
        <VStack :gap="3">
          <VStack :gap="1">
            <Text type="label">
              Important activity
            </Text>
            <Text type="supporting" color="secondary">
              Know when someone mentions you or needs your attention.
            </Text>
          </VStack>
          <VStack :gap="1">
            <Text type="label">
              Timely reminders
            </Text>
            <Text type="supporting" color="secondary">
              Get a reminder before work reaches its due date.
            </Text>
          </VStack>
          <VStack :gap="1">
            <Text type="label">
              Useful summaries
            </Text>
            <Text type="supporting" color="secondary">
              Catch up on anything you may have missed.
            </Text>
          </VStack>
        </VStack>
        <HStack :gap="2" h-align="end">
          <Button label="Cancel" variant="secondary" @click="step = null" />
          <Button label="Continue" @click="step = 'frequency'" />
        </HStack>
      </VStack>
    </Section>
  </BottomSheet>

  <BottomSheet
    :is-open="step === 'frequency'"
    label="Notification frequency"
    height="hug"
    @open-change="onOpenChange('frequency', $event)"
  >
    <Section :padding="4">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            How often?
          </Heading>
          <Text type="supporting" color="secondary">
            Step 2 of 3
          </Text>
        </VStack>
        <Divider />
        <RadioList v-model="frequency" label="Notification frequency" is-label-hidden>
          <RadioListItem label="Immediately" value="immediately" />
          <RadioListItem label="Daily" value="daily" />
          <RadioListItem label="Weekly" value="weekly" />
        </RadioList>
        <HStack :gap="2" h-align="end">
          <Button label="Back" variant="secondary" @click="step = 'overview'" />
          <Button label="Continue" @click="step = 'channels'" />
        </HStack>
      </VStack>
    </Section>
  </BottomSheet>

  <BottomSheet
    :is-open="step === 'channels'"
    label="Notification channels"
    height="hug"
    @open-change="onOpenChange('channels', $event)"
  >
    <Section :padding="4">
      <VStack :gap="4">
        <VStack :gap="1">
          <Heading :level="3">
            Where should we notify you?
          </Heading>
          <Text type="supporting" color="secondary">
            Step 3 of 3
          </Text>
        </VStack>
        <Divider />
        <Text type="supporting" color="secondary">
          Choose any combination. You can change these preferences later.
        </Text>
        <CheckboxList label="Notification channels" is-label-hidden>
          <CheckboxListItem label="Email" :is-checked="email" @check="email = $event" />
          <CheckboxListItem label="Push notifications" :is-checked="pushNotifications" @check="pushNotifications = $event" />
          <CheckboxListItem label="Text messages" :is-checked="textMessages" @check="textMessages = $event" />
        </CheckboxList>
        <HStack :gap="2" h-align="end">
          <Button label="Back" variant="secondary" @click="step = 'frequency'" />
          <Button label="Finish" @click="step = null" />
        </HStack>
      </VStack>
    </Section>
  </BottomSheet>
</template>
