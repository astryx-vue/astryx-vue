<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { ChatComposer, ChatComposerDrawer } from '@astryx-vue/core/Chat'
import { List, ListItem } from '@astryx-vue/core/List'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const options = [
  { key: 'A', label: 'Yes' },
  { key: 'B', label: 'Yes, and don’t ask again for `git add` commands' },
  { key: 'C', label: 'No, and tell me what to do differently' },
]

const selected = ref<string | null>(null)
</script>

<template>
  <ChatComposer>
    <template #drawer>
      <ChatComposerDrawer :count="1" label="User feedback requested">
        <VStack :gap="1" width="100%">
          <List>
            <ListItem>
              <template #label>
                <Text weight="bold">
                  Do you want to proceed?
                </Text>
              </template>
            </ListItem>
            <ListItem
              v-for="option in options"
              :key="option.key"
              :label="option.label"
              :is-selected="selected === option.key"
              @click="selected = option.key"
            >
              <template #startContent>
                <Badge :variant="selected === option.key ? 'info' : 'neutral'" :label="option.key" />
              </template>
            </ListItem>
          </List>
        </VStack>
      </ChatComposerDrawer>
    </template>
  </ChatComposer>
</template>
