<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { shallowRef, useId } from 'vue'

const confidence = shallowRef(70)
const inputId = `confidence-${useId()}`
</script>

<template>
  <div class="input-preview-stack">
    <Field :input-id="inputId" label="Confidence" description="Choose how strict the review should be." is-optional :status="{ type: 'success', message: 'Recommended range: 60–80.' }" status-variant="detached">
      <template #default="field">
        <div class="input-preview-range">
          <input :id="field.inputId" v-model.number="confidence" type="range" min="0" max="100" :aria-labelledby="field.labelId" :aria-describedby="field.describedBy">
          <output :for="field.inputId" aria-label="Current confidence">{{ confidence }}%</output>
        </div>
      </template>
    </Field>
  </div>
</template>
