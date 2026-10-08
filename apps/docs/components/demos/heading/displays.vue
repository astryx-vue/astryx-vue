<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <div class="heading-preview__stack">
    <Heading :level="1" type="display-1">
      Display 1
    </Heading>
    <Heading :level="2" type="display-2">
      Display 2
    </Heading>
    <Heading :level="3" type="display-3">
      Display 3
    </Heading>
  </div>
</template>
