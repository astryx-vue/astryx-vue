<script setup lang="ts">
import {
  Button,
  Card,
  ClickableCard,
  DropdownMenu,
  DropdownMenuItem,
  Grid,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  Text,
  TextArea,
  Token,
  ToggleButton,
  ToggleButtonGroup,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

/* Gaps: ChatComposer, ChatComposerInput, ChatComposerDrawer, ChatDictationButton, useChatDictation, Typeahead/createStaticSource */

const CATEGORY_SUGGESTIONS: Record<string, Array<{ heading: string, body: string, prompt: string }>> = {
  writing: [
    { heading: 'Draft a professional email', body: 'Compose a clear, polished email for any audience', prompt: 'Help me draft a professional email' },
    { heading: 'Improve my writing', body: 'Enhance the clarity, tone, and flow of my text', prompt: 'Review and improve the following text:' },
    { heading: 'Create a project proposal', body: 'Write a proposal with goals, timeline, and deliverables', prompt: 'Help me write a project proposal for' },
    { heading: 'Summarize a document', body: 'Condense a long document into key takeaways', prompt: 'Summarize the following document into key points:' },
  ],
  coding: [
    { heading: 'Debug my code', body: 'Find and fix issues in a code snippet', prompt: 'Help me debug the following code:' },
    { heading: 'Write a function', body: 'Generate a well-typed function with error handling', prompt: 'Write a function that' },
    { heading: 'Explain this code', body: 'Break down complex code into understandable pieces', prompt: 'Explain what the following code does:' },
    { heading: 'Review my pull request', body: 'Check for bugs, performance, and best practices', prompt: 'Review this code for bugs and improvements:' },
  ],
  research: [
    { heading: 'Compare options', body: 'Analyze pros and cons of different approaches', prompt: 'Compare the pros and cons of' },
    { heading: 'Explain a concept', body: 'Break down a complex topic in simple terms', prompt: 'Explain the concept of' },
    { heading: 'Find best practices', body: 'Research standards and recommended approaches', prompt: 'What are the best practices for' },
    { heading: 'Summarize findings', body: 'Compile research into a structured overview', prompt: 'Summarize the key findings on' },
  ],
  creative: [
    { heading: 'Brainstorm ideas', body: 'Generate creative concepts for a project', prompt: 'Brainstorm ideas for' },
    { heading: 'Write a story', body: 'Create an engaging narrative with characters', prompt: 'Write a short story about' },
    { heading: 'Design a concept', body: 'Explore product or visual design ideas', prompt: 'Help me design a concept for' },
    { heading: 'Create a tagline', body: 'Craft a memorable phrase for a brand or product', prompt: 'Create a catchy tagline for' },
  ],
}

const CATEGORIES = [
  { key: 'writing', label: 'Writing', icon: 'i-heroicons-pencil-square' },
  { key: 'coding', label: 'Coding', icon: 'i-heroicons-code-bracket' },
  { key: 'research', label: 'Research', icon: 'i-heroicons-magnifying-glass' },
  { key: 'creative', label: 'Creative', icon: 'i-heroicons-light-bulb' },
]

const MODE_OPTIONS = [
  { key: 'auto', label: 'Auto', icon: 'i-heroicons-sparkles' },
  ...CATEGORIES,
  { key: 'sensitive', label: 'Sensitive', icon: 'i-heroicons-lock-closed' },
  { key: 'deep', label: 'Deep Mode', icon: 'i-heroicons-clock' },
]

const TOKEN_MODES: Record<string, string> = {
  sensitive: '/sensitive',
  deep: '/deep-mode',
}

const MENTION_ITEMS = [
  { id: 'cindy', label: 'Cindy Zhang', role: 'Design Systems' },
  { id: 'alex', label: 'Alex Johnson', role: 'Frontend' },
  { id: 'sam', label: 'Sam Rivera', role: 'Backend' },
  { id: 'jordan', label: 'Jordan Lee', role: 'Product' },
  { id: 'taylor', label: 'Taylor Kim', role: 'Design' },
  { id: 'morgan', label: 'Morgan Chen', role: 'Infrastructure' },
]

const mode = ref<string | null>('auto')
const category = ref<string | null>(null)
const attachments = ref([
  'project_brief.pdf',
  'wireframes_v2.fig',
  'api_spec.yaml',
  'user_research.csv',
  'brand_guidelines.pdf',
])
const isModeMenuOpen = ref(false)
const composerText = ref('')

const activeMode = computed(() => MODE_OPTIONS.find(m => m.key === mode.value) ?? MODE_OPTIONS[0])
const suggestions = computed(() => (category.value ? CATEGORY_SUGGESTIONS[category.value] : null))

function applySuggestion(prompt: string) {
  composerText.value = prompt
  if (category.value)
    mode.value = category.value
}

function insertMention(item: typeof MENTION_ITEMS[number]) {
  composerText.value += `@${item.label} `
}

function insertModeToken(label: string) {
  composerText.value += `${label} `
}

function removeAttachment(name: string) {
  attachments.value = attachments.value.filter(n => n !== name)
}

function modeMenuItems() {
  return MODE_OPTIONS.flatMap((opt) => {
    const item = {
      label: opt.label,
      icon: opt.icon,
      onClick: () => {
        const tokenLabel = TOKEN_MODES[opt.key]
        if (tokenLabel)
          insertModeToken(tokenLabel)
        else
          mode.value = opt.key
      },
    }
    return opt.key === 'sensitive' ? [{ type: 'divider' as const }, item] : [item]
  })
}
</script>

<template>
  <Layout height="fill" :content-width="720" :padding="6">
    <LayoutContent>
      <VStack :gap="8" :v-align="'center'" class="page">
        <VStack :gap="1">
          <HStack :gap="2" :v-align="'center'">
            <span class="i-heroicons-sparkles accent" aria-hidden="true" />
            <Text type="large">
              Hi, Andrew
            </Text>
          </HStack>
          <Heading :level="1" type="display-2">
            Where should we start?
          </Heading>
        </VStack>

        <Card :padding="4" class="composer-shell">
          <VStack :gap="3">
            <HStack :gap="2" :v-align="'center'" :h-align="'between'">
              <DropdownMenu
                :button="{ label: 'Reference', variant: 'ghost', size: 'sm', isIconOnly: true }"
                :has-chevron="false"
                :menu-width="240"
              >
                <template #button-icon>
                  <span class="i-heroicons-at-symbol" aria-hidden="true" />
                </template>
                <DropdownMenuItem
                  v-for="item in MENTION_ITEMS"
                  :key="item.id"
                  :label="item.label"
                  :description="item.role"
                  @click="insertMention(item)"
                />
              </DropdownMenu>
              <HStack :gap="1">
                <DropdownMenu
                  :button="{ label: activeMode.label, variant: 'ghost', size: 'md' }"
                  :menu-width="200"
                  :is-menu-open="isModeMenuOpen"
                  :items="modeMenuItems()"
                  @open-change="isModeMenuOpen = $event"
                >
                  <template #button-icon>
                    <span :class="activeMode.icon" aria-hidden="true" />
                  </template>
                </DropdownMenu>
                <DropdownMenu
                  :button="{ label: 'Settings', variant: 'ghost', size: 'md' }"
                  :menu-width="200"
                  :items="[
                    { label: 'Preferences', onClick: () => {} },
                    { label: 'Keyboard shortcuts', onClick: () => {} },
                    { label: 'About', onClick: () => {} },
                  ]"
                >
                  <template #button-icon>
                    <span class="i-heroicons-cog-6-tooth" aria-hidden="true" />
                  </template>
                </DropdownMenu>
              </HStack>
            </HStack>

            <div v-if="attachments.length" class="attachment-drawer">
              <Text type="supporting" color="secondary">{{ attachments.length }} attachments</Text>
              <HStack :gap="1" wrap="wrap">
                <Token
                  v-for="name in attachments"
                  :key="name"
                  :label="name"
                  @remove="removeAttachment(name)"
                />
              </HStack>
            </div>

            <TextArea
              v-model="composerText"
              label="Message"
              is-label-hidden
              placeholder="Ask anything"
              class="composer-input"
            />

            <HStack :h-align="'end'">
              <Button label="Send" variant="primary" size="md" />
            </HStack>
          </VStack>
        </Card>

        <VStack :gap="6" class="categories">
          <ToggleButtonGroup v-model="category" label="Category" size="lg">
            <ToggleButton
              v-for="cat in CATEGORIES"
              :key="cat.key"
              :value="cat.key"
              :label="cat.label"
            >
              <template #icon>
                <span :class="cat.icon" aria-hidden="true" />
              </template>
            </ToggleButton>
          </ToggleButtonGroup>

          <Grid v-if="suggestions" :columns="{ minWidth: 280 }" :gap="3">
            <ClickableCard
              v-for="suggestion in suggestions"
              :key="suggestion.heading"
              :label="suggestion.heading"
              variant="muted"
              :padding="3"
              @click="applySuggestion(suggestion.prompt)"
            >
              <VStack :gap="0.5">
                <Heading :level="4">{{ suggestion.heading }}</Heading>
                <Text type="body" color="secondary" size="sm">{{ suggestion.body }}</Text>
              </VStack>
            </ClickableCard>
          </Grid>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.page { min-height: 100%; }
.composer-shell { width: 100%; }
.composer-input { min-height: 84px; }
.categories { padding-inline: var(--spacing-3); width: 100%; }
.attachment-drawer { padding: var(--spacing-2); background: var(--color-background-muted); border-radius: var(--radius-element); }
.accent { color: var(--color-text-accent); }
</style>
