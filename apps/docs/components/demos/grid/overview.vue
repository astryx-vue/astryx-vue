<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid :columns="3" :gap="2" :width="400">
    <Card v-for="i in 12" :key="i">
      Item {{ i }}
    </Card>
  </Grid>
</template>
