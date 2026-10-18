<script setup lang="ts">
import { ChatComposer, ChatComposerDrawer } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
import { Token } from '@astryx-vue/core/Token'
import { ref } from 'vue'

const files = ref(['design-spec.pdf', 'api-schema.json', 'screenshot.png'])

function remove(name: string): void {
  files.value = files.value.filter(item => item !== name)
}
</script>

<template>
  <ChatComposer>
    <template #drawer>
      <ChatComposerDrawer :count="files.length" label="Attachments">
        <Token
          v-for="name in files"
          :key="name"
          removable
          :label="name"
          @remove="remove(name)"
        />
      </ChatComposerDrawer>
    </template>
    <template #headerActions>
      <IconButton label="Mention" variant="ghost" size="sm">
        <Icon name="heroicons:at-symbol" />
      </IconButton>
      <IconButton label="Attach" variant="ghost" size="sm">
        <Icon name="heroicons:paper-clip" />
      </IconButton>
    </template>
    <template #headerContext>
      <ProgressBar label="Context usage" :value="42" :width="96" is-label-hidden />
    </template>
  </ChatComposer>
</template>
