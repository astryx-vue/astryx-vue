<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<string[]>([])
const { pick } = useDemoText()
const options = computed(() => [
  pick('设计', 'Design'),
  pick('工程', 'Engineering'),
  pick('市场', 'Marketing'),
  pick('运营', 'Operations'),
])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="options"
      :label="pick('团队', 'Teams')"
      :placeholder="pick('选择团队', 'Choose teams')"
      presentation="bottom-sheet"
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
