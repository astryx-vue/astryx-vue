---
title: vt2
aside: false
---

<script setup lang="ts">
import { ref } from 'vue'
import { Theme, MediaTheme, neutralTheme } from '@astryx-vue/core/Theme'
const initial = typeof location !== 'undefined' && location.search.includes('dark') ? 'dark' : 'light'
const mode = ref<'light' | 'dark'>(initial)
;(globalThis as any).__setMode = (m: 'light' | 'dark') => { mode.value = m }
</script>

<Theme :theme="neutralTheme" :mode="mode" id="th">
  <div id="m-dark" style="background:rgb(10,19,23);padding:16px"><MediaTheme mode="auto"><span class="probe">x</span></MediaTheme></div>
  <div id="m-light" style="background:rgb(250,250,250);padding:16px"><MediaTheme mode="auto"><span class="probe">x</span></MediaTheme></div>
</Theme>
