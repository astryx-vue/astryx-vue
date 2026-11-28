<script setup lang="ts">
import { PageControl } from '@astryx-vue/lab'
import { computed, ref } from 'vue'

const slides = ['#5b8def', '#f2a541', '#3fb27f', '#d9577b', '#8a6be0']
const page = ref(1)
const color = computed(() => slides[page.value - 1])

const longPage = ref(26)
</script>

<template>
  <div class="page-control-demo">
    <div class="page-control-demo__slide" :style="{ backgroundColor: color }">
      {{ page }} / {{ slides.length }}
    </div>
    <PageControl v-model:page="page" :total-pages="slides.length" />
    <PageControl v-model:page="longPage" :total-pages="50" label="Long row" />
  </div>
</template>

<style scoped>
.page-control-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #1c1c1e;
}

.page-control-demo__slide {
  display: grid;
  place-items: center;
  width: 240px;
  height: 140px;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  transition: background-color 200ms;
}
</style>
