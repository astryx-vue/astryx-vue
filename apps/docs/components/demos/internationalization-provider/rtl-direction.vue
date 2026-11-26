<script setup lang="ts">
import { getLocaleDirection, InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'

const locale = 'ar-SA'
const dir = getLocaleDirection(locale)
const page = ref(2)
</script>

<template>
  <div class="internationalization-provider-preview">
    <InternationalizationProvider :locale="locale" :dir="dir">
      <div :dir="dir">
        <Pagination v-model:page="page" :page-size="10" :total="50" />
      </div>
    </InternationalizationProvider>
  </div>
</template>
