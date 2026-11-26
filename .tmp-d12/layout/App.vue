<script setup lang="ts">
import AspectRatio from '../../packages/core/src/AspectRatio/AspectRatio.vue'
import EmptyState from '../../packages/core/src/EmptyState/EmptyState.vue'
import Field from '../../packages/core/src/Field/Field.vue'
import FormLayout from '../../packages/core/src/FormLayout/FormLayout.vue'
import Grid from '../../packages/core/src/Grid/Grid.vue'
import GridSpan from '../../packages/core/src/Grid/GridSpan.vue'
import MetadataList from '../../packages/core/src/MetadataList/MetadataList.vue'
import MetadataListItem from '../../packages/core/src/MetadataList/MetadataListItem.vue'

const image = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%236366f1'/%3E%3C/svg%3E"
</script>

<template>
  <main style="padding: 24px">
    <h1>Layout checks</h1>

    <section id="empty-section" class="demo-box">
      <h2>Empty optional content</h2>
      <EmptyState title="No results" description="">
        <template #icon><svg v-if="false" /></template>
        <template #actions><button v-if="false">Retry</button></template>
      </EmptyState>
    </section>

    <section id="field-section" class="demo-box">
      <h2>Horizontal field</h2>
      <FormLayout direction="horizontal-labels">
        <Field
          label="Name"
          input-id="name"
          description="Helpful context"
          data-layout="consumer"
        >
          <input id="name" value="Ada" aria-label="Name">
        </Field>
      </FormLayout>
    </section>

    <section id="metadata-section" class="demo-box">
      <h2>Metadata</h2>
      <MetadataList :label="{ width: 120 }">
        <MetadataListItem label="Identifier">
          <span class="long-content">a-very-long-identifier-that-must-stay-within-its-value-column</span>
        </MetadataListItem>
        <MetadataListItem label="Status">Active</MetadataListItem>
      </MetadataList>
    </section>

    <section id="aspect-section" class="demo-box">
      <h2>Aspect ratio with preflight</h2>
      <div style="width: 320px">
        <AspectRatio :ratio="16 / 9" fit="cover">
          <img id="fitted-image" :src="image" alt="">
        </AspectRatio>
      </div>
    </section>

    <section id="grid-section" class="demo-box">
      <h2>Fixed grid with long content</h2>
      <Grid id="fixed-grid" :columns="3" :gap="4">
        <GridSpan><div class="long-content">short</div></GridSpan>
        <GridSpan><div class="long-content">a-very-long-token-that-must-not-widen-its-grid-column</div></GridSpan>
        <GridSpan><div class="long-content">third</div></GridSpan>
      </Grid>
      <h2>Responsive grid</h2>
      <Grid id="responsive-grid" :columns="{ minWidth: 180, max: 3 }" :gap="4">
        <GridSpan v-for="index in 4" :key="index"><div>Item {{ index }}</div></GridSpan>
      </Grid>
    </section>
  </main>
</template>
