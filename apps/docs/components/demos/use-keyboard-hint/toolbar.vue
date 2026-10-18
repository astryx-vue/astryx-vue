<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useKeyboardHint, useListFocus } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Text } from '@astryx-vue/core/Text'

const actions = ['Bold', 'Italic', 'Underline', 'Strikethrough']

const list = useListFocus({
  itemSelector: '[data-hint-item]',
  orientation: 'horizontal',
  hasRovingTabIndex: true,
})
const hint = useKeyboardHint({ orientation: 'horizontal' })

// 模板引用写进 hook 的 listRef，listRef 只由 hook 持有。
function bindList(el: Element | ComponentPublicInstance | null): void {
  list.listRef.value = el instanceof HTMLElement ? el : null
}

function onFocus(event: FocusEvent): void {
  hint.onFocus(event)
}

function onBlur(event: FocusEvent): void {
  hint.onBlur(event)
}

function onKeyDown(event: KeyboardEvent): void {
  hint.onKeyDown(event)
  list.handleKeyDown(event)
}
</script>

<template>
  <div class="hint-preview">
    <Text type="supporting" color="secondary">
      {{ 'Tab into the group, then press the arrow keys.' }}
    </Text>
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role="toolbar" 的焦点停在内部按钮上，容器只接冒泡上来的焦点与方向键。 -->
    <div
      :ref="bindList"
      class="hint-preview__group"
      role="toolbar"
      aria-label="Text formatting"
      @focusin="onFocus"
      @focusout="onBlur"
      @keydown="onKeyDown"
    >
      <Button
        v-for="action in actions"
        :key="action"
        :label="action"
        data-hint-item
        size="sm"
        variant="ghost"
      />
      <component :is="hint.Hint" />
    </div>
  </div>
</template>

<style scoped>
.hint-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.hint-preview__group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-container, 0.75rem);
  background: var(--astryx-color-background-surface);
}
</style>
