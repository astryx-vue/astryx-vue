<script setup lang="ts">
import {
  Badge,
  Banner,
  Button,
  Card,
  CheckboxInput,
  CheckboxList,
  CheckboxListItem,
  Divider,
  FormLayout,
  Grid,
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
  SelectableCard,
  Selector,
  StackItem,
  Step,
  Stepper,
  Switch,
  Text,
  TextArea,
  TextInput,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

const STEPS = [
  { label: 'Workspace' },
  { label: 'Team', isOptional: true },
  { label: 'Plan' },
  { label: 'Review' },
]

const REGIONS = [
  { value: 'us-east', label: 'US East (N. Virginia)' },
  { value: 'us-west', label: 'US West (Oregon)' },
  { value: 'eu-central', label: 'EU Central (Frankfurt)' },
  { value: 'ap-southeast', label: 'Asia Pacific (Singapore)' },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  member: 'Member',
  guest: 'Guest',
}

const PLANS = [
  {
    id: 'starter',
    label: 'Starter',
    pricePerSeat: 0,
    seatLimit: 5,
    description: 'Up to 5 members, 3 projects, community support.',
  },
  {
    id: 'growth',
    label: 'Growth',
    pricePerSeat: 24,
    seatLimit: 250,
    description: 'Unlimited projects, integrations, and standard support.',
  },
  {
    id: 'scale',
    label: 'Scale',
    pricePerSeat: 48,
    seatLimit: 2000,
    description: 'Advanced controls, a 99.9% SLA, and a dedicated CSM.',
  },
]

const ADDONS = [
  {
    id: 'sso',
    label: 'SSO / SAML',
    price: 3,
    description: 'Single sign-on through Okta, Entra ID, or Google.',
  },
  {
    id: 'audit',
    label: 'Audit log export',
    price: 2,
    description: 'Stream workspace audit events to your SIEM.',
  },
  {
    id: 'support',
    label: 'Priority support',
    price: 6,
    description: 'Four-hour response target, 24/5.',
  },
]

const TAKEN_SLUGS = ['admin', 'app', 'api', 'northwind', 'support']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]{2,}$/
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

function money(n: number) {
  return n === 0 ? '$0' : `$${n.toLocaleString()}`
}

/** 把多行或逗号分隔的地址拆成数组，顺手丢掉空行。 */
function parseEmails(raw: string) {
  return raw
    .split(/[\n,]/)
    .map(line => line.trim())
    .filter(Boolean)
}

const isNarrow = useMediaQuery('(max-width: 640px)')

const step = ref(0)
/** 用户尝试离开过的步骤；没进过这个集合的步骤不会提前标红。 */
const attempted = ref<ReadonlySet<number>>(new Set())

const name = ref('Northwind Robotics')
const slug = ref('northwind-robotics')
const region = ref('us-east')
const visibility = ref('invite')

const invites = ref(
  'amara.diallo@northwind.dev\nfelix.tran@northwind.dev\nrosa.marchetti@northwind.dev',
)
const role = ref('member')
const sendNow = ref(true)
const inviteNote = ref('')

const planId = ref('growth')
const seats = ref(8)
const addons = ref<string[]>(['audit'])
const digest = ref(true)

const acceptedTerms = ref(false)

const emails = computed(() => parseEmails(invites.value))
const invalidEmails = computed(() => emails.value.filter(email => !EMAIL_PATTERN.test(email)))
const plan = computed(() => PLANS.find(p => p.id === planId.value) ?? PLANS[0])
const addonCostPerSeat = computed(() =>
  ADDONS.filter(a => addons.value.includes(a.id)).reduce((sum, a) => sum + a.price, 0),
)
const monthlyTotal = computed(() => (plan.value.pricePerSeat + addonCostPerSeat.value) * seats.value)

/** 每一关的报错规则；按钮、Stepper 的颜色、Review 的问题清单都读它。 */
const errorsByStep = computed<Array<Record<string, string>>>(() => {
  const workspace: Record<string, string> = {}
  if (!name.value.trim())
    workspace.name = 'Enter a name for the workspace.'

  if (!slug.value.trim()) {
    workspace.slug = 'Enter a URL for the workspace.'
  }
  else if (!SLUG_PATTERN.test(slug.value)) {
    workspace.slug = 'Use lowercase letters, numbers, and hyphens, starting and ending with a letter or number.'
  }
  else if (TAKEN_SLUGS.includes(slug.value)) {
    workspace.slug = `terrace.app/${slug.value} is already taken.`
  }

  const team: Record<string, string> = {}
  if (invalidEmails.value.length > 0)
    team.invites = `Not a valid email address: ${invalidEmails.value.join(', ')}`

  const planStep: Record<string, string> = {}
  if (seats.value < 1) {
    planStep.seats = 'A workspace needs at least one seat.'
  }
  else if (seats.value > plan.value.seatLimit) {
    planStep.seats = `${plan.value.label} tops out at ${plan.value.seatLimit} seats. Choose a larger plan or reduce the seat count.`
  }
  else if (seats.value < emails.value.length + 1) {
    planStep.seats = `You are inviting ${emails.value.length} ${emails.value.length === 1 ? 'person' : 'people'} plus yourself, so you need at least ${emails.value.length + 1} seats.`
  }

  const review: Record<string, string> = {}
  if (!acceptedTerms.value)
    review.terms = 'Accept the terms to create the workspace.'

  return [workspace, team, planStep, review]
})

function shownErrors(index: number): Record<string, string> {
  return attempted.value.has(index) ? errorsByStep.value[index] : {}
}

const currentErrors = computed(() => shownErrors(step.value))
const isLastStep = computed(() => step.value === STEPS.length - 1)

/** 前面已经尝试过、仍然有问题没解决的步骤，在 Review 里集中列出来。 */
const outstanding = computed(() =>
  STEPS.map((s, i) => ({ ...s, index: i, issues: Object.values(shownErrors(i)) }))
    .filter(s => s.index !== step.value && s.issues.length > 0),
)

function markAttempted(index: number) {
  attempted.value = new Set(attempted.value).add(index)
}

function goNext() {
  markAttempted(step.value)
  if (Object.keys(errorsByStep.value[step.value]).length)
    return
  if (!isLastStep.value)
    step.value += 1
}

/** Skip 不是换名字的 Next：它放弃这一步已经填的东西，再往前走。 */
function goSkip() {
  invites.value = ''
  inviteNote.value = ''
  step.value = Math.min(STEPS.length - 1, step.value + 1)
}

function goTo(index: number) {
  if (index > step.value)
    markAttempted(step.value)
  step.value = index
}

function visibilityLabel(value: string) {
  return value === 'invite'
    ? 'Invite only'
    : value === 'domain'
      ? 'Anyone at northwind.dev'
      : 'Anyone with the link'
}
</script>

<template>
  <Layout height="fill" :content-width="720" :padding="5" default-has-dividers>
    <template #header>
      <LayoutHeader :has-divider="false">
        <VStack :gap="isNarrow ? 3 : 5">
          <HStack :gap="3" align="center">
            <StackItem size="fill">
              <Heading :level="1">
                Create workspace
              </Heading>
            </StackItem>
            <Button label="Cancel" variant="ghost" />
          </HStack>
          <Stepper
            :active-step="step"
            orientation="horizontal"
            density="balanced"
            indicator-position="on-track"
            label="Create workspace progress"
            @step-click="goTo"
          >
            <Step
              v-for="(s, i) in STEPS"
              :key="s.label"
              :step="i"
              :label="s.label"
              :is-optional="s.isOptional"
              :status="Object.keys(shownErrors(i)).length ? 'error' : undefined"
            />
          </Stepper>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent>
      <VStack v-if="step === 0" :gap="5">
        <VStack :gap="1">
          <Heading :level="2">
            Workspace details
          </Heading>
          <Text type="supporting" color="secondary">
            Name your workspace and pick where its data lives. The region is permanent — moving data later means a migration.
          </Text>
        </VStack>
        <FormLayout default-optionality="optional">
          <TextInput
            v-model="name"
            label="Workspace name"
            is-required
            placeholder="Acme Inc."
            :status="currentErrors.name ? { type: 'error', message: currentErrors.name } : undefined"
          />
          <TextInput
            v-model="slug"
            label="Workspace URL"
            is-required
            placeholder="acme"
            :description="`terrace.app/${slug.trim() || 'your-workspace'}`"
            :status="currentErrors.slug ? { type: 'error', message: currentErrors.slug } : undefined"
          />
          <Selector
            v-model="region"
            label="Data region"
            :options="REGIONS"
            description="Where projects, files, and audit logs are stored at rest."
          />
          <RadioList v-model="visibility" label="Who can join">
            <RadioListItem
              value="invite"
              label="Invite only"
              description="People join only when an admin invites them."
            />
            <RadioListItem
              value="domain"
              label="Same domain"
              description="Anyone with a verified @northwind.dev address can join without an invite."
            />
            <RadioListItem
              value="open"
              label="Anyone"
              description="Anyone with the workspace link can request to join."
            />
          </RadioList>
        </FormLayout>
      </VStack>

      <VStack v-else-if="step === 1" :gap="5">
        <VStack :gap="1">
          <Heading :level="2">
            Invite your team
          </Heading>
          <Text type="supporting" color="secondary">
            Teammates get an email when the workspace is created. You can skip this and invite people later from settings.
          </Text>
        </VStack>
        <FormLayout default-optionality="optional">
          <TextArea
            v-model="invites"
            label="Email addresses"
            :rows="4"
            placeholder="jordan@acme.com&#10;priya@acme.com"
            description="One address per line, or separate them with commas."
            :status="currentErrors.invites
              ? { type: 'error', message: currentErrors.invites }
              : emails.length > 0
                ? { type: 'success', message: `${emails.length} ${emails.length === 1 ? 'address' : 'addresses'} ready to invite.` }
                : undefined"
          />
          <RadioList
            v-model="role"
            label="Default role for invitees"
            description="Each person's role can be changed individually after they join."
          >
            <RadioListItem value="admin" label="Admin" description="Manage billing, members, and workspace settings." />
            <RadioListItem value="member" label="Member" description="Create and edit projects. No access to admin settings." />
            <RadioListItem value="guest" label="Guest" description="View and comment on projects they are added to." />
          </RadioList>
          <Divider />
          <Switch
            v-model="sendNow"
            label="Send invites as soon as the workspace is created"
            description="Turn this off to create the workspace now and send invites yourself later."
            label-position="start"
            label-spacing="spread"
          />
          <TextArea
            v-if="sendNow"
            v-model="inviteNote"
            label="Add a note to the invite"
            :rows="2"
            :max-length="280"
            placeholder="We're moving planning off email — join us here."
          />
        </FormLayout>
      </VStack>

      <VStack v-else-if="step === 2" :gap="5">
        <VStack :gap="1">
          <Heading :level="2">
            Choose a plan
          </Heading>
          <Text type="supporting" color="secondary">
            Billed monthly per seat. Change plans or add capabilities at any time from workspace settings.
          </Text>
        </VStack>
        <FormLayout default-optionality="optional">
          <VStack :gap="2">
            <Text type="label">
              Plan
            </Text>
            <Grid :columns="{ minWidth: 200 }" :gap="3">
              <SelectableCard
                v-for="p in PLANS"
                :key="p.id"
                :label="`${p.label} plan`"
                :is-selected="planId === p.id"
                :padding="4"
                @change="planId = p.id"
              >
                <VStack :gap="2">
                  <HStack :gap="2" align="center" justify="between">
                    <Text type="label">
                      {{ p.label }}
                    </Text>
                    <Badge v-if="p.id === 'growth'" variant="success" label="Recommended" />
                  </HStack>
                  <Text type="large" weight="bold">
                    {{ p.pricePerSeat === 0 ? 'Free' : `${money(p.pricePerSeat)}/seat` }}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {{ p.description }}
                  </Text>
                </VStack>
              </SelectableCard>
            </Grid>
          </VStack>
          <NumberInput
            v-model="seats"
            label="Seats"
            :min="1"
            :max="plan.seatLimit"
            is-integer-only
            :description="`Includes you. ${plan.label} allows up to ${plan.seatLimit}.`"
            :status="currentErrors.seats ? { type: 'error', message: currentErrors.seats } : undefined"
          />
          <CheckboxList
            v-model="addons"
            label="Add-ons"
            description="Billed per seat alongside the plan."
          >
            <CheckboxListItem
              v-for="a in ADDONS"
              :key="a.id"
              :value="a.id"
              :label="`${a.label} — ${money(a.price)}/seat`"
              :description="a.description"
            />
          </CheckboxList>
          <Divider />
          <Switch
            v-model="digest"
            label="Weekly usage digest"
            description="Email admins a summary of seats and activity every Monday."
            label-position="start"
            label-spacing="spread"
          />
        </FormLayout>
        <Card variant="muted" :padding="5">
          <HStack :gap="3" align="center" justify="between">
            <VStack :gap="0.5">
              <Text type="label">
                Estimated monthly cost
              </Text>
              <Text type="supporting" color="secondary">
                {{ seats }} {{ seats === 1 ? 'seat' : 'seats' }} × {{ money(plan.pricePerSeat + addonCostPerSeat) }}{{ addonCostPerSeat > 0 ? ` (${money(plan.pricePerSeat)} plan + ${money(addonCostPerSeat)} add-ons)` : '' }}
              </Text>
            </VStack>
            <Text type="display-3">
              {{ money(monthlyTotal) }}
            </Text>
          </HStack>
        </Card>
      </VStack>

      <VStack v-else :gap="5">
        <VStack :gap="1">
          <Heading :level="2">
            Review and create
          </Heading>
          <Text type="supporting" color="secondary">
            Nothing is saved until you create the workspace. Use the steps above to go back and edit.
          </Text>
        </VStack>

        <Banner
          v-if="outstanding.length > 0"
          status="error"
          :title="`${outstanding.length} ${outstanding.length === 1 ? 'step needs' : 'steps need'} attention`"
          :collapsible="false"
        >
          <VStack :gap="2">
            <Text v-for="s in outstanding" :key="s.label" type="supporting">
              <Text type="supporting" display="inline" weight="bold">
                {{ s.label }}
              </Text>: {{ s.issues.join(' ') }}
            </Text>
            <HStack :gap="2">
              <Button
                :label="`Go to ${outstanding[0].label}`"
                variant="secondary"
                size="sm"
                @click="step = outstanding[0].index"
              />
            </HStack>
          </VStack>
        </Banner>

        <MetadataList orientation="vertical">
          <MetadataListItem label="Workspace name">
            {{ name.trim() || '—' }}
          </MetadataListItem>
          <MetadataListItem label="Workspace URL">
            terrace.app/{{ slug.trim() || '—' }}
          </MetadataListItem>
          <MetadataListItem label="Data region">
            {{ REGIONS.find(r => r.value === region)?.label ?? region }}
          </MetadataListItem>
          <MetadataListItem label="Who can join">
            {{ visibilityLabel(visibility) }}
          </MetadataListItem>
          <MetadataListItem label="Invitations">
            {{ emails.length === 0
              ? 'None'
              : `${emails.length} ${emails.length === 1 ? 'person' : 'people'} as ${ROLE_LABELS[role]}${sendNow ? '' : ', sent later'}` }}
          </MetadataListItem>
          <MetadataListItem label="Plan">
            {{ plan.pricePerSeat === 0 ? `${plan.label} (Free)` : `${plan.label} · ${money(plan.pricePerSeat)}/seat` }}
          </MetadataListItem>
          <MetadataListItem label="Add-ons">
            {{ addons.length === 0 ? 'None' : ADDONS.filter(a => addons.includes(a.id)).map(a => a.label).join(', ') }}
          </MetadataListItem>
          <MetadataListItem label="Estimated monthly cost">
            {{ money(monthlyTotal) }} · {{ seats }} {{ seats === 1 ? 'seat' : 'seats' }}
          </MetadataListItem>
        </MetadataList>

        <Divider />

        <CheckboxInput
          v-model="acceptedTerms"
          label="I agree to the Terms of Service and the Data Processing Addendum"
          :status="currentErrors.terms ? { type: 'error', message: currentErrors.terms } : undefined"
        />
      </VStack>
    </LayoutContent>

    <template #footer>
      <LayoutFooter>
        <HStack :gap="3" align="center">
          <StackItem size="fill" :style="{ flexBasis: 0 }">
            <Button v-if="STEPS[step].isOptional" label="Skip" variant="ghost" @click="goSkip" />
          </StackItem>
          <Text type="supporting" color="secondary">
            {{ step + 1 }} of {{ STEPS.length }}
          </Text>
          <StackItem size="fill" :style="{ flexBasis: 0 }">
            <HStack :gap="3" justify="end">
              <Button
                label="Back"
                variant="secondary"
                :is-disabled="step === 0"
                @click="step = Math.max(0, step - 1)"
              />
              <Button
                :label="isLastStep ? 'Create workspace' : 'Next'"
                variant="primary"
                @click="goNext"
              />
            </HStack>
          </StackItem>
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
