<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <div class="demo-row">
    <Token :label="pick('缺陷', 'Bug')" color="red" @click="() => {}" />
    <Token :label="pick('功能', 'Feature')" color="blue" @click="() => {}" />
    <Token :label="pick('改进', 'Enhancement')" color="green" @click="() => {}" />
    <Token :label="pick('文档', 'Documentation')" color="gray" @click="() => {}" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
