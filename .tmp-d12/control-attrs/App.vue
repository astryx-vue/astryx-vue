<script setup lang="ts">
import { ref } from 'vue'
import DropdownMenu from '../../packages/core/src/DropdownMenu/DropdownMenu.vue'
import DropdownMenuRadioGroup from '../../packages/core/src/DropdownMenu/DropdownMenuRadioGroup.vue'
import DropdownMenuRadioItem from '../../packages/core/src/DropdownMenu/DropdownMenuRadioItem.vue'
import Text from '../../packages/core/src/Text/Text.vue'

const long = ref(false)
const sort = ref('newest')
const text = ref('Short status')
function changeText() {
  long.value = !long.value
  text.value = long.value
    ? 'A much longer current status that cannot fit inside the fixed width'
    : 'Short status'
}
</script>

<template>
  <main style="padding: 80px 24px; font-family: sans-serif">
    <h1>Control checks</h1>
    <button id="change-text" type="button" @click="changeText">Change status</button>
    <div style="width: 120px; margin-top: 24px">
      <Text id="status-text" :max-lines="1">{{ text }}</Text>
    </div>

    <span id="sort-label" style="display: block; margin: 48px 0 8px">Visible sort label</span>
    <DropdownMenu :button="{ label: 'Sort' }">
      <DropdownMenuRadioGroup
        v-model="sort"
        label="Sort fallback"
        aria-labelledby="sort-label"
        data-owner="consumer"
        class="consumer-group"
        style="inline-size: 240px"
      >
        <DropdownMenuRadioItem value="newest" label="Newest" />
        <DropdownMenuRadioItem value="oldest" label="Oldest" />
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  </main>
</template>
