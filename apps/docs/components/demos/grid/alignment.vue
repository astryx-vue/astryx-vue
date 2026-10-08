<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
</script>

<template>
  <div class="grid-preview__sections">
    <section class="grid-preview__section">
      <span class="grid-preview__caption">align="center" keeps items centered in their row</span>
      <Grid :columns="3" :gap="3" align="center">
        <div class="grid-preview__tile">
          Short
        </div>
        <div class="grid-preview__tile grid-preview__tile--tall">
          Tall
        </div>
        <div class="grid-preview__tile">
          Short
        </div>
      </Grid>
    </section>
    <section class="grid-preview__section">
      <span class="grid-preview__caption">justify="start" lets items keep their own width</span>
      <Grid :columns="3" :gap="3" justify="start">
        <div class="grid-preview__tile">
          One
        </div>
        <div class="grid-preview__tile">
          Two
        </div>
        <div class="grid-preview__tile">
          Three
        </div>
      </Grid>
    </section>
  </div>
</template>
