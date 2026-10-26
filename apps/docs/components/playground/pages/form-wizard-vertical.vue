<script setup lang="ts">
import {
  AspectRatio,
  Banner,
  Button,
  Card,
  Center,
  CheckboxInput,
  CheckboxList,
  CheckboxListItem,
  DateInput,
  Divider,
  Field,
  FieldStatus,
  FileInput,
  FormLayout,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  MultiSelector,
  NumberInput,
  ProgressBar,
  RadioList,
  RadioListItem,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  StackItem,
  StatusDot,
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

// ── 数据 ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: 'Author profile',
    description: 'Create the profile readers see on your books.',
    help: [
      'Shared across every book you publish.',
      'Edits here reach titles already on sale.',
      'Readers see this before they see the book.',
    ],
  },
  {
    label: 'Book details',
    description: 'Add the metadata that helps readers discover the book.',
    help: [
      'Everything here feeds search and the store page.',
      'The cover and title are judged first.',
      'All of it stays editable after publishing.',
    ],
  },
  {
    label: 'Distribution',
    description: 'Choose where, when, and at what price the book goes on sale.',
    help: [
      'Territory and price take effect at release.',
      'Moving a date earlier needs a fresh review.',
      'Pre-orders open once the book clears review.',
    ],
  },
  {
    label: 'Payouts and agreements',
    description: 'Link a payout account and accept the publishing terms.',
    help: [
      'Royalties accrue from the release date.',
      'They pay out only once an account is linked.',
      'Linking late delays the money, never loses it.',
    ],
  },
  {
    label: 'Finalize and submit',
    description: 'Confirm the audio is ready and send the book for review.',
    help: [
      'Nothing is final until you submit.',
      'Metadata stays editable during review.',
      'Replacing the audio restarts the queue.',
    ],
  },
]

/** 聚焦某个字段时右栏换成这个字段的提示。 */
const FIELD_HELP: Record<string, string[]> = {
  authorName: [
    'Shown on the book page and in search results.',
    'Use the name readers already know you by.',
  ],
  penName: [
    'Replaces your display name everywhere readers look.',
    'Your legal name stays on the payout account.',
  ],
  bio: [
    'The first sentence shows in search before readers expand it.',
    'Lead with what you write, not where you studied.',
  ],
  title: [
    'Matched against reader searches exactly as typed.',
    'Leave series and volume out — they have their own fields.',
  ],
  blurb: [
    'Readers see the first two lines before a "more" link.',
    'The hook has to land early.',
  ],
  language: [
    'The language of the audio, not of this form.',
    'Decides which regional stores list the book.',
  ],
  releaseDate: [
    'Review takes up to five business days, so leave room.',
    'Pre-orders open as soon as the book clears review.',
  ],
  price: [
    'Set before local tax and store adjustments.',
    'Some territories will show a slightly different number.',
  ],
  stripe: [
    'Payouts run monthly, about 60 days after the month of sale.',
    'You can link the account after submitting.',
  ],
  confirm: [
    'Confirming locks the audio for review.',
    'Metadata stays editable; new audio restarts the queue.',
  ],
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
]

const CATEGORIES = [
  { value: 'mystery', label: 'Mystery & Thriller' },
  { value: 'literary', label: 'Literary Fiction' },
  { value: 'scifi', label: 'Science Fiction' },
  { value: 'romance', label: 'Romance' },
  { value: 'history', label: 'History' },
  { value: 'biography', label: 'Biography & Memoir' },
  { value: 'business', label: 'Business' },
  { value: 'selfhelp', label: 'Self-help' },
]

const TERRITORIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'European Union' },
  { value: 'au', label: 'Australia & New Zealand' },
  { value: 'jp', label: 'Japan' },
]

const CURRENCIES = [
  { value: 'usd', label: 'USD — US Dollar' },
  { value: 'eur', label: 'EUR — Euro' },
  { value: 'gbp', label: 'GBP — British Pound' },
]

const AGREEMENTS = [
  { value: 'distribution', label: 'Distribution Agreement', description: 'Grants non-exclusive rights to distribute in the territories you selected.' },
  { value: 'content', label: 'Content Policy', description: 'Confirms the recording is yours to publish and meets the content guidelines.' },
  { value: 'tax', label: 'Tax certification (W-9 / W-8BEN)', description: 'Required before the first payout can be released.' },
]

const COVER_SRC = '/template-assets/illustrative-vertical-1.png'

const CHAPTERS = [
  { title: 'Prologue — The Last Train', duration: '11:04' },
  { title: '1. What Margot Knew', duration: '38:22' },
  { title: '2. The Second Letter', duration: '41:15' },
  { title: '3. Aldergate', duration: '35:48' },
  { title: '4. A Very Ordinary Tuesday', duration: '44:03' },
  { title: 'Epilogue', duration: '09:37' },
]

const TOTAL_RUNTIME = '3 h 20 m'
const MIN_DESCRIPTION = 120
const MAX_CATEGORIES = 3
const MEASURE = 640
const PANEL_WIDTH = 300

function usd(n: number) {
  return `$${n.toFixed(2)}`
}

// ── 状态 ──────────────────────────────────────────────────────────────────────

const hasGuidance = useMediaQuery('(min-width: 1320px)')
const hasRail = useMediaQuery('(min-width: 1000px)')
const isNarrow = computed(() => !hasRail.value)

const step = ref(1)
/** 用户尝试离开过的步骤；没进过集合的步骤不会提前标红。 */
const attempted = ref<ReadonlySet<number>>(new Set([0]))

const authorName = ref('Imogen Hale')
const penName = ref('')
const bio = ref('Imogen Hale writes quiet thrillers about people who notice too much. She lives in Bristol with a badly behaved lurcher.')
const authorSite = ref('imogenhale.co.uk')

const title = ref('Words She Never Said')
const subtitle = ref('')
const edition = ref('')
const series = ref('The Aldergate Files')
const seriesNumber = ref<number>(2)
const hasCover = ref(true)
const coverFile = ref<File | File[] | null>(null)
const blurb = ref('When a retired stenographer starts receiving transcripts of conversations she never had, the only person who believes her is the detective who put her husband away.')
const language = ref('en')
const categories = ref<string[]>(['mystery', 'literary'])

const scope = ref('worldwide')
const territories = ref<string[]>(['us', 'uk', 'eu'])
const releaseDate = ref<Date | null>(new Date('2026-10-06'))
const price = ref(18.99)
const salesModel = ref('both')
const isExplicit = ref(false)
const allowsLending = ref(true)

const isStripeLinked = ref(false)
const currency = ref('usd')
const accepted = ref<string[]>([])

const isConfirmed = ref(false)

const helpKey = ref<string | null>(null)

const errorsByStep = computed<Array<Record<string, string>>>(() => {
  const profile: Record<string, string> = {}
  if (!authorName.value.trim())
    profile.authorName = 'Enter the name readers should see.'
  if (bio.value.trim().length < 40)
    profile.bio = 'Write at least a sentence or two — 40 characters minimum.'

  const details: Record<string, string> = {}
  if (!title.value.trim())
    details.title = 'Enter the title as it should appear in the store.'
  if (!hasCover.value && coverFile.value == null)
    details.cover = 'A book cannot go on sale without cover art.'
  if (blurb.value.trim().length < MIN_DESCRIPTION)
    details.blurb = `Descriptions need at least ${MIN_DESCRIPTION} characters. ${MIN_DESCRIPTION - blurb.value.trim().length} to go.`
  if (categories.value.length === 0)
    details.categories = 'Pick at least one category.'
  else if (categories.value.length > MAX_CATEGORIES)
    details.categories = `Pick at most ${MAX_CATEGORIES} categories.`
  if (series.value.trim() && seriesNumber.value < 1)
    details.seriesNumber = 'Books in a series are numbered from 1.'

  const distribution: Record<string, string> = {}
  if (scope.value === 'selected' && territories.value.length === 0)
    distribution.territories = 'Choose at least one territory.'
  if (!releaseDate.value)
    distribution.releaseDate = 'Pick a release date.'
  if (price.value < 0.99 || price.value > 99)
    distribution.price = 'List price must be between $0.99 and $99.00.'

  const payouts: Record<string, string> = {}
  if (!isStripeLinked.value)
    payouts.stripe = 'Link a Stripe account to receive payouts.'
  const missing = AGREEMENTS.filter(a => !accepted.value.includes(a.value))
  if (missing.length > 0)
    payouts.agreements = `Accept the ${missing.map(a => a.label).join(', ')} to continue.`

  const finalize: Record<string, string> = {}
  if (!isConfirmed.value)
    finalize.confirm = 'Confirm the audio is final before submitting.'

  return [profile, details, distribution, payouts, finalize]
})

function shownErrors(index: number): Record<string, string> {
  return attempted.value.has(index) ? errorsByStep.value[index] : {}
}

const currentErrors = computed(() => shownErrors(step.value))
const isLastStep = computed(() => step.value === STEPS.length - 1)

const helpTips = computed(() => (helpKey.value && FIELD_HELP[helpKey.value]) || STEPS[step.value].help)

const releaseDateLabel = computed(() =>
  releaseDate.value ? releaseDate.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
)

function markAttempted(index: number) {
  attempted.value = new Set(attempted.value).add(index)
}

function goNext() {
  markAttempted(step.value)
  if (Object.keys(errorsByStep.value[step.value]).length === 0 && !isLastStep.value)
    step.value += 1
}

function goTo(index: number) {
  if (index > step.value)
    markAttempted(step.value)
  step.value = index
}

function setCover(file: File | File[] | null) {
  coverFile.value = file
  if (file != null)
    hasCover.value = true
}
</script>

<template>
  <Layout height="fill" :padding="4">
    <template #header>
      <LayoutHeader has-divider>
        <VStack :gap="4">
          <HStack :gap="3" align="center">
            <StackItem size="fill">
              <Text type="label">
                Publish audiobook
              </Text>
            </StackItem>
            <Button label="Cancel" variant="ghost" />
            <Button label="Save & exit" variant="secondary" />
          </HStack>
          <Stepper
            v-if="!hasRail"
            :active-step="step"
            orientation="horizontal"
            label="Publishing progress"
            @step-click="goTo"
          >
            <Step
              v-for="(s, i) in STEPS"
              :key="s.label"
              :step="i"
              :label="s.label"
              :status="Object.keys(shownErrors(i)).length ? 'error' : undefined"
              :indicator="Object.keys(shownErrors(i)).length ? 'none' : 'number'"
            />
          </Stepper>
        </VStack>
      </LayoutHeader>
    </template>

    <template v-if="hasRail" #start>
      <LayoutPanel :width="PANEL_WIDTH">
        <Stepper
          :active-step="step"
          orientation="vertical"
          label="Publishing progress"
          @step-click="goTo"
        >
          <Step
            v-for="(s, i) in STEPS"
            :key="s.label"
            :step="i"
            :label="s.label"
            :description="s.description"
            :status="Object.keys(shownErrors(i)).length ? 'error' : undefined"
            indicator="number"
          />
        </Stepper>
      </LayoutPanel>
    </template>

    <template v-if="hasGuidance" #end>
      <LayoutPanel :width="PANEL_WIDTH" role="complementary" label="Field guidance">
        <VStack :gap="3">
          <Heading :level="5" :accessibility-level="2">
            Helpful tips
          </Heading>
          <List list-style="disc" density="compact">
            <ListItem v-for="tip in helpTips" :key="tip">
              <template #label>
                <Text type="body" color="secondary">
                  {{ tip }}
                </Text>
              </template>
            </ListItem>
          </List>
        </VStack>
      </LayoutPanel>
    </template>

    <LayoutContent>
      <Center axis="horizontal">
        <VStack :gap="6" width="100%" :max-width="MEASURE">
          <VStack :gap="1">
            <Heading :level="1">
              {{ STEPS[step].label }}
            </Heading>
            <Text type="body" color="secondary">
              {{ STEPS[step].description }}
            </Text>
            <Text type="supporting" color="secondary">
              Fields marked required must be filled before you can continue.
            </Text>
          </VStack>

          <FormLayout v-if="step === 0" default-optionality="optional">
            <TextInput
              v-model="authorName"
              label="Display name"
              is-required
              description="The name shown on the book page and in search results."
              :status="currentErrors.authorName ? { type: 'error', message: currentErrors.authorName } : undefined"
              @focusin="helpKey = 'authorName'"
            />
            <TextInput
              v-model="penName"
              label="Pen name"
              placeholder="Used instead of your display name on this book"
              @focusin="helpKey = 'penName'"
            />
            <TextArea
              v-model="bio"
              label="Author bio"
              is-required
              :rows="4"
              :max-length="600"
              description="Shown on your author page. Two or three sentences is plenty."
              :status="currentErrors.bio ? { type: 'error', message: currentErrors.bio } : undefined"
              @focusin="helpKey = 'bio'"
            />
            <TextInput
              v-model="authorSite"
              label="Website"
              placeholder="example.com"
            />
          </FormLayout>

          <FormLayout v-else-if="step === 1" default-optionality="optional">
            <TextInput
              v-model="title"
              label="Book title"
              is-required
              description="Enter the title exactly as it should appear in the store."
              :status="currentErrors.title ? { type: 'error', message: currentErrors.title } : undefined"
              @focusin="helpKey = 'title'"
            />

            <Field
              label="Cover image"
              input-id="cover-image"
              is-group-label
              is-required
              description="1200 × 1800 px or larger, JPG or PNG, under 5 MB."
              status-variant="detached"
              :status="currentErrors.cover ? { type: 'error', message: currentErrors.cover } : undefined"
            >
              <HStack :gap="4" align="start" wrap="wrap">
                <Card v-if="hasCover" :width="140" :padding="0">
                  <AspectRatio :ratio="2 / 3" fit="cover">
                    <img :src="COVER_SRC" :alt="`Current cover art for ${title.trim() || 'this book'}`">
                  </AspectRatio>
                </Card>
                <StackItem size="fill">
                  <VStack :gap="3">
                    <FileInput
                      :model-value="coverFile"
                      label="Cover image"
                      is-label-hidden
                      mode="dropzone"
                      accept="image/png,image/jpeg"
                      :max-size="5 * 1024 * 1024"
                      :placeholder="hasCover ? 'Drop a new cover, or click to browse' : 'Drop a cover here, or click to browse'"
                      @update:model-value="setCover($event)"
                    />
                    <HStack :gap="2" wrap="wrap">
                      <Button label="Crop image" variant="secondary" size="sm" :is-disabled="!hasCover" />
                      <Button label="Preview on device" variant="ghost" size="sm" :is-disabled="!hasCover" />
                      <Button
                        v-if="hasCover"
                        label="Remove cover"
                        variant="ghost"
                        size="sm"
                        @click="hasCover = false; coverFile = null"
                      />
                    </HStack>
                  </VStack>
                </StackItem>
              </HStack>
            </Field>

            <TextInput
              v-model="subtitle"
              label="Subtitle"
              description="A short line that complements the title."
            />
            <FormLayout :direction="isNarrow ? 'vertical' : 'horizontal'" default-optionality="optional">
              <TextInput v-model="edition" label="Edition" placeholder="Second edition" />
              <Selector
                v-model="language"
                label="Language"
                :options="LANGUAGES"
                @focusin="helpKey = 'language'"
              />
            </FormLayout>
            <FormLayout :direction="isNarrow ? 'vertical' : 'horizontal'" default-optionality="optional">
              <TextInput
                v-model="series"
                label="Series"
                description="We create the series if it does not exist yet."
              />
              <NumberInput
                v-model="seriesNumber"
                label="Number in series"
                :min="1"
                :max="99"
                is-integer-only
                :is-disabled="!series.trim()"
                description="Where this book falls in the reading order."
                disabled-message="Name a series first."
                :status="currentErrors.seriesNumber ? { type: 'error', message: currentErrors.seriesNumber } : undefined"
              />
            </FormLayout>
            <TextArea
              v-model="blurb"
              label="Description"
              is-required
              :rows="5"
              :max-length="2000"
              description="The blurb readers see. Lead with the hook, not the genre."
              :status="currentErrors.blurb ? { type: 'error', message: currentErrors.blurb } : undefined"
              @focusin="helpKey = 'blurb'"
            />
            <MultiSelector
              v-model="categories"
              label="Categories"
              required
              :options="CATEGORIES"
              searchable
              trigger-display="badges"
              :description="`Choose up to ${MAX_CATEGORIES}. The first one decides which charts the book appears in.`"
              :status="currentErrors.categories ? 'error' : undefined"
              :status-message="currentErrors.categories"
            />
          </FormLayout>

          <FormLayout v-else-if="step === 2" default-optionality="optional">
            <RadioList v-model="scope" label="Where the book is sold">
              <RadioListItem value="worldwide" label="Worldwide" description="Available everywhere the store operates." />
              <RadioListItem value="selected" label="Selected territories" description="Useful when print or audio rights are already licensed elsewhere." />
              <RadioListItem value="exclusive" label="Exclusive to this store" description="Higher revenue share, but the book cannot be sold elsewhere for 12 months." />
            </RadioList>
            <MultiSelector
              v-if="scope === 'selected'"
              v-model="territories"
              label="Territories"
              :options="TERRITORIES"
              select-all
              trigger-display="badges"
              :status="currentErrors.territories ? 'error' : undefined"
              :status-message="currentErrors.territories"
            />
            <FormLayout :direction="isNarrow ? 'vertical' : 'horizontal'" default-optionality="optional">
              <DateInput
                v-model="releaseDate"
                label="Release date"
                is-required
                :min="new Date('2026-09-01')"
                description="Review takes up to 5 business days."
                :status="currentErrors.releaseDate ? { type: 'error', message: currentErrors.releaseDate } : undefined"
                @focusin="helpKey = 'releaseDate'"
              />
              <NumberInput
                v-model="price"
                label="List price"
                :min="0.99"
                :max="99"
                :step="1"
                description="Before local tax and store adjustments."
                :status="currentErrors.price ? { type: 'error', message: currentErrors.price } : undefined"
                @focusin="helpKey = 'price'"
              />
            </FormLayout>
            <Field
              label="Sales model"
              input-id="sales-model"
              is-group-label
              :description="salesModel === 'purchase'
                ? 'Readers buy the book outright at your list price.'
                : salesModel === 'subscription'
                  ? 'Included in the subscription catalog; you earn per minute listened.'
                  : 'Available to buy and included in the subscription catalog.'"
            >
              <SegmentedControl v-model="salesModel" label="Sales model" layout="fill">
                <SegmentedControlItem value="purchase" label="Purchase" />
                <SegmentedControlItem value="subscription" label="Subscription" />
                <SegmentedControlItem value="both" label="Both" />
              </SegmentedControl>
            </Field>
            <Divider />
            <Switch
              v-model="isExplicit"
              label="Contains explicit content"
              description="Adds an advisory label and excludes the book from all-ages recommendations."
              label-position="start"
              label-spacing="spread"
            />
            <Switch
              v-model="allowsLending"
              label="Allow library lending"
              description="Libraries can license the audiobook for time-limited loans."
              label-position="start"
              label-spacing="spread"
            />
          </FormLayout>

          <FormLayout v-else-if="step === 3" default-optionality="optional">
            <Card :padding="4">
              <HStack :gap="3" align="center" wrap="wrap">
                <StackItem size="fill">
                  <VStack :gap="1">
                    <HStack :gap="2" align="center">
                      <Text type="label">
                        Stripe account
                      </Text>
                      <StatusDot
                        :variant="isStripeLinked ? 'success' : 'warning'"
                        :label="isStripeLinked ? 'Linked' : 'Not linked'"
                      />
                    </HStack>
                    <Text type="supporting" color="secondary">
                      {{ isStripeLinked
                        ? 'Payouts go to Imogen Hale · **** 4417, on the 15th of each month.'
                        : 'Royalties are held until an account is linked. Linking takes about two minutes.' }}
                    </Text>
                  </VStack>
                </StackItem>
                <Button
                  :label="isStripeLinked ? 'Manage' : 'Connect Stripe'"
                  :variant="isStripeLinked ? 'secondary' : 'primary'"
                  @click="isStripeLinked = !isStripeLinked"
                />
              </HStack>
            </Card>
            <FieldStatus
              v-if="currentErrors.stripe"
              type="error"
              variant="detached"
              :message="currentErrors.stripe"
            />
            <Selector
              v-model="currency"
              label="Payout currency"
              :options="CURRENCIES"
              description="Conversion happens at the rate on the payout date."
            />
            <Divider />
            <CheckboxList
              v-model="accepted"
              label="Agreements"
              description="All three are required before a book can be submitted."
              :status="currentErrors.agreements ? 'error' : undefined"
              :status-message="currentErrors.agreements"
            >
              <CheckboxListItem
                v-for="a in AGREEMENTS"
                :key="a.value"
                :value="a.value"
                :label="a.label"
                :description="a.description"
              />
            </CheckboxList>
          </FormLayout>

          <VStack v-else :gap="5">
            <Banner
              status="info"
              title="Review takes up to 5 business days"
              description="You can keep editing metadata while the book is in review. Replacing the audio restarts it."
            />

            <VStack :gap="3">
              <HStack :gap="3" align="center" justify="between">
                <Text type="label">
                  Audio processing
                </Text>
                <Text type="supporting" color="secondary">
                  {{ CHAPTERS.length }} chapters · {{ TOTAL_RUNTIME }}
                </Text>
              </HStack>
              <ProgressBar
                label="Audio processing"
                is-label-hidden
                :value="100"
                variant="success"
                has-value-label
              />
              <Divider />
              <VStack :gap="2">
                <HStack v-for="chapter in CHAPTERS" :key="chapter.title" :gap="3" align="center" justify="between">
                  <Text type="body">
                    {{ chapter.title }}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {{ chapter.duration }}
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            <Divider />

            <MetadataList columns="multi">
              <MetadataListItem label="Title">
                {{ title.trim() || '—' }}
              </MetadataListItem>
              <MetadataListItem label="Author">
                {{ penName.trim() || authorName.trim() || '—' }}
              </MetadataListItem>
              <MetadataListItem label="Series">
                {{ series.trim() ? `${series.trim()}, book ${seriesNumber}` : 'Standalone' }}
              </MetadataListItem>
              <MetadataListItem label="Language">
                {{ LANGUAGES.find(l => l.value === language)?.label ?? language }}
              </MetadataListItem>
              <MetadataListItem label="Categories">
                {{ categories.length === 0
                  ? '—'
                  : CATEGORIES.filter(c => categories.includes(c.value)).map(c => c.label).join(', ') }}
              </MetadataListItem>
              <MetadataListItem label="Availability">
                {{ scope === 'worldwide'
                  ? 'Worldwide'
                  : scope === 'exclusive'
                    ? 'Exclusive, 12 months'
                    : `${territories.length} territories` }}
              </MetadataListItem>
              <MetadataListItem label="Release date">
                {{ releaseDateLabel }}
              </MetadataListItem>
              <MetadataListItem label="List price">
                {{ usd(price) }} {{ CURRENCIES.find(c => c.value === currency)?.label.split(' — ')[0].toLowerCase() ?? '' }}
              </MetadataListItem>
              <MetadataListItem label="Advisory">
                {{ isExplicit ? 'Explicit content' : 'None' }}
              </MetadataListItem>
              <MetadataListItem label="Library lending">
                {{ allowsLending ? 'Allowed' : 'Not allowed' }}
              </MetadataListItem>
            </MetadataList>

            <Divider />

            <CheckboxInput
              v-model="isConfirmed"
              label="This is the final audio. I understand replacing it restarts review."
              :status="currentErrors.confirm ? { type: 'error', message: currentErrors.confirm } : undefined"
            />
          </VStack>
        </VStack>
      </Center>
    </LayoutContent>

    <template #footer>
      <LayoutFooter has-divider>
        <Center axis="horizontal" :style="hasRail && !hasGuidance ? { marginInlineStart: `${PANEL_WIDTH - 16}px` } : undefined">
          <HStack :gap="3" align="center" width="100%" :max-width="MEASURE">
            <Button
              label="Back"
              variant="secondary"
              :is-disabled="step === 0"
              @click="step = Math.max(0, step - 1)"
            />
            <StackItem size="fill" />
            <Button
              :label="isLastStep ? 'Submit for review' : 'Continue'"
              variant="primary"
              @click="goNext"
            />
          </HStack>
        </Center>
      </LayoutFooter>
    </template>
  </Layout>
</template>
