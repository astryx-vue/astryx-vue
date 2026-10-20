<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Banner,
  Button,
  Card,
  CheckboxInput,
  FieldStatus,
  FormLayout,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  MetadataList,
  MetadataListItem,
  NumberInput,
  RadioList,
  RadioListItem,
  Selector,
  StackItem,
  Step,
  Stepper,
  Switch,
  TextArea,
  TextInput,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'

const STEPS = [
  { label: 'Workspace' },
  { label: 'Team', isOptional: true },
  { label: 'Plan' },
  { label: 'Review' },
]

const REGIONS = [
  { value: 'us-east', label: 'US East (N. Virginia)' },
  { value: 'us-west', label: 'US West (Oregon)' },
  { value: 'eu-west', label: 'EU West (Ireland)' },
]

const PLANS = [
  { value: 'starter', label: 'Starter', description: 'Up to 10 seats · 50 GB storage' },
  { value: 'growth', label: 'Growth', description: 'Up to 50 seats · 500 GB storage' },
  { value: 'enterprise', label: 'Enterprise', description: 'Unlimited seats · dedicated support' },
]

const isNarrow = useMediaQuery('(max-width: 768px)')
const step = ref(0)
const attempted = ref<Set<number>>(new Set())

const workspaceName = ref('')
const region = ref('us-east')
const dataResidency = ref(true)

const inviteEmails = ref('')
const defaultRole = ref('editor')

const plan = ref('growth')
const seats = ref(12)
const annualBilling = ref(true)

const notes = ref('')

function validate(index: number): Record<string, string> {
  if (index === 0) {
    return workspaceName.value.trim() ? {} : { workspaceName: 'Name your workspace.' }
  }
  if (index === 2) {
    return plan.value ? {} : { plan: 'Choose a plan.' }
  }
  return {}
}

const currentErrors = computed(() => attempted.value.has(step.value) ? validate(step.value) : {})
const isLastStep = computed(() => step.value === STEPS.length - 1)

function goNext() {
  attempted.value = new Set(attempted.value).add(step.value)
  if (Object.keys(validate(step.value)).length)
    return
  if (!isLastStep.value)
    step.value += 1
}

function goBack() {
  step.value = Math.max(0, step.value - 1)
}
</script>

<template>
  <Layout height="fill" :padding="6" default-has-dividers>
    <template #header>
      <LayoutHeader has-divider>
        <VStack :gap="4">
          <Heading :level="1">
            Create workspace
          </Heading>
          <Stepper :active-step="step" :orientation="isNarrow ? 'vertical' : 'horizontal'" label="Setup progress" @update:active-step="step = $event">
            <Step
              v-for="(s, i) in STEPS"
              :key="s.label"
              :step="i"
              :label="s.label"
              :status="attempted.has(i) && Object.keys(validate(i)).length ? 'error' : undefined"
            />
          </Stepper>
        </VStack>
      </LayoutHeader>
    </template>
    <template #default>
      <LayoutContent>
        <VStack :gap="6">
          <FormLayout v-if="step === 0" default-optionality="optional">
            <TextInput
              v-model="workspaceName"
              label="Workspace name"
              is-required
              placeholder="Northwind Analytics"
              :status="currentErrors.workspaceName ? { type: 'error', message: currentErrors.workspaceName } : undefined"
            />
            <Selector v-model="region" label="Primary region" :options="REGIONS" />
            <Switch v-model="dataResidency" label="Keep data in this region" label-position="start" label-spacing="spread" />
          </FormLayout>

          <FormLayout v-else-if="step === 1" default-optionality="optional">
            <TextArea v-model="inviteEmails" label="Invite teammates" placeholder="email@company.com, one per line" :rows="4" />
            <RadioList v-model="defaultRole" label="Default role">
              <RadioListItem value="editor" label="Editor" />
              <RadioListItem value="viewer" label="Viewer" />
            </RadioList>
          </FormLayout>

          <FormLayout v-else-if="step === 2" default-optionality="optional">
            <RadioList v-model="plan" label="Plan" :status="currentErrors.plan ? { type: 'error', message: currentErrors.plan } : undefined">
              <RadioListItem v-for="p in PLANS" :key="p.value" :value="p.value" :label="p.label" :description="p.description" />
            </RadioList>
            <NumberInput v-model="seats" label="Seats" :min="1" :max="200" is-integer-only />
            <CheckboxInput v-model="annualBilling" label="Bill annually (save 20%)" />
            <Card>
              <Banner status="info" title="Estimated cost" :description="annualBilling ? '$4,800 / year' : '$500 / month'" />
            </Card>
          </FormLayout>

          <FormLayout v-else default-optionality="optional">
            <MetadataList columns="single">
              <MetadataListItem label="Workspace">
                {{ workspaceName || '—' }}
              </MetadataListItem>
              <MetadataListItem label="Region">
                {{ REGIONS.find(r => r.value === region)?.label }}
              </MetadataListItem>
              <MetadataListItem label="Plan">
                {{ PLANS.find(p => p.value === plan)?.label }}
              </MetadataListItem>
              <MetadataListItem label="Seats">
                {{ seats }}
              </MetadataListItem>
            </MetadataList>
            <TextArea v-model="notes" label="Notes for your team" :rows="3" />
          </FormLayout>
        </VStack>
      </LayoutContent>
    </template>
    <template #footer>
      <LayoutFooter>
        <HStack :gap="2" align="center">
          <Button label="Back" variant="secondary" :is-disabled="step === 0" @click="goBack" />
          <StackItem size="fill" />
          <FieldStatus
            v-if="Object.keys(currentErrors).length"
            type="error"
            variant="detached"
            message="Fix the fields above to continue."
          />
          <Button :label="isLastStep ? 'Create workspace' : 'Next'" variant="primary" @click="goNext" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
