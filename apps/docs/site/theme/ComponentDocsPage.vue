<script setup lang="ts">
// `layout: component-docs`: the component reference shell around the page.
import { RouterView, useRoute } from 'kawapress/client'
import { computed } from 'vue'
import { parseComponentDocsRoute } from '../../components/demo-infra/componentDocsRoute'
import ComponentDocsShell from '../../components/demo-infra/ComponentDocsShell.vue'

const route = useRoute()
const componentRoute = computed(() => parseComponentDocsRoute(route.value.path))
</script>

<template>
  <ComponentDocsShell v-if="componentRoute" :route="componentRoute">
    <RouterView />
  </ComponentDocsShell>
  <RouterView v-else />
</template>
