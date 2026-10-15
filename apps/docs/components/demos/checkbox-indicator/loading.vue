<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
import { CheckIndicator } from '@astryx-vue/core/Indicator'
import { ref } from 'vue'

const busy = ref(true)
</script>

<template>
  <div class="indicator-board">
    <div class="indicator-board-row">
      <span class="indicator-board-item">
        <CheckboxIndicator state="checked">
          <span v-if="busy" class="indicator-spinner" />
        </CheckboxIndicator>
        <span>Checkbox</span>
      </span>
      <span class="indicator-board-item">
        <CheckIndicator state="unchecked">
          <span v-if="busy" class="indicator-spinner" />
        </CheckIndicator>
        <span>Check</span>
      </span>
      <Button size="sm" variant="secondary" :label="busy ? 'Show marks' : 'Show spinner'" @click="busy = !busy" />
    </div>
  </div>
</template>
