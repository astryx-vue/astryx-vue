<script setup lang="ts">
import { useHotkeys } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { Kbd } from '@astryx-vue/core/Kbd'
import { Layout, LayoutContent } from '@astryx-vue/core/Layout'
import { HStack, StackItem, VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const searchInput = ref<InstanceType<typeof TextInput> | null>(null)
const query = ref('')
const isHelpOpen = ref(false)
// 单字符快捷键必须能关掉（WCAG 2.1.4）。
const hasShortcuts = ref(true)

useHotkeys(() => [
  { keys: '/', onPress: () => searchInput.value?.focus(), isDisabled: !hasShortcuts.value },
  { keys: '?', onPress: () => { isHelpOpen.value = true }, isDisabled: !hasShortcuts.value },
])
</script>

<template>
  <Card :width="480" :padding="4">
    <VStack :gap="3">
      <HStack align="center" :gap="2">
        <StackItem size="fill">
          <TextInput
            ref="searchInput"
            v-model="query"
            label="Search"
            is-label-hidden
            placeholder="Search projects"
          />
        </StackItem>
        <Button label="Shortcuts" @click="isHelpOpen = true" />
      </HStack>
      <Switch v-model="hasShortcuts" label="Single-key shortcuts" />
    </VStack>
    <Dialog :is-open="isHelpOpen" @open-change="isHelpOpen = $event">
      <Layout>
        <template #header>
          <DialogHeader title="Keyboard shortcuts" @open-change="isHelpOpen = $event" />
        </template>
        <LayoutContent>
          <VStack :gap="2">
            <HStack align="center" :gap="2">
              <Kbd keys="/" />
              <Text type="body">
                Focus search
              </Text>
            </HStack>
            <HStack align="center" :gap="2">
              <Kbd keys="?" />
              <Text type="body">
                Show this help
              </Text>
            </HStack>
          </VStack>
        </LayoutContent>
      </Layout>
    </Dialog>
  </Card>
</template>
