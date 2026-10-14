<script setup lang="ts">
import type { CheckboxValue } from '@astryx-vue/core/CheckboxInput'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const checked = ref<CheckboxValue>(true)
const unchecked = ref<CheckboxValue>(false)
const disabled = ref<CheckboxValue>(false)
const indeterminate = ref<CheckboxValue>('indeterminate')
</script>

<template>
  <VStack :gap="4">
    <CheckboxInput v-model="checked" label="Checked" description="This checkbox is currently on." />
    <CheckboxInput v-model="unchecked" label="Unchecked" description="This checkbox is currently off." />
    <CheckboxInput v-model="disabled" label="Disabled" description="This checkbox cannot be changed." is-disabled />
    <CheckboxInput v-model="indeterminate" label="Indeterminate" description="This checkbox represents a partial selection." />
  </VStack>
</template>
