<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Card,
  FormLayout,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  RadioList,
  RadioListItem,
  StackItem,
  Step,
  Stepper,
  Text,
  TextInput,
  VStack,
} from '@astryx-vue/core'

const STEPS = ['Details', 'Preferences', 'Confirm']
const step = ref(0)
const name = ref('')
const email = ref('')
const channel = ref('email')
const frequency = ref('weekly')

const isLast = computed(() => step.value === STEPS.length - 1)

function next() {
  if (!isLast.value)
    step.value += 1
}
function back() {
  step.value = Math.max(0, step.value - 1)
}
</script>

<template>
  <Layout height="fill" :padding="6">
    <template #default>
      <LayoutContent>
        <Card :padding="6">
          <VStack :gap="6">
            <Heading :level="1">
              Notification preferences
            </Heading>
            <Stepper :active-step="step" orientation="horizontal" density="compact" label="Progress">
              <Step v-for="(label, i) in STEPS" :key="label" :step="i" :label="label" />
            </Stepper>
            <FormLayout v-if="step === 0" default-optionality="optional">
              <TextInput v-model="name" label="Display name" is-required />
              <TextInput v-model="email" label="Email" is-required />
            </FormLayout>
            <FormLayout v-else-if="step === 1" default-optionality="optional">
              <RadioList v-model="channel" label="Channel">
                <RadioListItem value="email" label="Email" />
                <RadioListItem value="push" label="Push" />
                <RadioListItem value="sms" label="SMS" />
              </RadioList>
              <RadioList v-model="frequency" label="Frequency">
                <RadioListItem value="daily" label="Daily digest" />
                <RadioListItem value="weekly" label="Weekly summary" />
              </RadioList>
            </FormLayout>
            <VStack v-else :gap="2">
              <Text type="body">
                {{ name }} will receive {{ frequency }} updates via {{ channel }} at {{ email }}.
              </Text>
            </VStack>
          </VStack>
        </Card>
      </LayoutContent>
    </template>
    <template #footer>
      <LayoutFooter>
        <HStack :gap="2">
          <Button label="Back" variant="secondary" :is-disabled="step === 0" @click="back" />
          <StackItem size="fill" />
          <Button :label="isLast ? 'Save preferences' : 'Continue'" variant="primary" @click="next" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
