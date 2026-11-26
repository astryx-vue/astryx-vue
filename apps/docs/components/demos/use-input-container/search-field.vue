<script setup lang="ts">
import { useInputContainer } from '@astryx-vue/core'
import { InputClearButton } from '@astryx-vue/core/Field'
import { Icon } from '@astryx-vue/core/Icon'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLElement | null>(null)
const query = ref('')

const { onClick, onMouseUp } = useInputContainer({ containerRef, inputRef })

function clear(): void {
  query.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 外圈的点击只是把焦点交给里面的输入框，键盘用户直接 Tab 到输入框。 -->
  <div ref="containerRef" class="search-field" @click="onClick" @mouseup="onMouseUp">
    <Icon icon="search" color="secondary" />
    <input
      ref="inputRef"
      v-model="query"
      class="search-field__input"
      type="text"
      aria-label="Search"
      placeholder="Search"
    >
    <InputClearButton v-if="query !== ''" label="Clear search" @click="clear" />
  </div>
</template>

<style scoped>
.search-field {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--astryx-spacing-2, 8px);
  width: 320px;
  min-height: 40px;
  padding-inline: var(--astryx-spacing-3, 12px);
  border: 1px solid var(--astryx-color-border-emphasized, #a3a3a3);
  border-radius: var(--astryx-radius-element, 0.625rem);
  cursor: text;
}

.search-field:has(> input:focus-visible) {
  outline: var(--astryx-focus-outline-width, 2px) var(--astryx-focus-outline-style, solid) var(--astryx-focus-outline-color, #262626);
  outline-offset: var(--astryx-focus-outline-offset, 0);
}

.search-field__input {
  flex-grow: 1;
  min-width: 0;
  border: none;
  outline: none;
  color: inherit;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
}
</style>
