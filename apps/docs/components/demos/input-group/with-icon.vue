<script setup lang="ts">
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const username = ref('')
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-container">
    <InputGroup>
      <template #before>
        <span>@</span>
      </template>
      <TextInput v-model="username" :label="pick('用户名', 'Username')" is-label-hidden :placeholder="pick('用户名', 'Username')" />
    </InputGroup>
  </div>
</template>

<style scoped>
.demo-container {
  width: min(100%, 24rem);
}
</style>
