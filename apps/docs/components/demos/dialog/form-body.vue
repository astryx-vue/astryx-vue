<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { TextArea } from '@astryx-vue/core/TextArea'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

defineProps<{ requestClose: () => void }>()

const name = ref('Ruby Cheung')
const bio = ref('Design systems engineer')
</script>

<template>
  <Layout>
    <template #header>
      <DialogHeader
        title="Edit profile"
        subtitle="Update your display name and bio"
        has-close-button
        @open-change="requestClose()"
      />
    </template>
    <LayoutContent>
      <VStack :gap="4">
        <TextInput v-model="name" label="Display name" placeholder="Enter your name" />
        <TextArea v-model="bio" label="Bio" placeholder="Tell us about yourself" />
      </VStack>
    </LayoutContent>
    <template #footer>
      <LayoutFooter>
        <HStack h-align="end" :gap="2">
          <Button label="Cancel" variant="secondary" @click="requestClose()" />
          <Button label="Save" variant="primary" @click="requestClose()" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
