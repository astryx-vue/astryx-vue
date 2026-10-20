<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid, GridSpan } from '@astryx-vue/core/Grid'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Grid :columns="3" :gap="3" width="100%">
    <GridSpan :columns="2">
      <Card :height="80">
        <Text type="body" color="secondary">
          Spans 2 columns
        </Text>
      </Card>
    </GridSpan>
    <Card :height="80">
      <Text type="body" color="secondary">
        1 col
      </Text>
    </Card>
    <Card :height="80">
      <Text type="body" color="secondary">
        1 col
      </Text>
    </Card>
    <GridSpan :columns="2">
      <Card :height="80">
        <Text type="body" color="secondary">
          Spans 2 columns
        </Text>
      </Card>
    </GridSpan>
  </Grid>
</template>
