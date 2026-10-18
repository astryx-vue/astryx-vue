<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ChatComposer } from '@astryx-vue/core/Chat'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const models = [
  { label: 'Auto' },
  { label: 'Model A' },
  { label: 'Model B' },
]

const settings = [
  { label: 'Preferences' },
  { label: 'Keyboard shortcuts' },
  { label: 'About' },
]
</script>

<template>
  <VStack :gap="2">
    <Text type="supporting" color="secondary">
      elevation="none" — flat, with a text-input-style border and focus ring
    </Text>
    <ChatComposer elevation="none">
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
