<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<string[]>([])
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="[
        pick('美国', 'United States'),
        pick('英国', 'United Kingdom'),
        pick('加拿大', 'Canada'),
        pick('澳大利亚', 'Australia'),
        pick('德国', 'Germany'),
        pick('法国', 'France'),
        pick('日本', 'Japan'),
        pick('巴西', 'Brazil'),
        pick('印度', 'India'),
        pick('墨西哥', 'Mexico'),
      ]"
      :label="pick('国家', 'Countries')"
      :placeholder="pick('选择国家', 'Select countries...')"
      searchable
      select-all
    />
  </div>
</template>

<style scoped>
.demo-field {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
