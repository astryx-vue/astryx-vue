<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ChatComposer, ChatComposerDrawer } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Token } from '@astryx-vue/core/Token'

const files = ['design-spec.pdf', 'api-schema.json', 'screenshot.png', 'meeting-notes.md']
</script>

<template>
  <Stack direction="vertical" :gap="4" :width="450" max-width="100%">
    <ChatComposer>
      <template #drawer>
        <ChatComposerDrawer :count="4" label="Attachments" class="chat-composer-drawer-showcase__drawer">
          <Token v-for="name in files" :key="name" :label="name" removable />
        </ChatComposerDrawer>
      </template>
      <template #headerActions>
        <Button label="Attach" variant="ghost" size="sm" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-paper-clip" size="sm" />
          </template>
        </Button>
      </template>
    </ChatComposer>
  </Stack>
</template>

<style scoped>
.chat-composer-drawer-showcase__drawer {
  border: var(--astryx-border-width) solid var(--astryx-color-border);
  border-top-left-radius: var(--astryx-radius-chat);
  border-top-right-radius: var(--astryx-radius-chat);
}
</style>
