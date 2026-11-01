<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()
provideAstryxLocale(computed(() => page.value.relativePath.startsWith('en/') ? 'en' : 'zh-CN'))
</script>

<template>
  <Content />
</template>
