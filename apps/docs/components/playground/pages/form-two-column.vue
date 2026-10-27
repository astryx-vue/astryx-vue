<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import {
  AspectRatio,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  HStack,
  Link,
  Section,
  Selector,
  Text,
  TextArea,
  TextInput,
  Token,
  VStack,
} from '@astryx-vue/core'

const ILLUSTRATION_URL = '/template-assets/light-working-vertical-2.png'

const INQUIRY_REASONS = [
  'New business',
  'General inquiry',
  'Press & media',
  'Partnerships',
  'Product feedback',
  'Technical support',
  'Other',
]

const BUDGET_OPTIONS = [
  'Under $10k',
  '$10k – $50k',
  '$50k – $100k',
  '$100k – $500k',
  '$500k+',
  'Not sure yet',
]

const CONTACT_COLUMNS = [
  { label: 'General inquiries', email: 'hello@company.com' },
  { label: 'New business', email: 'newbiz@company.com' },
  { label: 'Press & partnerships', email: 'press@company.com' },
]

const pageStyle: CSSProperties = { minHeight: '100%' }
const illustrationImg: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'var(--astryx-radius-container)',
  overflow: 'hidden',
}

const fullName = ref('')
const email = ref('')
const company = ref('')
const jobTitle = ref('')
const phone = ref('')
const inquiryReason = ref('')
const budget = ref('')
const details = ref('')
const submitted = ref(false)

const errors = computed(() => submitted.value
  ? {
      fullName: !fullName.value.trim() ? 'Required' : undefined,
      email: !email.value.trim() ? 'Required' : undefined,
      details: !details.value.trim() ? 'Required' : undefined,
    }
  : {})

function handleSubmit() {
  submitted.value = true
}

function toggleReason(reason: string) {
  inquiryReason.value = inquiryReason.value === reason ? '' : reason
}
</script>

<template>
  <Center :style="pageStyle">
    <Section :max-width="1100" width="100%" :padding="10" variant="transparent">
      <VStack :gap="10">
        <Grid :columns="{ minWidth: 320 }" align="center" :gap="10">
          <VStack :gap="6">
            <VStack :gap="3">
              <Text type="display-1" as="h1">
                Let's work together
              </Text>
              <Text type="body" color="secondary">
                Tell us what you're working on and we'll help you
                figure out the best path forward.
              </Text>
            </VStack>
            <AspectRatio :ratio="4 / 3">
              <img
                :src="ILLUSTRATION_URL"
                alt="Two people working at a desk"
                :style="illustrationImg"
              >
            </AspectRatio>
          </VStack>

          <Card :padding="8">
            <VStack :gap="4">
              <Text type="label">
                Your details
              </Text>
              <TextInput
                v-model="fullName"
                label="Full name"
                is-label-hidden
                placeholder="Full name*"
                :status="errors.fullName ? { type: 'error', message: errors.fullName } : undefined"
              />
              <Grid :columns="{ minWidth: 180 }" :gap="3">
                <TextInput
                  v-model="email"
                  label="Email"
                  is-label-hidden
                  placeholder="Email*"
                  :status="errors.email ? { type: 'error', message: errors.email } : undefined"
                />
                <TextInput
                  v-model="company"
                  label="Company name"
                  is-label-hidden
                  placeholder="Company name"
                />
              </Grid>
              <Grid :columns="{ minWidth: 180 }" :gap="3">
                <TextInput
                  v-model="jobTitle"
                  label="Job title"
                  is-label-hidden
                  placeholder="Job title"
                />
                <TextInput
                  v-model="phone"
                  label="Phone number"
                  is-label-hidden
                  placeholder="Phone number"
                />
              </Grid>

              <VStack :gap="2">
                <Text type="label">
                  What are you reaching out about?
                </Text>
                <HStack :gap="2" wrap="wrap">
                  <Token
                    v-for="reason in INQUIRY_REASONS"
                    :key="reason"
                    :label="reason"
                    :color="inquiryReason === reason ? 'blue' : 'default'"
                    @click="toggleReason(reason)"
                  />
                </HStack>
              </VStack>
              <Selector
                v-model="budget"
                label="Budget range"
                :options="BUDGET_OPTIONS"
                placeholder="Select a budget range..."
              />
              <TextArea
                v-model="details"
                label="Project details"
                is-label-hidden
                placeholder="Project details*"
                :status="errors.details ? { type: 'error', message: errors.details } : undefined"
              />
              <VStack hAlign="stretch">
                <Button label="Let's connect" variant="primary" @click="handleSubmit" />
              </VStack>
            </VStack>
          </Card>
        </Grid>

        <VStack :gap="6">
          <Divider />
          <Grid :columns="{ minWidth: 200 }" :gap="6">
            <VStack v-for="col in CONTACT_COLUMNS" :key="col.label" :gap="1" justify="center">
              <Text type="supporting" color="secondary">
                {{ col.label }}
              </Text>
              <Link :href="`mailto:${col.email}`" type="body" size="sm">
                {{ col.email }}
              </Link>
            </VStack>
          </Grid>
        </VStack>
      </VStack>
    </Section>
  </Center>
</template>
