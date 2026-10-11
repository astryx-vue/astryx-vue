<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const removed = ref(false)
const { pick } = useDemoText()

function remove(): void {
  removed.value = true
}
</script>

<template>
  <div class="demo-container">
    <Token v-if="!removed" :label="pick('设计评审', 'Design review')" color="blue" removable @remove="remove">
      <template #icon>
        <span class="demo-icon" aria-hidden="true">#</span>
      </template>
    </Token>
    <p v-else class="demo-result">
      {{ pick('标签已删除', 'Token removed') }}
    </p>
    <Token :label="pick('已锁定', 'Locked')" disabled removable />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
.demo-icon {
  font-weight: 700;
}
.demo-result {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
