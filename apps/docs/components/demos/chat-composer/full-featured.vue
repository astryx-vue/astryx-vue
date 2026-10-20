<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ChatComposer, ChatComposerDrawer, ChatComposerInput } from '@astryx-vue/core/Chat'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Token } from '@astryx-vue/core/Token'
import { ref } from 'vue'

const files = ref([
  'design-spec.pdf',
  'requirements.docx',
  'wireframes.fig',
  'api-spec.yaml',
  'user-research.csv',
])

function remove(name: string): void {
  files.value = files.value.filter(item => item !== name)
}

const models = [
  { label: 'Auto' },
  { label: 'Model A' },
  { label: 'Model B' },
  { label: 'Model C' },
]

const settings = [
  { label: 'Preferences' },
  { label: 'Keyboard shortcuts' },
  { label: 'About' },
]

const isStreaming = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function onSubmit(): void {
  isStreaming.value = true
  timer = setTimeout(() => {
    isStreaming.value = false
  }, 3000)
}

function onStop(): void {
  clearTimeout(timer)
  isStreaming.value = false
}
</script>

<template>
  <VStack :gap="4">
    <Text type="supporting" color="secondary">
      All slots populated
    </Text>
    <ChatComposer
      placeholder="Ask me anything..."
      :is-stop-shown="isStreaming"
      @submit="onSubmit"
      @stop="onStop"
    >
      <template #drawer>
        <ChatComposerDrawer :count="files.length">
          <Token
            v-for="name in files"
            :key="name"
            removable
            :label="name"
            @remove="remove(name)"
          />
        </ChatComposerDrawer>
      </template>
      <template #input>
        <ChatComposerInput style="min-height: 44px" />
      </template>
      <template #headerActions>
        <IconButton label="Mention" variant="ghost" size="sm">
          <Icon name="heroicons:at-symbol" />
        </IconButton>
        <IconButton label="Attach file" variant="ghost" size="sm">
          <Icon name="heroicons:paper-clip" />
        </IconButton>
      </template>
      <template #headerContext>
        <ProgressBar label="Context window" :value="50" :width="96" is-label-hidden />
      </template>
      <template #footerActions>
        <DropdownMenu :items="models" :menu-width="200">
          <template #trigger="triggerProps">
            <Button v-bind="triggerProps" label="Auto" variant="ghost" size="md">
              <template #icon>
                <Icon name="heroicons:sparkles" />
              </template>
            </Button>
          </template>
        </DropdownMenu>
        <DropdownMenu :items="settings" :menu-width="200">
          <template #trigger="triggerProps">
            <Button v-bind="triggerProps" label="Settings" variant="ghost" size="md">
              <template #icon>
                <Icon name="heroicons:cog-6-tooth" />
              </template>
            </Button>
          </template>
        </DropdownMenu>
      </template>
      <template #sendActions>
        <IconButton label="Microphone" variant="ghost" size="md">
          <Icon name="heroicons:microphone" />
        </IconButton>
      </template>
    </ChatComposer>
  </VStack>
</template>
