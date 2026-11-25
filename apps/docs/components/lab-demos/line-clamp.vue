<script setup lang="ts">
import { LineClamp } from '@astryx-vue/lab'
</script>

<template>
  <div style="max-width: 320px">
    <LineClamp :max-lines="2">
      The <strong>quarterly review</strong> covers revenue by region, hiring against plan,
      and the open risks for next quarter. Read the <a href="#appendix">full appendix</a>
      for the raw numbers behind each chart.
    </LineClamp>
  </div>
</template>
