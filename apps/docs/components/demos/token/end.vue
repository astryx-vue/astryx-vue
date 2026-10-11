<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Token } from '@astryx-vue/core/Token'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <div class="demo-row">
    <Token :label="pick('收件箱', 'Inbox')" color="blue">
      <template #end><Badge variant="info">12</Badge></template>
    </Token>
    <Token :label="pick('评审', 'Reviews')" color="purple">
      <template #end><Badge variant="purple">3</Badge></template>
    </Token>
    <Token :label="pick('已解决', 'Resolved')" color="green">
      <template #end><Badge variant="success">{{ pick('完成', 'Done') }}</Badge></template>
    </Token>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>
