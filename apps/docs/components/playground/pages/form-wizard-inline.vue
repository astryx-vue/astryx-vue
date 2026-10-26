<script setup lang="ts">
import {
  Banner,
  Button,
  Card,
  CheckboxList,
  CheckboxListItem,
  FieldStatus,
  FormLayout,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  MetadataList,
  MetadataListItem,
  RadioList,
  RadioListItem,
  Selector,
  Spinner,
  StackItem,
  Step,
  Stepper,
  Switch,
  Text,
  useToast,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import { computed, reactive, ref, watchEffect } from 'vue'

// ── 数据 ──────────────────────────────────────────────────────────────────────

const REPOS = [
  { id: 'web', name: 'northwind/web', branch: 'main', packageManager: 'pnpm 11', lockfile: 'pnpm-lock.yaml', testRunner: 'Vitest', testCount: 1284, description: 'Marketing site and the signed-in dashboard.' },
  { id: 'api', name: 'northwind/api', branch: 'main', packageManager: 'npm 10', lockfile: 'package-lock.json', testRunner: 'Jest', testCount: 862, description: 'GraphQL gateway and the billing workers.' },
  { id: 'design', name: 'northwind/design-system', branch: 'trunk', packageManager: 'pnpm 11', lockfile: 'pnpm-lock.yaml', testRunner: 'Vitest', testCount: 431, description: 'Component library published to the internal registry.' },
]

const TRIGGERS = [
  { id: 'pr', label: 'Pull requests', description: 'Every push to a branch with an open pull request.' },
  { id: 'push', label: 'Pushes to the default branch', description: 'Direct commits and merges, after the fact.' },
  { id: 'tag', label: 'Release tags', description: 'Tags matching v*, so a release is verified before it ships.' },
]

const JOBS = [
  { id: 'lint', label: 'Lint', description: 'ESLint and Prettier over the changed files. Needs 1 GB.', memoryGB: 1, seconds: 74 },
  { id: 'unit', label: 'Unit tests', description: 'The full suite, sharded across the available cores. Needs 2 GB.', memoryGB: 2, seconds: 203 },
  { id: 'build', label: 'Production build', description: 'The build that would ship, with bundle size reported. Needs 2 GB.', memoryGB: 2, seconds: 126 },
  { id: 'e2e', label: 'End-to-end tests', description: 'Playwright against a preview deployment. Needs 4 GB.', memoryGB: 4, seconds: 391 },
]

const RUNNERS = [
  { id: 'small', label: 'Small', memoryGB: 2, cores: 2, rate: '$0.008' },
  { id: 'medium', label: 'Medium', memoryGB: 4, cores: 4, rate: '$0.016' },
  { id: 'large', label: 'Large', memoryGB: 8, cores: 8, rate: '$0.032' },
]

const NODE_VERSIONS = [
  { value: '22', label: 'Node 22 · Active LTS' },
  { value: '20', label: 'Node 20 · Maintenance' },
  { value: '24', label: 'Node 24 · Current' },
]

const STEP_META = [
  { kind: 'human', label: 'Repository' },
  { kind: 'human', label: 'Pipeline' },
  { kind: 'auto', label: 'Connect' },
  { kind: 'auto', label: 'Inspect the project' },
  { kind: 'auto', label: 'Trial run' },
  { kind: 'human', label: 'Review and enable' },
] as const

const AUTO_STEPS = [2, 3, 4]
const TICK_MS = 800
const SETTLE_MS = 560

type AutoStatus = 'idle' | 'passed' | 'failed'
interface AutoState {
  status: AutoStatus
  done: number
}

/** "3m 12s"：试跑的耗时由跑过的任务相加。 */
function duration(seconds: number) {
  return seconds < 60
    ? `${seconds}s`
    : `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`
}

// ── 状态 ──────────────────────────────────────────────────────────────────────

const showToast = useToast()

const active = ref(0)
const auto = reactive<Record<number, AutoState>>({
  2: { status: 'idle', done: 0 },
  3: { status: 'idle', done: 0 },
  4: { status: 'idle', done: 0 },
})

const repoId = ref('web')
const triggers = ref<string[]>(['pr'])
const jobs = ref<string[]>(['lint', 'unit', 'build'])
const runnerId = ref('small')
const nodeVersion = ref('22')
const strictBranches = ref(true)

const repo = computed(() => REPOS.find(r => r.id === repoId.value) ?? REPOS[0])
const runner = computed(() => RUNNERS.find(r => r.id === runnerId.value) ?? RUNNERS[0])
const selectedTriggers = computed(() => TRIGGERS.filter(t => triggers.value.includes(t.id)))
const selectedJobs = computed(() => JOBS.filter(j => jobs.value.includes(j.id)))
const isDone = computed(() => active.value >= STEP_META.length)

/** 试跑唯一会出问题的地方：任务要的内存比 runner 多。 */
const starvedJob = computed(() => selectedJobs.value.find(j => j.memoryGB > runner.value.memoryGB))

const trialSeconds = computed(() => 38 + selectedJobs.value.reduce((total, job) => total + job.seconds, 0))

const triggerSummary = computed(() =>
  selectedTriggers.value.length === 0
    ? 'nothing yet'
    : selectedTriggers.value
        .map(t => t.label.toLowerCase())
        .join(' and ')
        .replace('pushes to the default branch', `pushes to ${repo.value.branch}`),
)

/** 每个自动步骤实际做的一串检查，展开时逐条打勾。 */
const checksFor = computed<Record<number, Array<{ id: string, label: string }>>>(() => ({
  2: [
    { id: 'auth', label: 'Authenticating as the Northwind CI app' },
    { id: 'perms', label: `Confirming write access to ${repo.value.name}` },
    { id: 'hook', label: `Registering a webhook for ${triggerSummary.value}` },
  ],
  3: [
    { id: 'manifest', label: 'Reading package.json' },
    { id: 'pm', label: 'Detecting the package manager' },
    { id: 'runner', label: 'Locating the test runner' },
    { id: 'cache', label: `Hashing ${repo.value.lockfile} for the cache key` },
  ],
  4: [
    { id: 'provision', label: `Provisioning the ${runner.value.label.toLowerCase()} runner` },
    { id: 'install', label: 'Restoring the cache and installing' },
    ...selectedJobs.value.map(job => ({ id: job.id, label: `Running ${job.label.toLowerCase()}` })),
  ],
}))

/** 自动推进：一次只挂一个定时器，要么勾一条检查，要么结算这一步再交给下一步。 */
watchEffect((onCleanup) => {
  const index = active.value
  if (!AUTO_STEPS.includes(index))
    return

  const state = auto[index]
  if (state.status !== 'idle')
    return

  const checks = checksFor.value[index]

  if (state.done >= checks.length) {
    const timer = setTimeout(() => {
      auto[index] = { ...auto[index], status: 'passed' }
      active.value += 1
    }, SETTLE_MS)
    onCleanup(() => clearTimeout(timer))
    return
  }

  const starved = starvedJob.value
  const failingIndex = starved == null ? -1 : checks.findIndex(check => check.id === starved.id)

  const timer = setTimeout(() => {
    auto[index] = state.done === failingIndex
      ? { ...auto[index], status: 'failed' }
      : { ...auto[index], done: state.done + 1 }
  }, TICK_MS)
  onCleanup(() => clearTimeout(timer))
})

/** 倒退或重进步骤时，从这一步起的自动结果全部作废：它们算的是旧输入。 */
function goToStep(index: number) {
  active.value = index
  for (const step of AUTO_STEPS) {
    if (step >= index)
      auto[step] = { status: 'idle', done: 0 }
  }
}

/** 折叠的步骤显示各自结算的结果，读的是展开时写入的同一份状态。 */
function summaryFor(index: number): string | undefined {
  if (index >= active.value)
    return undefined
  switch (index) {
    case 0:
      return `${repo.value.name} · ${triggerSummary.value}`
    case 1:
      return `${selectedJobs.value.length} ${selectedJobs.value.length === 1 ? 'job' : 'jobs'} · ${runner.value.label.toLowerCase()} runner, ${runner.value.memoryGB} GB · Node ${nodeVersion.value}`
    case 2:
      return 'Connected · webhook #4471 · write access confirmed'
    case 3:
      return `${repo.value.packageManager} · ${repo.value.testRunner} · ${repo.value.testCount.toLocaleString()} tests found`
    case 4:
      return `${selectedJobs.value.length} ${selectedJobs.value.length === 1 ? 'job' : 'jobs'} passed in ${duration(trialSeconds.value)}`
    case 5:
      return `Enabled · ${selectedJobs.value.length} ${selectedJobs.value.length === 1 ? 'job' : 'jobs'} gate every merge`
    default:
      return undefined
  }
}

/** 两个人工步骤共用一套规则；Step 的颜色、确认行、字段提示都读它。 */
const errorsByStep = computed<Array<Record<string, string>>>(() => {
  const repository: Record<string, string> = {}
  if (triggers.value.length === 0)
    repository.triggers = 'Pick at least one event, or nothing would ever start a run.'

  const pipeline: Record<string, string> = {}
  if (jobs.value.length === 0)
    pipeline.jobs = 'Pick at least one job for the pipeline to run.'

  return [repository, pipeline, {}, {}, {}, {}]
})

const currentErrors = computed<Record<string, string>>(() =>
  isDone.value ? {} : errorsByStep.value[active.value],
)

function isStepBroken(index: number) {
  return Object.keys(errorsByStep.value[index]).length > 0
}

function confirmStep() {
  if (Object.keys(currentErrors.value).length !== 0)
    return
  if (active.value === STEP_META.length - 1) {
    showToast({ body: 'Continuous integration is on', uniqueID: 'ci-enabled' })
  }
  active.value += 1
}

const hasFailure = computed(() => AUTO_STEPS.some(step => auto[step].status === 'failed'))

/** 把进度和自动结果合并成一个状态。 */
function phaseOf(index: number): 'passed' | 'pending' | 'failed' | 'running' {
  if (STEP_META[index].kind === 'human')
    return index < active.value ? 'passed' : 'pending'
  if (auto[index].status === 'failed')
    return 'failed'
  if (auto[index].status === 'passed')
    return 'passed'
  return index === active.value ? 'running' : 'pending'
}

function errorCountLabel() {
  const count = Object.keys(currentErrors.value).length
  return count === 1 ? 'One problem above needs fixing first.' : `${count} problems above need fixing first.`
}
</script>

<template>
  <Layout height="fill" :content-width="800" :padding="5">
    <template #header>
      <LayoutHeader :has-divider="false">
        <HStack :gap="3" align="center">
          <StackItem size="fill">
            <VStack :gap="0.5">
              <Heading :level="1">
                Set up continuous integration
              </Heading>
              <Text type="supporting" color="secondary">
                Answer the first two steps and the rest check themselves.
              </Text>
            </VStack>
          </StackItem>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent>
      <VStack :gap="6">
        <VisuallyHidden as="div" aria-live="polite">
          {{ isDone
            ? 'All checks passed. Ready to review and enable.'
            : STEP_META[active].kind === 'auto'
              ? `${STEP_META[active].label}: ${phaseOf(active) === 'failed' ? 'failed' : 'running'}`
              : '' }}
        </VisuallyHidden>

        <Stepper
          :active-step="active"
          class="ci-wizard"
          orientation="vertical"
          density="compact"
          label="Continuous integration setup progress"
          @step-click="goToStep"
        >
          <Step
            v-for="(meta, index) in STEP_META"
            :key="meta.label"
            :step="index"
            :label="meta.label"
            :is-disabled="index > active"
            :status="phaseOf(index) === 'failed' || isStepBroken(index) ? 'error' : phaseOf(index) === 'passed' ? 'success' : undefined"
          >
            <template v-if="phaseOf(index) === 'running' || phaseOf(index) === 'failed'" #icon>
              <Spinner v-if="phaseOf(index) === 'running'" size="sm" shade="inherit" />
              <Icon v-else icon="error" size="sm" />
            </template>
            <template v-if="summaryFor(index)" #end>
              <StackItem size="fill">
                <HStack :gap="3" align="center" justify="end">
                  <StackItem size="fill">
                    <Text
                      type="supporting"
                      color="secondary"
                      justify="end"
                      :max-lines="1"
                    >
                      {{ summaryFor(index) }}
                    </Text>
                  </StackItem>
                  <Text
                    type="supporting"
                    color="accent"
                    weight="medium"
                    text-wrap="nowrap"
                  >
                    {{ meta.kind === 'auto' ? 'Run again' : 'Edit' }}
                  </Text>
                </HStack>
              </StackItem>
            </template>

            <VStack v-if="index === active" :padding-block-end="2">
              <FormLayout v-if="index === 0" default-optionality="optional">
                <Selector
                  v-model="repoId"
                  label="Repository"
                  :options="REPOS.map(r => ({ value: r.id, label: r.name }))"
                  :description="`${repo.description} Default branch is ${repo.branch}.`"
                />
                <CheckboxList
                  v-model="triggers"
                  label="Run the pipeline on"
                  description="Every event you pick costs build minutes, so start with the one that gates a merge."
                  density="compact"
                  :status="currentErrors.triggers ? { type: 'error', message: currentErrors.triggers } : undefined"
                >
                  <CheckboxListItem
                    v-for="t in TRIGGERS"
                    :key="t.id"
                    :value="t.id"
                    :label="t.label"
                    :description="t.description"
                  />
                </CheckboxList>
                <HStack :gap="2" align="center" wrap="wrap">
                  <Button label="Continue" variant="primary" @click="confirmStep" />
                  <FieldStatus
                    v-if="Object.keys(currentErrors).length"
                    type="error"
                    variant="detached"
                    :message="errorCountLabel()"
                  />
                </HStack>
              </FormLayout>

              <FormLayout v-else-if="index === 1" default-optionality="optional">
                <CheckboxList
                  v-model="jobs"
                  label="Jobs"
                  description="They run in parallel on one machine, so the largest appetite sets the size you need."
                  density="compact"
                  :status="currentErrors.jobs ? { type: 'error', message: currentErrors.jobs } : undefined"
                >
                  <CheckboxListItem
                    v-for="job in JOBS"
                    :key="job.id"
                    :value="job.id"
                    :label="job.label"
                    :description="job.description"
                  />
                </CheckboxList>
                <RadioList
                  v-model="runnerId"
                  label="Runner"
                  description="Charged per minute while a job is running."
                >
                  <RadioListItem
                    v-for="r in RUNNERS"
                    :key="r.id"
                    :value="r.id"
                    :label="`${r.label} · ${r.memoryGB} GB`"
                    :description="`${r.cores} cores, ${r.rate} per minute.`"
                  />
                </RadioList>
                <Selector
                  v-model="nodeVersion"
                  label="Node version"
                  :options="NODE_VERSIONS"
                  description="Used for every job unless a job overrides it."
                />
                <HStack :gap="2" align="center" wrap="wrap">
                  <Button label="Start checks" variant="primary" @click="confirmStep" />
                  <Button label="Back" variant="ghost" @click="goToStep(index - 1)" />
                  <FieldStatus
                    v-if="Object.keys(currentErrors).length"
                    type="error"
                    variant="detached"
                    :message="errorCountLabel()"
                  />
                </HStack>
              </FormLayout>

              <FormLayout v-else-if="index === 5" default-optionality="optional">
                <Card variant="muted" :padding="4">
                  <MetadataList orientation="vertical">
                    <MetadataListItem label="Repository">
                      {{ repo.name }}
                    </MetadataListItem>
                    <MetadataListItem label="Triggers">
                      {{ triggerSummary }}
                    </MetadataListItem>
                    <MetadataListItem label="Runner">
                      {{ `${runner.label}, ${runner.memoryGB} GB · Node ${nodeVersion}` }}
                    </MetadataListItem>
                    <MetadataListItem label="Toolchain">
                      {{ `${repo.packageManager} · ${repo.testRunner}, ${repo.testCount.toLocaleString()} tests` }}
                    </MetadataListItem>
                  </MetadataList>
                </Card>
                <Switch
                  v-model="strictBranches"
                  label="Require branches to be up to date before merging"
                  label-position="start"
                  label-spacing="spread"
                />
                <HStack :gap="2" align="center" wrap="wrap">
                  <Button label="Enable continuous integration" variant="primary" @click="confirmStep" />
                  <Button label="Back" variant="ghost" @click="goToStep(index - 1)" />
                </HStack>
              </FormLayout>

              <VStack v-if="meta.kind === 'auto'" :gap="4">
                <Stepper
                  :active-step="auto[index].done"
                  orientation="vertical"
                  density="compact"
                  indicator-position="on-track"
                  :label="`${meta.label} checks`"
                  :style="{ marginInlineStart: '-28px' }"
                >
                  <Step
                    v-for="(check, i) in checksFor[index]"
                    :key="check.id"
                    :step="i"
                    :label="check.label"
                    :status="i < auto[index].done ? 'success' : i === auto[index].done && auto[index].status === 'failed' ? 'error' : undefined"
                  >
                    <template v-if="i === auto[index].done" #icon>
                      <Icon v-if="auto[index].status === 'failed'" icon="error" size="sm" />
                      <Spinner v-else size="sm" shade="inherit" />
                    </template>
                  </Step>
                </Stepper>

                <Banner
                  v-if="auto[index].status === 'failed' && starvedJob"
                  status="error"
                  :title="`${starvedJob.label} ran out of memory`"
                  :description="`The job asked for ${starvedJob.memoryGB} GB and the ${runner.label.toLowerCase()} runner has ${runner.memoryGB} GB. Size the runner up, or drop the job from the pipeline.`"
                >
                  <Button
                    label="Back to the pipeline"
                    variant="secondary"
                    size="sm"
                    @click="goToStep(1)"
                  />
                </Banner>
              </VStack>
            </VStack>
          </Step>
        </Stepper>

        <Text v-if="hasFailure" type="supporting" color="secondary">
          Setup is paused at the failed step above. Fix what it found and the remaining checks will pick up from there.
        </Text>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style>
/* Step 的默认插槽被排在标签右侧的第三列；竖向流程里它应该落在标签下面同一列。 */
.ci-wizard .astryx-step[data-orientation='vertical'] {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
}

.ci-wizard .astryx-step[data-orientation='vertical'] > .astryx-step-content {
  grid-column: 2;
}
</style>
