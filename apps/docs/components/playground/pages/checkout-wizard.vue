<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Card,
  Divider,
  FormLayout,
  Grid,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  RadioList,
  RadioListItem,
  StackItem,
  Step,
  Stepper,
  Text,
  TextInput,
  VStack,
} from '@astryx-vue/core'

const STEPS = ['Shipping', 'Payment', 'Review']
const step = ref(0)

const fullName = ref('')
const address = ref('')
const city = ref('')
const card = ref('')
const method = ref('card')

const shippingValid = computed(() => fullName.value.trim() && address.value.trim() && city.value.trim())
const paymentValid = computed(() => method.value === 'card' ? card.value.trim().length >= 12 : true)
const isLast = computed(() => step.value === STEPS.length - 1)

function next() {
  if (step.value === 0 && !shippingValid.value)
    return
  if (step.value === 1 && !paymentValid.value)
    return
  if (!isLast.value)
    step.value += 1
}
function back() {
  step.value = Math.max(0, step.value - 1)
}
</script>

<template>
  <Layout height="fill" :padding="6" default-has-dividers>
    <template #header>
      <LayoutHeader has-divider>
        <VStack :gap="4">
          <Heading :level="1">
            Checkout
          </Heading>
          <Stepper :active-step="step" orientation="horizontal" label="Checkout progress">
            <Step v-for="(label, i) in STEPS" :key="label" :step="i" :label="label" />
          </Stepper>
        </VStack>
      </LayoutHeader>
    </template>
    <template #default>
      <LayoutContent>
        <Grid :columns="{ minWidth: 320, max: 2 }" :gap="8">
          <Card :padding="6">
            <FormLayout v-if="step === 0" default-optionality="optional">
              <TextInput v-model="fullName" label="Full name" is-required />
              <TextInput v-model="address" label="Street address" is-required />
              <TextInput v-model="city" label="City" is-required />
            </FormLayout>
            <FormLayout v-else-if="step === 1" default-optionality="optional">
              <RadioList v-model="method" label="Payment method">
                <RadioListItem value="card" label="Credit card" />
                <RadioListItem value="invoice" label="Invoice (Net 30)" />
              </RadioList>
              <TextInput v-if="method === 'card'" v-model="card" label="Card number" placeholder="4242 4242 4242 4242" is-required />
            </FormLayout>
            <VStack v-else :gap="3">
              <Text type="body" weight="semibold">
                Ship to {{ fullName }}
              </Text>
              <Text type="supporting" color="secondary">
                {{ address }}, {{ city }}
              </Text>
              <Divider />
              <Text type="body">
                Pay with {{ method === 'card' ? 'card ending ' + card.slice(-4) : 'invoice' }}
              </Text>
            </VStack>
          </Card>
          <Card :padding="6">
            <VStack :gap="3">
              <Heading :level="3">
                Order summary
              </Heading>
              <HStack justify="between">
                <Text color="secondary">
                  Subtotal
                </Text>
                <Text>$230.00</Text>
              </HStack>
              <HStack justify="between">
                <Text color="secondary">
                  Shipping
                </Text>
                <Text>$4.95</Text>
              </HStack>
              <Divider />
              <HStack justify="between">
                <Text weight="bold">
                  Total
                </Text>
                <Text weight="bold">
                  $234.95
                </Text>
              </HStack>
            </VStack>
          </Card>
        </Grid>
      </LayoutContent>
    </template>
    <template #footer>
      <LayoutFooter>
        <HStack :gap="2">
          <Button label="Back" variant="secondary" :is-disabled="step === 0" @click="back" />
          <StackItem size="fill" />
          <Button :label="isLast ? 'Place order' : 'Continue'" variant="primary" @click="next" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
