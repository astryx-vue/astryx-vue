<script setup lang="ts">
import type { ISOTimeString } from '@astryx-vue/core'
import { computed, ref, useId } from 'vue'
import {
  Banner,
  Button,
  Center,
  CheckboxList,
  CheckboxListItem,
  DateInput,
  Dialog,
  DialogHeader,
  Divider,
  Field,
  FieldStatus,
  FormLayout,
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  MetadataList,
  MetadataListItem,
  MultiSelector,
  RadioList,
  RadioListItem,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  StackItem,
  Step,
  Stepper,
  Switch,
  TextArea,
  TextInput,
  TimeInput,
  useToast,
  VStack,
} from '@astryx-vue/core'

const STEPS = ['Report', 'Schedule', 'Delivery']

const DATASETS = [
  { value: 'pipeline', label: 'Sales pipeline' },
  { value: 'revenue', label: 'Revenue and bookings' },
  { value: 'churn', label: 'Churn and retention' },
  { value: 'support', label: 'Support tickets' },
  { value: 'usage', label: 'Product usage' },
]

const SECTIONS = [
  { value: 'summary', label: 'Executive summary', description: 'Headline numbers and week-over-week change.' },
  { value: 'charts', label: 'Trend charts', description: 'Twelve-week series for each headline metric.' },
  { value: 'breakdown', label: 'Segment breakdown', description: 'Split by region, plan, and account size.' },
  { value: 'anomalies', label: 'Anomaly callouts', description: 'Metrics more than two standard deviations off trend.' },
]

const RECIPIENTS = [
  { value: 'exec', label: 'exec-staff@northwind.dev' },
  { value: 'sales', label: 'Sales leadership (9 people)' },
  { value: 'finance', label: 'finance@northwind.dev' },
  { value: 'amara', label: 'Amara Diallo' },
  { value: 'felix', label: 'Felix Tran' },
]

const TIMEZONES = [
  { value: 'pt', label: 'Pacific Time (PT)' },
  { value: 'et', label: 'Eastern Time (ET)' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
  { value: 'cet', label: 'Central European Time (CET)' },
]

const WEEKDAYS = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
]

function blockedMessage(count: number) {
  return count === 1
    ? 'One problem above needs fixing first.'
    : `${count} problems above need fixing first.`
}

const showToast = useToast()
const cadenceInputID = useId()
const cadenceLabelID = useId()

const step = ref(0)
const attempted = ref<ReadonlySet<number>>(new Set())

const name = ref('')
const dataset = ref('pipeline')
const sections = ref<string[]>(['summary', 'charts'])
const note = ref('')

const cadence = ref('weekly')
const weekday = ref('mon')
const time = ref<ISOTimeString | undefined>('08:00' as ISOTimeString)
const timezone = ref('pt')
const startDate = ref<Date | null>(null)

const recipients = ref<string[]>(['exec'])
const format = ref('pdf')
const skipEmpty = ref(true)

function resetDraft() {
  step.value = 0
  attempted.value = new Set()
  name.value = ''
  dataset.value = 'pipeline'
  sections.value = ['summary', 'charts']
  note.value = ''
  cadence.value = 'weekly'
  weekday.value = 'mon'
  time.value = '08:00' as ISOTimeString
  timezone.value = 'pt'
  startDate.value = null
  recipients.value = ['exec']
  format.value = 'pdf'
  skipEmpty.value = true
}

function handleOpenChange(isOpen: boolean) {
  if (!isOpen)
    resetDraft()
}

type StepErrors = Partial<Record<'name' | 'sections' | 'time' | 'startDate' | 'recipients', string>>

/** 每个步骤的必填项检查，顺序和 STEPS 一致。 */
function collectErrors(): StepErrors[] {
  return [
    {
      ...(name.value.trim() ? {} : { name: 'Give the report a name.' }),
      ...(sections.value.length === 0 ? { sections: 'Include at least one section.' } : {}),
    },
    {
      ...(time.value ? {} : { time: 'Pick a send time.' }),
      ...(startDate.value ? {} : { startDate: 'Pick a start date.' }),
    },
    {
      ...(recipients.value.length === 0 ? { recipients: 'Add at least one recipient.' } : {}),
    },
  ]
}

function errorsForStep(index: number): StepErrors {
  return attempted.value.has(index) ? collectErrors()[index]! : {}
}

const currentErrors = computed(() => errorsForStep(step.value))
const isLastStep = computed(() => step.value === STEPS.length - 1)

const cadenceSummary = computed(() => {
  if (cadence.value === 'daily')
    return `Every weekday at ${time.value ?? '—'}`
  if (cadence.value === 'weekly')
    return `${WEEKDAYS.find(d => d.value === weekday.value)?.label ?? weekday.value}s at ${time.value ?? '—'}`
  return `1st of the month at ${time.value ?? '—'}`
})

function goNext() {
  attempted.value = new Set(attempted.value).add(step.value)
  const errs = collectErrors()
  if (Object.keys(errs[step.value]!).length !== 0)
    return
  if (!isLastStep.value) {
    step.value += 1
    return
  }
  showToast({
    body: `${name.value.trim()} is scheduled · ${cadenceSummary.value}`,
    uniqueID: 'report-scheduled',
  })
  resetDraft()
}
</script>

<template>
  <Center height="100dvh">
    <Dialog
      is-open
      is-inline
      :width="620"
      class="form-wizard-dialog"
      purpose="form"
      @update:open="handleOpenChange"
    >
      <Layout height="fill" :padding="4" default-has-dividers>
        <template #header>
          <DialogHeader title="Schedule a report" @update:open="handleOpenChange" :has-divider="false" />
          <LayoutHeader :has-divider="false">
            <Stepper
              :active-step="step"
              orientation="horizontal"
              density="compact"
              label="Report setup progress"
            >
              <Step
                v-for="(label, i) in STEPS"
                :key="label"
                :step="i"
                :label="label"
                :status="Object.keys(errorsForStep(i)).length > 0 ? 'error' : undefined"
              />
            </Stepper>
          </LayoutHeader>
        </template>
        <template #default>
          <LayoutContent :padding="4">
            <VStack :gap="5">
              <FormLayout v-if="step === 0" default-optionality="optional">
                <TextInput
                  v-model="name"
                  label="Report name"
                  is-required
                  placeholder="Weekly pipeline review"
                  description="Used as the email subject line."
                  :status="currentErrors.name ? { type: 'error', message: currentErrors.name } : undefined"
                />
                <Selector v-model="dataset" label="Dataset" :options="DATASETS" />
                <CheckboxList
                  v-model="sections"
                  label="Sections to include"
                  density="compact"
                  :status="currentErrors.sections ? { type: 'error', message: currentErrors.sections } : undefined"
                >
                  <CheckboxListItem
                    v-for="section in SECTIONS"
                    :key="section.value"
                    :value="section.value"
                    :label="section.label"
                    :description="section.description"
                  />
                </CheckboxList>
              </FormLayout>

              <FormLayout v-else-if="step === 1" default-optionality="optional">
                <Field
                  label="How often"
                  :input-id="cadenceInputID"
                  :label-id="cadenceLabelID"
                  is-group-label
                >
                  <SegmentedControl
                    v-model="cadence"
                    label="How often"
                    :aria-labelledby="cadenceLabelID"
                    layout="fill"
                  >
                    <SegmentedControlItem value="daily" label="Weekdays" />
                    <SegmentedControlItem value="weekly" label="Weekly" />
                    <SegmentedControlItem value="monthly" label="Monthly" />
                  </SegmentedControl>
                </Field>
                <Selector
                  v-if="cadence === 'weekly'"
                  v-model="weekday"
                  label="Day of the week"
                  :options="WEEKDAYS"
                />
                <FormLayout direction="horizontal" default-optionality="optional">
                  <TimeInput
                    v-model="time"
                    label="Send at"
                    is-required
                    :status="currentErrors.time ? { type: 'error', message: currentErrors.time } : undefined"
                  />
                  <Selector v-model="timezone" label="Time zone" :options="TIMEZONES" />
                </FormLayout>
                <DateInput
                  v-model="startDate"
                  label="First run"
                  is-required
                  :status="currentErrors.startDate ? { type: 'error', message: currentErrors.startDate } : undefined"
                />
                <Banner
                  status="info"
                  :title="cadenceSummary"
                  description="Data is cut at the send time, so a report at 08:00 covers everything up to 08:00."
                />
              </FormLayout>

              <FormLayout v-else default-optionality="optional">
                <MultiSelector
                  v-model="recipients"
                  label="Recipients"
                  is-required
                  :options="RECIPIENTS"
                  has-search
                  trigger-display="badges"
                  description="Groups resolve at send time, so new members are included automatically."
                  :status="currentErrors.recipients ? 'error' : 'default'"
                  :status-message="currentErrors.recipients"
                />
                <RadioList v-model="format" label="Attachment format" size="sm">
                  <RadioListItem value="pdf" label="PDF" description="Best for reading. Charts render as images." />
                  <RadioListItem value="csv" label="CSV" description="Raw rows, no charts or summary." />
                  <RadioListItem value="both" label="Both" description="PDF in the body, CSV attached." />
                </RadioList>
                <Switch
                  v-model="skipEmpty"
                  label="Skip the send when there is no new data"
                  label-position="start"
                  label-spacing="spread"
                />
                <TextArea
                  v-model="note"
                  label="Note in the email"
                  :rows="2"
                  :max-length="200"
                  placeholder="Numbers are provisional until finance closes the month."
                />
                <Divider />
                <MetadataList columns="single">
                  <MetadataListItem label="Report">
                    {{ name.trim() || 'Untitled' }}
                  </MetadataListItem>
                  <MetadataListItem label="Runs">
                    {{ cadenceSummary }}
                    {{ TIMEZONES.find(t => t.value === timezone)?.label.match(/\(([^)]+)\)/)?.[1] ?? '' }}
                  </MetadataListItem>
                  <MetadataListItem label="Sent to">
                    {{ recipients.length === 0 ? '—' : `${recipients.length} ${recipients.length === 1 ? 'recipient' : 'recipients'}` }}
                  </MetadataListItem>
                </MetadataList>
              </FormLayout>
            </VStack>
          </LayoutContent>
        </template>
        <template #footer>
          <LayoutFooter>
            <HStack :gap="2" align="center">
              <Button
                label="Back"
                variant="secondary"
                :is-disabled="step === 0"
                @click="step = Math.max(0, step - 1)"
              />
              <StackItem size="fill" />
              <FieldStatus
                v-if="Object.keys(currentErrors).length > 0"
                type="error"
                variant="detached"
                :message="blockedMessage(Object.keys(currentErrors).length)"
              />
              <Button
                :label="isLastStep ? 'Schedule report' : 'Continue'"
                variant="primary"
                @click="goNext"
              />
            </HStack>
          </LayoutFooter>
        </template>
      </Layout>
    </Dialog>
  </Center>
</template>

<style>
.form-wizard-dialog :deep(.astryx-dialog__inner) {
  height: auto;
  max-height: 75vh;
}

.form-wizard-dialog :deep(.astryx-layout),
.form-wizard-dialog :deep(.astryx-layout__inner) {
  height: auto;
  min-height: 0;
  max-height: calc(75vh - 32px);
}
</style>
