<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const disabledVal = shallowRef('10:00')
const errorVal = shallowRef('22:00')
const warningVal = shallowRef('07:00')
const successVal = shallowRef('10:00')
</script>

<template>
  <VStack :gap="3">
    <TimeInput v-model="disabledVal" label="Disabled field" is-disabled />
    <TimeInput v-model="errorVal" label="Error message" :status="{ type: 'error', message: 'Time must be during business hours' }" />
    <TimeInput v-model="warningVal" label="Warning message" :status="{ type: 'warning', message: 'Early morning — are you sure?' }" />
    <TimeInput v-model="successVal" label="Success message" :status="{ type: 'success', message: 'Time slot is available' }" />
  </VStack>
</template>
