<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Card,
  FormLayout,
  Grid,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  Selector,
  StackItem,
  Step,
  Stepper,
  Text,
  TextArea,
  TextInput,
  VStack,
} from '@astryx-vue/core'

const STEPS = [
  { label: 'Project', description: 'Name and type' },
  { label: 'Scope', description: 'Timeline and budget' },
  { label: 'Review', description: 'Confirm details' },
]

const step = ref(0)
const projectName = ref('')
const projectType = ref('web')
const budget = ref('')
const timeline = ref('')
const summary = ref('')

const isLast = computed(() => step.value === STEPS.length - 1)

const TYPES = [
  { value: 'web', label: 'Web application' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'brand', label: 'Brand campaign' },
]

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
        <Grid :columns="{ minWidth: 280, max: 2 }" :gap="8">
          <Card :padding="6">
            <Stepper :active-step="step" orientation="vertical" label="Project intake">
              <Step
                v-for="(s, i) in STEPS"
                :key="s.label"
                :step="i"
                :label="s.label"
                :description="s.description"
              />
            </Stepper>
          </Card>
          <Card :padding="6">
            <VStack :gap="6">
              <Heading :level="2">
                {{ STEPS[step].label }}
              </Heading>
              <FormLayout v-if="step === 0" default-optionality="optional">
                <TextInput v-model="projectName" label="Project name" is-required />
                <Selector v-model="projectType" label="Project type" :options="TYPES" />
              </FormLayout>
              <FormLayout v-else-if="step === 1" default-optionality="optional">
                <TextInput v-model="budget" label="Budget range" placeholder="$50k – $100k" />
                <TextInput v-model="timeline" label="Target launch" placeholder="Q3 2026" />
                <TextArea v-model="summary" label="Goals" :rows="4" />
              </FormLayout>
              <VStack v-else :gap="2">
                <Text type="body" weight="semibold">
                  {{ projectName || 'Untitled' }}
                </Text>
                <Text type="supporting" color="secondary">
                  {{ TYPES.find(t => t.value === projectType)?.label }} · {{ budget || 'Budget TBD' }} · {{ timeline || 'Timeline TBD' }}
                </Text>
                <Text type="body">
                  {{ summary }}
                </Text>
              </VStack>
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
          <Button :label="isLast ? 'Submit brief' : 'Continue'" variant="primary" @click="next" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
