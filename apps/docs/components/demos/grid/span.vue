<script setup lang="ts">
import { Grid, GridSpan } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid class="grid-preview__grid" :columns="4" :gap="3">
    <GridSpan :columns="2">
      <div class="grid-preview__tile">
        Spans 2 columns
      </div>
    </GridSpan>
    <div class="grid-preview__tile">
      Item
    </div>
    <div class="grid-preview__tile">
      Item
    </div>
    <GridSpan columns="full">
      <div class="grid-preview__tile grid-preview__tile--accent">
        Spans the full row
      </div>
    </GridSpan>
    <div class="grid-preview__tile">
      Item
    </div>
    <div class="grid-preview__tile">
      Item
    </div>
  </Grid>
</template>
