<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid :columns="2" :gap="2">
    <div class="grid-preview__tile">
      Users
    </div>
    <div class="grid-preview__tile">
      Sessions
    </div>
    <div class="grid-preview__tile">
      Retention
    </div>
    <div class="grid-preview__tile">
      Revenue
    </div>
  </Grid>
</template>
