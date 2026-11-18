<script setup lang="ts">
import {
  AspectRatio,
  Avatar,
  Badge,
  Button,
  Card,
  Collapsible,
  CollapsibleGroup,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Link,
  ProgressBar,
  RadioList,
  RadioListItem,
  SegmentedControl,
  SegmentedControlItem,
  Section,
  Slider,
  StackItem,
  Text,
  useToast,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

const COURSE = {
  title: 'Applied AI: Build with Language Models',
  level: 'Intermediate', language: 'English', rating: 4.8, ratingCount: 1284, learnerCount: '12,840',
  lessonCount: 13, runtime: '4h 07m', price: 89, compareAt: 129,
  about:
    'Most courses show you what a model can do. This one makes you build the three features every product team is asked for — retrieval that answers the right question, output you can hand to other code, and an evaluation harness that catches regressions before your users do. Every module ends in something that runs; the reviewed project is a working extraction pipeline you can adapt.',
  skills: ['Retrieval-augmented generation', 'Structured output', 'Evaluation harnesses', 'Prompt design', 'Vector search'],
}

const FACTS = [
  { icon: 'heroicons:clock', text: COURSE.runtime }, { icon: 'heroicons:book-open', text: `${COURSE.lessonCount} lessons` },
  { icon: 'heroicons:globe-alt', text: COURSE.language }, { icon: 'heroicons:bolt', text: 'Self-paced or cohort' },
]

const MODULES = [
  {
    id: 'foundations',
    title: 'Foundations and tooling',
    meta: '3 lessons · 48 min',
    lessons: [
      ['What a language model can and cannot promise', '12 min'],
      ['The working setup: SDK, keys, and a scratchpad', '18 min'],
      ['Tokens, temperature, and the cost dial', '18 min'],
    ],
  },
  {
    id: 'retrieval',
    title: 'Retrieval that answers the question',
    meta: '4 lessons · 76 min',
    lessons: [
      ['Chunking strategies that survive real documents', '21 min'],
      ['Vector search from first principles', '19 min'],
      ['Rerankers and the relevance ceiling', '18 min'],
      ['When the model should say it found nothing', '18 min'],
    ],
  },
  {
    id: 'output',
    title: 'Structured output you can hand to code',
    meta: '3 lessons · 64 min',
    lessons: [
      ['Schemas as contracts, not suggestions', '22 min'],
      ['Validation, repair, and retry loops', '21 min'],
      ['Streaming partial results into a UI', '21 min'],
    ],
  },
  {
    id: 'evaluation',
    title: 'The evaluation harness',
    meta: '3 lessons · 59 min',
    lessons: [
      ['Golden sets and where they come from', '20 min'],
      ['Scoring retrieval and generation apart', '19 min'],
      ['Regression gates in continuous integration', '20 min'],
    ],
  },
]

const INCLUDES = ['Lifetime access to 13 lessons and all future revisions', 'The reviewed project: a working extraction pipeline', 'A graded certificate of completion', 'Offline downloads for every lesson']

const INSTRUCTOR = {
  name: 'Gabriela Fernández',
  role: 'Applied AI engineer, formerly search infrastructure',
  portrait: '/template-assets/DATA-Gabriela-Fernandez.png',
  bio: 'Gabriela spent nine years building retrieval systems at scale before language models landed on her desk. She has shipped the exact pipeline this course teaches — twice, in production, with the scars to prove which parts matter.',
  stats: [
    { icon: 'heroicons:users', text: '12,840 learners' }, { icon: 'heroicons:book-open', text: '4 courses' },
    { icon: 'heroicons:star', text: '4.9 instructor rating' },
  ],
}

const ASPECTS = [
  { label: 'Content depth', score: 4.9 }, { label: 'Practical exercises', score: 4.8 }, { label: 'Instructor clarity', score: 4.9 },
  { label: 'Pacing', score: 4.6 }, { label: 'Materials and project', score: 4.7 }, { label: 'Community support', score: 4.5 },
]

const REVIEWS = [
  {
    name: 'Drew Young', avatar: '/template-assets/DATA-Drew-Young.png', date: 'Reviewed 2 weeks ago', rating: 5, helpful: 41,
    body: 'The evaluation module alone is worth the price. I walked in with a half-working RAG demo and walked out with a harness that caught two regressions in our first sprint after launch.',
  },
  {
    name: 'Jihoo Song', avatar: '/template-assets/DATA-Jihoo-Song.png', date: 'Reviewed a month ago', rating: 5, helpful: 28,
    body: 'Gabriela explains rerankers better than the papers do. The chunking lesson changed how our team splits documentation, and the project review was concrete, not rubber-stamp.',
  },
  {
    name: 'Ana Thomas', avatar: '/template-assets/DATA-Ana-Thomas.png', date: 'Reviewed 2 months ago', rating: 4, helpful: 19,
    body: 'Dense but fair. I wanted more on fine-tuning and got none — the course is honest about scoping to what ships. The structured-output lessons replaced three fragile regex pipelines of mine.',
  },
  {
    name: 'Pablo Morales', avatar: '/template-assets/DATA-Pablo-Morales.png', date: 'Reviewed 3 months ago', rating: 5, helpful: 33,
    body: 'I have taken four applied-AI courses this year and finished one. This is the one. Every module ends in something that runs, exactly as promised, and the finish-date picker kept me honest about pacing.',
  },
]

const FAQS = [
  { q: 'Do I need production access to a language model?', a: 'No. Every exercise runs on a free-tier API key, and the project review accepts either the free tier or a local model. The course states where results differ between them.' },
  { q: 'How long do I have access?', a: 'Access is lifetime, including every future revision of the lessons. When the tooling shifts — and it will — the affected lessons are re-recorded rather than patched with errata.' },
  { q: 'What if the course is not right for me?', a: 'Every purchase carries a 30-day money-back guarantee, no questions and no forms beyond one click. Certificates already issued are yours to keep.' },
  { q: 'Is there a certificate?', a: 'Yes — a graded certificate issued when the reviewed project passes. It lists the pipeline you built, not just attendance.' },
]

const COHORTS = [{ id: 'march', date: 'Cohort of March 10', detail: 'Live reviews · 14 seats left' }, { id: 'april', date: 'Cohort of April 7', detail: 'Live reviews · 6 seats left' }]

// 固定的参考日期，让算出来的完课日期每次渲染都一样。
const COHORT_START = new Date('2026-03-02T00:00:00')
const TOTAL_HOURS = 42
const PACE_MIN = 2
const PACE_MAX = 12

const fmt = (n: number) => `$${n.toFixed(0)}`
const count = (n: number) => n.toLocaleString('en-US')

function finishFrom(pace: number) {
  const weeks = Math.max(1, Math.ceil(TOTAL_HOURS / pace))
  const finish = new Date(COHORT_START)
  finish.setDate(finish.getDate() + weeks * 7)
  const date = finish.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} · finish around ${date}`
}

const showToast = useToast()
const mode = ref('self-paced')
const pace = ref(7)
const cohort = ref(COHORTS[0]!.id)
const finishText = computed(() => `At ${pace.value} h/week — ${finishFrom(pace.value)}`)

// 演示用：真实项目里换成真正执行动作的调用。
function demo(body: string, uniqueID: string) {
  showToast({ body, uniqueID })
}
</script>

<template>
  <Layout height="fill" :content-width="1200">
    <LayoutContent role="main" :padding="6">
      <Grid :columns="{ minWidth: 320, max: 2, repeat: 'fit' }" :gap="6">
        <VStack :gap="4">
          <VStack :gap="4">
            <VStack :gap="2">
              <HStack :gap="2" vAlign="center">
                <Badge variant="warning" label="Bestseller" />
                <Badge :label="COURSE.level" />
              </HStack>
              <Heading :level="1" :max-lines="3">
                {{ COURSE.title }}
              </Heading>
              <HStack :gap="2" vAlign="center">
                <HStack :gap="1" vAlign="center">
                  <Icon v-for="n in 5" :key="n" :name="n <= Math.round(COURSE.rating) ? 'heroicons:star-solid' : 'heroicons:star'" size="sm" />
                  <Text type="body" color="secondary">
                    {{ COURSE.rating }} ({{ count(COURSE.ratingCount) }})
                  </Text>
                </HStack>
                <Text type="body" color="secondary">
                  · {{ COURSE.learnerCount }} learners
                </Text>
              </HStack>
            </VStack>
            <AspectRatio :ratio="16 / 9">
              <img class="poster-image" src="/template-assets/light-working-horizontal-1.png" alt="Course preview: a laptop showing the extraction pipeline built in the project">
            </AspectRatio>
            <HStack :gap="5" vAlign="center" wrap="wrap">
              <HStack v-for="fact in FACTS" :key="fact.text" :gap="1" vAlign="center">
                <Icon :name="fact.icon" size="sm" />
                <Text type="body" color="secondary">
                  {{ fact.text }}
                </Text>
              </HStack>
            </HStack>
          </VStack>

          <Section :padding="6">
            <VStack :gap="4">
              <Heading :level="2">
                About this course
              </Heading>
              <Text type="body">
                {{ COURSE.about }}
              </Text>
              <VStack :gap="2">
                <Text type="label">
                  Skills you practice
                </Text>
                <HStack :gap="2" wrap="wrap">
                  <Badge v-for="skill in COURSE.skills" :key="skill" :label="skill" />
                </HStack>
              </VStack>
            </VStack>
          </Section>

          <Section :padding="6">
            <VStack :gap="4">
              <HStack :gap="2" vAlign="center" hAlign="between" wrap="wrap">
                <Heading :level="2">
                  Syllabus
                </Heading>
                <Text type="supporting" color="secondary">
                  {{ MODULES.length }} modules · {{ COURSE.lessonCount }} lessons
                </Text>
              </HStack>
              <CollapsibleGroup type="multiple" :default-value="[MODULES[0]!.id]">
                <Collapsible v-for="module in MODULES" :key="module.id" :value="module.id">
                  <template #trigger>
                    <VStack :gap="1">
                      <Text type="large" weight="bold">
                        {{ module.title }}
                      </Text>
                      <Text type="supporting" color="secondary">
                        {{ module.meta }}
                      </Text>
                    </VStack>
                  </template>
                  <VStack :gap="2">
                    <HStack v-for="[title, duration] in module.lessons" :key="title" :gap="2" vAlign="center" hAlign="between">
                      <HStack :gap="2" vAlign="center">
                        <Icon name="heroicons:play" size="sm" />
                        <Text type="body">
                          {{ title }}
                        </Text>
                      </HStack>
                      <Text type="supporting" color="secondary">
                        {{ duration }}
                      </Text>
                    </HStack>
                  </VStack>
                </Collapsible>
              </CollapsibleGroup>
            </VStack>
          </Section>

          <Section :padding="6">
            <VStack :gap="4">
              <Heading :level="2">
                Your instructor
              </Heading>
              <Card :padding="5">
                <VStack :gap="4">
                  <HStack :gap="4" vAlign="start">
                    <Avatar :name="INSTRUCTOR.name" :src="INSTRUCTOR.portrait" size="xl" />
                    <VStack :gap="1">
                      <Text type="large" weight="bold">
                        {{ INSTRUCTOR.name }}
                      </Text>
                      <Text type="body" color="secondary">
                        {{ INSTRUCTOR.role }}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack :gap="5" vAlign="center">
                    <HStack v-for="stat in INSTRUCTOR.stats" :key="stat.text" :gap="1" vAlign="center">
                      <Icon :name="stat.icon" size="sm" />
                      <Text type="body" color="secondary">
                        {{ stat.text }}
                      </Text>
                    </HStack>
                  </HStack>
                  <Text type="body">
                    {{ INSTRUCTOR.bio }}
                  </Text>
                  <HStack :gap="2">
                    <Button label="View full profile" @click="demo('Demo: the instructor profile would open here', 'profile')" />
                    <Button label="Follow" variant="ghost" @click="demo('Demo: you would follow the instructor here', 'follow')" />
                  </HStack>
                </VStack>
              </Card>
            </VStack>
          </Section>

          <Section :padding="6">
            <VStack :gap="4">
              <HStack :gap="2" vAlign="center" hAlign="between" wrap="wrap">
                <Heading :level="2">
                  Reviews
                </Heading>
                <Link href="#" type="supporting" color="secondary">
                  How reviews work
                </Link>
              </HStack>
              <Card :padding="5">
                <VStack :gap="4">
                  <HStack :gap="5" vAlign="center">
                    <VStack :gap="1">
                      <Text type="display-3">
                        {{ COURSE.rating }}
                      </Text>
                      <HStack :gap="1" vAlign="center">
                        <Icon v-for="n in 5" :key="n" :name="n <= Math.round(COURSE.rating) ? 'heroicons:star-solid' : 'heroicons:star'" size="sm" />
                        <VisuallyHidden>Rated {{ COURSE.rating }} out of 5</VisuallyHidden>
                      </HStack>
                      <Text type="supporting" color="secondary">
                        {{ count(COURSE.ratingCount) }} reviews
                      </Text>
                    </VStack>
                    <StackItem size="fill">
                      <VStack :gap="3">
                        <VStack v-for="aspect in ASPECTS" :key="aspect.label" :gap="1">
                          <HStack :gap="2" vAlign="center" hAlign="between">
                            <Text type="body" color="secondary">
                              {{ aspect.label }}
                            </Text>
                            <Text type="body" color="secondary">
                              {{ aspect.score.toFixed(1) }}
                            </Text>
                          </HStack>
                          <ProgressBar :label="aspect.label" is-label-hidden :value="(aspect.score / 5) * 100" />
                        </VStack>
                      </VStack>
                    </StackItem>
                  </HStack>
                </VStack>
              </Card>
              <Grid :columns="{ minWidth: 280, max: 4, repeat: 'fit' }" :gap="4">
                <Card v-for="review in REVIEWS" :key="review.name" :padding="4">
                  <VStack :gap="3">
                    <HStack :gap="2" vAlign="center">
                      <Avatar :name="review.name" :src="review.avatar" size="sm" />
                      <VStack :gap="1">
                        <Text type="body" weight="bold">
                          {{ review.name }}
                        </Text>
                        <Text type="supporting" color="secondary">
                          {{ review.date }}
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack :gap="1" vAlign="center">
                      <Icon v-for="n in 5" :key="n" :name="n <= review.rating ? 'heroicons:star-solid' : 'heroicons:star'" size="sm" />
                      <VisuallyHidden>Rated {{ review.rating }} out of 5</VisuallyHidden>
                    </HStack>
                    <Text type="body">
                      {{ review.body }}
                    </Text>
                    <HStack :gap="2" vAlign="center">
                      <Button
                        :label="`Helpful (${review.helpful})`"
                        variant="ghost"
                        size="sm"
                        @click="demo('Demo: your vote would be counted here', `helpful-${review.name}`)"
                      >
                        <template #icon>
                          <Icon name="heroicons:check" size="xsm" />
                        </template>
                      </Button>
                    </HStack>
                  </VStack>
                </Card>
              </Grid>
            </VStack>
          </Section>

          <Section :padding="6">
            <VStack :gap="4">
              <Heading :level="2">
                Common questions
              </Heading>
              <CollapsibleGroup type="multiple">
                <Collapsible v-for="faq in FAQS" :key="faq.q" :value="faq.q" :default-is-open="false">
                  <template #trigger>
                    <Text type="large" weight="bold">
                      {{ faq.q }}
                    </Text>
                  </template>
                  <Text type="body">
                    {{ faq.a }}
                  </Text>
                </Collapsible>
              </CollapsibleGroup>
            </VStack>
          </Section>
        </VStack>

        <VStack :gap="4" class="sticky-rail">
          <Card :padding="5">
            <VStack :gap="4">
              <VStack :gap="1">
                <HStack :gap="2" vAlign="center">
                  <Text type="display-3">
                    {{ fmt(COURSE.price) }}
                  </Text>
                  <Text type="body" color="secondary" has-strikethrough>
                    {{ fmt(COURSE.compareAt) }}
                  </Text>
                  <Badge variant="error" label="Sale" />
                </HStack>
                <Text type="supporting" color="secondary">
                  One-time purchase · yours to keep
                </Text>
              </VStack>
              <VStack :gap="2">
                <Button label="Enroll now" variant="primary" size="lg" @click="demo('Demo: enrollment would start here', 'enroll')">
                  <template #icon>
                    <Icon name="heroicons:arrow-right" size="sm" />
                  </template>
                </Button>
                <Button label="Start lesson one free" size="lg" @click="demo('Demo: lesson one would play here', 'lesson-one')">
                  <template #icon>
                    <Icon name="heroicons:play" size="sm" />
                  </template>
                </Button>
              </VStack>
              <Text type="supporting" color="secondary">
                30-day money-back guarantee
              </Text>
              <Divider />
              <VStack :gap="3">
                <Text type="label">
                  Start
                </Text>
                <SegmentedControl v-model="mode" label="Start mode">
                  <SegmentedControlItem value="self-paced" label="Self-paced" />
                  <SegmentedControlItem value="cohort" label="Cohort" />
                </SegmentedControl>
                <VStack v-if="mode === 'self-paced'" :gap="2">
                  <Slider
                    v-model="pace"
                    label="Weekly pace"
                    :min="PACE_MIN"
                    :max="PACE_MAX"
                    :marks="[{ value: PACE_MIN }, { value: PACE_MAX }]"
                    :format-value="(value: number) => `${value} h/week`"
                  />
                  <Text type="supporting" color="secondary">
                    {{ finishText }}
                  </Text>
                </VStack>
                <RadioList v-else v-model="cohort" label="Cohort start">
                  <RadioListItem v-for="option in COHORTS" :key="option.id" :value="option.id" :label="option.date" :description="option.detail" />
                </RadioList>
              </VStack>
              <Divider />
              <VStack :gap="2">
                <Text type="label">
                  This course includes
                </Text>
                <HStack v-for="item in INCLUDES" :key="item" :gap="2" vAlign="start">
                  <Icon name="heroicons:check" size="sm" />
                  <Text type="body" color="secondary">
                    {{ item }}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>
        </VStack>
      </Grid>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.sticky-rail {
  position: sticky;
  top: var(--astryx-spacing-8);
  align-self: start;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--astryx-radius-container);
}
</style>
