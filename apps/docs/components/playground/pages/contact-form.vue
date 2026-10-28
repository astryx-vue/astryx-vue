<script setup lang="ts">
import type { Component } from 'vue'
import {
  Banner,
  Button,
  Card,
  Center,
  CheckboxInput,
  Divider,
  Grid,
  HStack,
  Icon,
  Link,
  RadioList,
  RadioListItem,
  Section,
  Selector,
  Text,
  TextArea,
  TextInput,
  Token,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, ref } from 'vue'

const CAMPAIGN_GOALS = [
  'Brand Awareness',
  'Product Sampling',
  'Product Launch',
  'Event Promotion',
  'Retail / In-Store',
  'Trade Show',
  'Influencer Activation',
  'Community Building',
  'Seasonal Campaign',
  'Other',
]

const LAUNCH_OPTIONS = [
  'Within 30 days',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  '12+ months',
]

const BUDGET_OPTIONS = [
  'Under $5K/mo',
  '$5K–$15K/mo',
  '$15K–$50K/mo',
  '$50K–$100K/mo',
  '$100K+/mo',
]

function iconComponent(className: string): Component {
  return defineComponent({
    render: () => h('span', { 'class': className, 'aria-hidden': 'true', 'style': 'width:1.25em;height:1.25em' }),
  })
}

const WHY_US = [
  {
    icon: iconComponent('i-heroicons-rocket-launch'),
    title: 'We move fast for you',
    description: 'We cut through the noise and get straight to the work.',
  },
  {
    icon: iconComponent('i-heroicons-adjustments-horizontal'),
    title: 'We build around you',
    description: 'We tailor everything to what you\'re trying to achieve.',
  },
  {
    icon: iconComponent('i-heroicons-hand-raised'),
    title: 'We show up for you',
    description: 'A dedicated team that knows your brand and wants to win.',
  },
]

const fullName = ref('')
const email = ref('')
const company = ref('')
const phone = ref('')
const goals = ref<string[]>([])
const timeline = ref('')
const budget = ref('')
const message = ref('')
const hearAboutUs = ref('')
const isDecider = ref(false)
const submitted = ref(false)

const errors = computed(() => submitted.value
  ? {
      fullName: !fullName.value.trim() ? 'Required' : undefined,
      email: !email.value.trim() ? 'Required' : undefined,
      company: !company.value.trim() ? 'Required' : undefined,
      phone: !phone.value.trim() ? 'Required' : undefined,
      goals: goals.value.length === 0 ? 'Pick at least one' : undefined,
      timeline: !timeline.value ? 'Required' : undefined,
      budget: !budget.value ? 'Required' : undefined,
    }
  : {})

function toggleGoal(goal: string) {
  goals.value = goals.value.includes(goal)
    ? goals.value.filter(g => g !== goal)
    : [...goals.value, goal]
}
</script>

<template>
  <Center axis="horizontal">
    <VStack h-align="center" width="100%">
      <Section :max-width="800" :padding="6" :padding-block="10" variant="section">
        <VStack :gap="6">
          <VStack :gap="2" h-align="center">
            <Text type="display-1" weight="bold">
              Let's work together
            </Text>
            <Text type="body" color="secondary">
              Tell us a bit about what you're working on — we'd love to help.
            </Text>
          </VStack>

          <VStack :gap="5">
            <Grid :columns="{ minWidth: 200 }" :gap="4">
              <Card v-for="item in WHY_US" :key="item.title">
                <VStack :gap="3">
                  <Icon :icon="item.icon" size="lg" color="accent" />
                  <VStack :gap="1">
                    <Text type="body" weight="bold">
                      {{ item.title }}
                    </Text>
                    <Text type="supporting" color="secondary">
                      {{ item.description }}
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            </Grid>
          </VStack>

          <VStack :gap="5">
            <Grid :columns="{ minWidth: 260 }" :gap="4">
              <TextInput
                v-model="fullName"
                label="Full Name"
                placeholder="Full Name"
                :status="errors.fullName ? { type: 'error', message: errors.fullName } : undefined"
              />
              <TextInput
                v-model="email"
                label="Email"
                placeholder="you@company.com"
                :status="errors.email ? { type: 'error', message: errors.email } : undefined"
              />
            </Grid>
            <Grid :columns="{ minWidth: 260 }" :gap="4">
              <TextInput
                v-model="company"
                label="Company"
                placeholder="Company"
                :status="errors.company ? { type: 'error', message: errors.company } : undefined"
              />
              <TextInput
                v-model="phone"
                label="Phone"
                placeholder="Phone number"
                :status="errors.phone ? { type: 'error', message: errors.phone } : undefined"
              />
            </Grid>
          </VStack>

          <Divider />

          <VStack :gap="5">
            <VStack :gap="2">
              <Text type="label" color="secondary">
                What are you going for?
              </Text>
              <HStack :gap="2" wrap="wrap">
                <Token
                  v-for="goal in CAMPAIGN_GOALS"
                  :key="goal"
                  :label="goal"
                  :color="goals.includes(goal) ? 'blue' : 'default'"
                  @click="toggleGoal(goal)"
                />
              </HStack>
              <Banner v-if="errors.goals" status="error" :title="errors.goals" />
            </VStack>

            <Selector
              v-model="timeline"
              label="When are you thinking?"
              placeholder="When are you thinking of launching?"
              :options="LAUNCH_OPTIONS"
              :status="errors.timeline ? { type: 'error', message: errors.timeline } : undefined"
            />

            <Selector
              v-model="budget"
              label="Ballpark budget?"
              placeholder="What's your rough monthly budget?"
              :options="BUDGET_OPTIONS"
              :status="errors.budget ? { type: 'error', message: errors.budget } : undefined"
            />

            <RadioList v-model="hearAboutUs" label="How did you hear about us?">
              <RadioListItem label="Social media" value="social" />
              <RadioListItem label="Word of mouth" value="word-of-mouth" />
              <RadioListItem label="Search engine" value="search" />
              <RadioListItem label="Event or conference" value="event" />
              <RadioListItem label="Other" value="other" />
            </RadioList>

            <TextArea
              v-model="message"
              label="Anything else?"
              placeholder="Tell us whatever else is on your mind..."
              :rows="3"
              control-class="contact-form-textarea"
            />

            <CheckboxInput v-model="isDecider" label="I'm a budget decision-maker" />
          </VStack>

          <VStack :gap="3">
            <Button label="Submit" variant="primary" size="lg" @click="submitted = true" />
            <HStack :gap="1" justify="center">
              <Text type="supporting" color="secondary">
                By submitting you agree to our
                <Link href="#" size="sm">
                  Privacy Policy
                </Link>.
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Section>
    </VStack>
  </Center>
</template>

<style>
/* 待 core 修复后去掉：TextArea 外框自带 8px 内边距和 80px 最小高度，原版是文本区自己 4px 8px、高度由 rows 决定。 */
.contact-form-textarea {
  min-height: auto;
  padding: 0;
}
.contact-form-textarea .astryx-text-area-control {
  padding: 4px 8px;
}
</style>
