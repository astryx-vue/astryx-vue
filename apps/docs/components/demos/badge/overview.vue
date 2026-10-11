<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <div class="overview-stack">
    <div class="overview-row">
      <Badge variant="neutral">
        Neutral
      </Badge>
      <Badge variant="info">
        Info
      </Badge>
      <Badge variant="success">
        Success
      </Badge>
      <Badge variant="warning">
        Warning
      </Badge>
      <Badge variant="error">
        Error
      </Badge>
    </div>
    <div class="overview-row">
      <Badge variant="blue">
        Blue
      </Badge>
      <Badge variant="purple">
        Purple
      </Badge>
      <Badge variant="pink">
        Pink
      </Badge>
      <Badge variant="teal">
        Teal
      </Badge>
      <Badge variant="orange">
        Orange
      </Badge>
    </div>
  </div>
</template>
