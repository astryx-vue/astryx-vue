<script setup lang="ts">
import { Text, VStack } from '@astryx-vue/core'
import { CommentComposer } from '@astryx-vue/lab'
import { ref } from 'vue'

const draft = ref('')
const posted = ref<string[]>([])
const quote = ref('Guardrail alerts page the release oncall.')

function post(body: string) {
  posted.value = [...posted.value, body]
  draft.value = ''
}
</script>

<template>
  <VStack :gap="3" :width="420" max-width="100%">
    <Text v-if="posted.length === 0" type="supporting" color="secondary">
      Nothing posted yet.
    </Text>
    <Text v-for="(body, index) in posted" :key="index" type="body">
      {{ body }}
    </Text>
    <CommentComposer
      :value="draft"
      :anchor="quote ? { quote } : undefined"
      @change="draft = $event"
      @submit="post"
      @anchor-dismiss="quote = ''"
    />
  </VStack>
</template>
