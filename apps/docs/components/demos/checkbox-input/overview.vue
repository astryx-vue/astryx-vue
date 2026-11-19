<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Stack } from '@astryx-vue/core/Stack'
import { shallowRef } from 'vue'

const notifications = shallowRef(true)
const marketing = shallowRef(false)
</script>

<template>
  <Stack direction="vertical" :gap="2">
    <CheckboxInput v-model="notifications" label="Checked" />
    <CheckboxInput v-model="marketing" label="Unchecked" />
  </Stack>
</template>
