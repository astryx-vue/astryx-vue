<script setup lang="ts">
import { Text, VStack } from '@astryx-vue/core'
import { CommentComposerBase } from '@astryx-vue/lab'
import { ref } from 'vue'

const draft = ref('Page the oncall when a guardrail trips.')
const status = ref('Editing comment')

function cancel() {
  draft.value = 'Page the oncall when a guardrail trips.'
  status.value = 'Edit cancelled'
}
</script>

<template>
  <VStack :gap="3" :width="420">
    <Text type="supporting" color="secondary">
      {{ status }}
    </Text>
    <CommentComposerBase
      :value="draft"
      placeholder="Edit comment"
      context-label="Editing comment"
      :context="{ kind: 'edit', commentId: 'c1' }"
      :has-cancel="true"
      :has-emoji-picker="true"
      @change="draft = $event"
      @submit="status = 'Saved'"
      @cancel="cancel"
    />
  </VStack>
</template>
