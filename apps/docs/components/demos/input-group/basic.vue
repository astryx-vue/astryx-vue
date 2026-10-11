<script setup lang="ts">
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const domain = ref('')
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-container">
    <InputGroup>
      <template #before>
        <span>https://</span>
      </template>
      <TextInput v-model="domain" :label="pick('域名', 'Domain')" is-label-hidden placeholder="example" />
      <template #after>
        <span>.com</span>
      </template>
    </InputGroup>
  </div>
</template>

<style scoped>
.demo-container {
  width: min(100%, 24rem);
}
</style>
