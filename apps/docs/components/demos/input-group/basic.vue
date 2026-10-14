<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref, useId } from 'vue'

const price = ref('')
const inputId = `price-${useId()}`
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <Field :input-id="inputId" label="Price">
      <InputGroup>
        <template #before>
          $
        </template>
        <TextInput :id="inputId" v-model="price" label="Amount" is-label-hidden placeholder="0.00" />
        <template #after>
          USD
        </template>
      </InputGroup>
    </Field>
  </div>
</template>
