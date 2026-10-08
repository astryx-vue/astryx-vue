<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const snippet = `type Shipment = {
  id: string
  weightKg: number
}

export function totalWeight(shipments: Shipment[]): number {
  return shipments.reduce((total, item) => total + item.weightKg, 0)
}`
</script>

<template>
  <div class="code-preview__stack">
    <CodeBlock :code="snippet" language="typescript" title="shipping.ts" />
  </div>
</template>
