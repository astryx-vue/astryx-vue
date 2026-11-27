<script setup lang="ts">
import { SelectableCardGroup, SelectableCardGroupItem } from '@astryx-vue/lab'
import { ref } from 'vue'

const plan = ref<string | null>('pro')
</script>

<template>
  <SelectableCardGroup v-model="plan" label="Plan" description="Billed monthly">
    <SelectableCardGroupItem value="basic" label="Basic" :padding="3">
      Basic
    </SelectableCardGroupItem>
    <SelectableCardGroupItem value="pro" label="Pro" :padding="3">
      Pro
    </SelectableCardGroupItem>
    <SelectableCardGroupItem value="team" label="Team" :padding="3">
      Team
    </SelectableCardGroupItem>
  </SelectableCardGroup>
</template>
