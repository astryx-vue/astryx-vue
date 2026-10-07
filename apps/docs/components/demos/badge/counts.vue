<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <div class="badge-preview__count">
    <Badge variant="info">
      3
    </Badge>
    <span>Messages</span>
  </div>
  <div class="badge-preview__count">
    <Badge variant="error">
      99+
    </Badge>
    <span>Alerts</span>
  </div>
  <div class="badge-preview__count">
    <Badge variant="success">
      12
    </Badge>
    <span>Completed</span>
  </div>
  <div class="badge-preview__count">
    <Badge variant="warning">
      5
    </Badge>
    <span>Pending</span>
  </div>
</template>
