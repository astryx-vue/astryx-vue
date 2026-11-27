<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { useSpeechRecognition } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const said = ref('')
const speech = useSpeechRecognition({
  onResult: (transcript) => {
    said.value = said.value === '' ? transcript : `${said.value} ${transcript}`
  },
})
const status = computed(() => {
  if (!speech.isSupported.value)
    return 'This browser has no speech recognition'
  return speech.isListening.value ? 'Listening' : 'Ready'
})
const transcript = computed(() =>
  [said.value, speech.interimTranscript.value].filter(Boolean).join(' ') || 'No transcript yet',
)
</script>

<template>
  <VStack :gap="3" align="start">
    <Text type="body">
      {{ status }}
    </Text>
    <Text type="body" color="secondary">
      {{ transcript }}
    </Text>
    <Button
      :label="speech.isListening.value ? 'Stop' : 'Start'"
      variant="secondary"
      :is-disabled="!speech.isSupported.value"
      @click="speech.toggle"
    />
  </VStack>
</template>
