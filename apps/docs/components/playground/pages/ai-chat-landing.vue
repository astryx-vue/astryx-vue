<script setup lang="ts">
import type { ChatComposerInputHandle, ChatComposerTrigger } from '@astryx-vue/core'
import {
  Button,
  ChatComposer,
  ChatComposerDrawer,
  ChatComposerInput,
  ChatDictationButton,
  ClickableCard,
  createStaticSource,
  DropdownMenu,
  DropdownMenuDivider,
  DropdownMenuItem,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  Text,
  Token,
  ToggleButton,
  ToggleButtonGroup,
  useChatDictation,
  VStack,
} from '@astryx-vue/core'
import { computed, nextTick, ref, useTemplateRef } from 'vue'

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

const MENTION_ITEMS = [
  { id: 'cindy', label: 'Cindy Zhang', description: 'Design Systems' },
  { id: 'alex', label: 'Alex Johnson', description: 'Frontend' },
  { id: 'sam', label: 'Sam Rivera', description: 'Backend' },
  { id: 'jordan', label: 'Jordan Lee', description: 'Product' },
  { id: 'taylor', label: 'Taylor Kim', description: 'Design' },
  { id: 'morgan', label: 'Morgan Chen', description: 'Infrastructure' },
]

const COMMAND_ITEMS = [
  { id: 'summarize', label: 'summarize', description: 'Summarize the conversation' },
  { id: 'translate', label: 'translate', description: 'Translate text to another language' },
  { id: 'search', label: 'search', description: 'Search the web or documents' },
  { id: 'code', label: 'code', description: 'Generate or explain code' },
  { id: 'help', label: 'help', description: 'Show available commands' },
]

const TOKEN_MODES: Record<string, string> = {
  sensitive: '/sensitive',
  deep: '/deep-mode',
}

const composerTriggers: ChatComposerTrigger[] = [
  {
    character: '@',
    menuLabel: 'People',
    searchSource: createStaticSource(MENTION_ITEMS),
    onSelect: item => ({ value: `@${item.id}`, label: item.label, variant: 'blue' }),
  },
  {
    character: '/',
    menuLabel: 'Commands',
    searchSource: createStaticSource(COMMAND_ITEMS),
    onSelect: item => ({ value: `/${item.label}`, label: `/${item.label}`, variant: 'yellow' }),
  },
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
const draft = ref('')
const isModeMenuOpen = ref(false)
const composerInputRef = useTemplateRef<ChatComposerInputHandle>('composerInput')
const shouldFocusComposer = ref(false)
const dictation = useChatDictation({ input: composerInputRef })

const suggestions = computed(() => (category.value ? CATEGORY_SUGGESTIONS[category.value] : null))
const modeLabel = computed(() => {
  if (mode.value === 'writing')
    return 'Writing'
  if (mode.value === 'coding')
    return 'Coding'
  if (mode.value === 'research')
    return 'Research'
  if (mode.value === 'creative')
    return 'Creative'
  return 'Auto'
})

async function applySuggestion(prompt: string) {
  draft.value = prompt
  if (category.value)
    mode.value = category.value
  await nextTick()
  composerInputRef.value?.focus()
}

function insertMention(item: typeof MENTION_ITEMS[number]) {
  const input = composerInputRef.value
  if (!input)
    return
  input.focus()
  input.insertToken({ value: `@${item.id}`, label: item.label, variant: 'blue' })
}

function insertModeToken(label: string) {
  composerInputRef.value?.focus()
  composerInputRef.value?.insertToken({ value: label, label, variant: 'orange' })
  shouldFocusComposer.value = true
}

function onModeOpenChange(isOpen: boolean) {
  isModeMenuOpen.value = isOpen
  if (!isOpen && shouldFocusComposer.value) {
    shouldFocusComposer.value = false
    window.setTimeout(() => composerInputRef.value?.focus(), 50)
  }
}

function addFiles(files: File[]) {
  attachments.value = [...attachments.value, ...files.map(file => file.name)]
}

function removeAttachment(name: string) {
  attachments.value = attachments.value.filter(item => item !== name)
}

function chooseMode(key: string) {
  const tokenLabel = TOKEN_MODES[key]
  if (tokenLabel)
    insertModeToken(tokenLabel)
  else
    mode.value = key
}
</script>

<template>
  <Layout height="fill" :content-width="720" :padding="6">
    <LayoutContent>
      <VStack :gap="8" align="center" class="page">
        <VStack :gap="1">
          <HStack :gap="2" align="center">
            <Icon name="heroicons:sparkles" size="md" color="accent" />
            <Text type="large">
              Hi, Andrew
            </Text>
          </HStack>
          <Heading :level="1" type="display-2">
            Where should we start?
          </Heading>
        </VStack>

        <ChatComposer v-model="draft" class="composer" placeholder="Ask anything">
          <template #input>
            <ChatComposerInput
              ref="composerInput"
              class="composer-input"
              :triggers="composerTriggers"
              @files="addFiles"
            />
          </template>
          <template v-if="attachments.length" #drawer>
            <ChatComposerDrawer :count="attachments.length">
              <Token
                v-for="name in attachments"
                :key="name"
                :label="name"
                @remove="removeAttachment(name)"
              />
            </ChatComposerDrawer>
          </template>
          <template #headerActions>
            <DropdownMenu :has-chevron="false" :menu-width="240">
              <template #trigger="triggerProps">
                <IconButton v-bind="triggerProps" label="Reference" variant="ghost" size="sm">
                  <Icon name="heroicons:at-symbol" />
                </IconButton>
              </template>
              <DropdownMenuItem
                v-for="item in MENTION_ITEMS"
                :key="item.id"
                :label="item.label"
                :description="item.description"
                @click="insertMention(item)"
              />
            </DropdownMenu>
          </template>
          <template #footerActions>
            <DropdownMenu
              :menu-width="200"
              :is-menu-open="isModeMenuOpen"
              @open-change="onModeOpenChange"
            >
              <template #trigger="triggerProps">
                <Button v-bind="triggerProps" :label="modeLabel" variant="ghost" size="md">
                  <template #icon>
                    <Icon v-if="mode === 'writing'" name="heroicons:pencil-square" size="sm" />
                    <Icon v-else-if="mode === 'coding'" name="heroicons:code-bracket" size="sm" />
                    <Icon v-else-if="mode === 'research'" name="heroicons:magnifying-glass" size="sm" />
                    <Icon v-else-if="mode === 'creative'" name="heroicons:light-bulb" size="sm" />
                    <Icon v-else name="heroicons:sparkles" size="sm" />
                  </template>
                  <template #end>
                    <Icon icon="chevronDown" size="sm" color="inherit" />
                  </template>
                </Button>
              </template>
              <DropdownMenuItem label="Auto" @click="chooseMode('auto')">
                <template #icon>
                  <Icon name="heroicons:sparkles" size="sm" />
                </template>
              </DropdownMenuItem>
              <DropdownMenuItem label="Writing" @click="chooseMode('writing')">
                <template #icon>
                  <Icon name="heroicons:pencil-square" size="sm" />
                </template>
              </DropdownMenuItem>
              <DropdownMenuItem label="Coding" @click="chooseMode('coding')">
                <template #icon>
                  <Icon name="heroicons:code-bracket" size="sm" />
                </template>
              </DropdownMenuItem>
              <DropdownMenuItem label="Research" @click="chooseMode('research')">
                <template #icon>
                  <Icon name="heroicons:magnifying-glass" size="sm" />
                </template>
              </DropdownMenuItem>
              <DropdownMenuItem label="Creative" @click="chooseMode('creative')">
                <template #icon>
                  <Icon name="heroicons:light-bulb" size="sm" />
                </template>
              </DropdownMenuItem>
              <DropdownMenuDivider />
              <DropdownMenuItem label="Sensitive" @click="chooseMode('sensitive')">
                <template #icon>
                  <Icon name="heroicons:lock-closed" size="sm" />
                </template>
              </DropdownMenuItem>
              <DropdownMenuItem label="Deep Mode" @click="chooseMode('deep')">
                <template #icon>
                  <Icon name="heroicons:clock" size="sm" />
                </template>
              </DropdownMenuItem>
            </DropdownMenu>
            <DropdownMenu
              :menu-width="200"
              :items="[
                { label: 'Preferences' },
                { label: 'Keyboard shortcuts' },
                { label: 'About' },
              ]"
            >
              <template #trigger="triggerProps">
                <Button v-bind="triggerProps" label="Settings" variant="ghost" size="md">
                  <template #icon>
                    <Icon name="heroicons:cog-6-tooth" size="sm" />
                  </template>
                  <template #end>
                    <Icon icon="chevronDown" size="sm" color="inherit" />
                  </template>
                </Button>
              </template>
            </DropdownMenu>
          </template>
          <template #sendActions>
            <ChatDictationButton :dictation="dictation" />
          </template>
        </ChatComposer>

        <VStack :gap="6" class="categories">
          <ToggleButtonGroup v-model:value="category" label="Category" size="lg">
            <ToggleButton value="writing" label="Writing">
              <template #icon>
                <Icon name="heroicons:pencil-square" size="sm" />
              </template>
            </ToggleButton>
            <ToggleButton value="coding" label="Coding">
              <template #icon>
                <Icon name="heroicons:code-bracket" size="sm" />
              </template>
            </ToggleButton>
            <ToggleButton value="research" label="Research">
              <template #icon>
                <Icon name="heroicons:magnifying-glass" size="sm" />
              </template>
            </ToggleButton>
            <ToggleButton value="creative" label="Creative">
              <template #icon>
                <Icon name="heroicons:light-bulb" size="sm" />
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
                <Heading :level="4">
                  {{ suggestion.heading }}
                </Heading>
                <Text type="body" color="secondary" size="sm">
                  {{ suggestion.body }}
                </Text>
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
.composer { width: 100%; }
.composer-input { min-height: 84px; }
.categories { padding-inline: var(--astryx-spacing-3); width: 100%; }
</style>
