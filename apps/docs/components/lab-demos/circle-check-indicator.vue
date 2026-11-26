<script setup lang="ts">
import { CheckboxInput, defineTheme, Theme, VStack } from '@astryx-vue/core'
import { CircleCheckIndicator } from '@astryx-vue/lab'
import { ref } from 'vue'

const circleChecks = defineTheme({ name: 'circle-checks', indicators: { checkbox: CircleCheckIndicator } })
const selected = ref({ inbox: true, drafts: false, archive: true })
</script>

<template>
  <Theme :theme="circleChecks">
    <VStack :gap="2">
      <CheckboxInput v-model="selected.inbox" label="Inbox" />
      <CheckboxInput v-model="selected.drafts" label="Drafts" />
      <CheckboxInput v-model="selected.archive" label="Archive" />
    </VStack>
  </Theme>
</template>
