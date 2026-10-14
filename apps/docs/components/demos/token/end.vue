<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <div class="demo-row">
    <Token label="Inbox" color="blue">
      <template #end>
        <Badge variant="info">
          12
        </Badge>
      </template>
    </Token>
    <Token label="Reviews" color="purple">
      <template #end>
        <Badge variant="purple">
          3
        </Badge>
      </template>
    </Token>
    <Token label="Resolved" color="green">
      <template #end>
        <Badge variant="success">
          {{ 'Done' }}
        </Badge>
      </template>
    </Token>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>
