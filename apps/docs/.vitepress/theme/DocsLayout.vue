<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'

const { page } = useData()
// 演示里的组件需要知道当前语言；放在布局层提供一次，所有页面都能用上默认文档布局。
provideAstryxLocale(computed(() => page.value.relativePath.startsWith('en/') ? 'en' : 'zh-CN'))
</script>

<template>
  <DefaultTheme.Layout />
</template>
