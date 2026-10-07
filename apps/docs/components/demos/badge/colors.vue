<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <div class="badge-preview__group">
    <span class="badge-preview__label">Team</span>
    <div class="badge-preview__badges">
      <Badge variant="blue">
        Design
      </Badge>
      <Badge variant="cyan">
        DevOps
      </Badge>
      <Badge variant="green">
        Backend
      </Badge>
      <Badge variant="pink">
        Marketing
      </Badge>
      <Badge variant="purple">
        Engineering
      </Badge>
      <Badge variant="teal">
        Research
      </Badge>
    </div>
  </div>
  <div class="badge-preview__group">
    <span class="badge-preview__label">Priority</span>
    <div class="badge-preview__badges">
      <Badge variant="orange">
        Urgent
      </Badge>
      <Badge variant="red">
        Critical
      </Badge>
      <Badge variant="yellow">
        Review
      </Badge>
    </div>
  </div>
</template>
