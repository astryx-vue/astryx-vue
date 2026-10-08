<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'

const items = ['One', 'Two', 'Three', 'Four']
</script>

<template>
  <div class="grid-preview__sections">
    <section class="grid-preview__section">
      <span class="grid-preview__caption">columns="2"</span>
      <Grid :columns="2" :gap="3">
        <div v-for="item in items" :key="item" class="grid-preview__tile">
          {{ item }}
        </div>
      </Grid>
    </section>
    <section class="grid-preview__section">
      <span class="grid-preview__caption">columns="4"</span>
      <Grid :columns="4" :gap="3">
        <div v-for="item in items" :key="item" class="grid-preview__tile">
          {{ item }}
        </div>
      </Grid>
    </section>
  </div>
</template>
