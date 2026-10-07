<script setup lang="ts">
import type { CheckboxValue } from '@astryx-vue/core/CheckboxInput'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { computed, shallowRef } from 'vue'

const email = shallowRef(true)
const push = shallowRef(false)
const all = computed<CheckboxValue>({
  get: () => email.value === push.value ? email.value : 'indeterminate',
  set: (value) => { email.value = push.value = value === true },
})
</script>

<template>
  <div class="input-preview-stack">
    <CheckboxInput v-model="all" label="All notifications" description="Choose all channels or clear the selection." />
    <div class="checkbox-preview-children">
      <CheckboxInput v-model="email" label="Email notifications" />
      <CheckboxInput v-model="push" label="Push notifications" />
    </div>
  </div>
</template>
