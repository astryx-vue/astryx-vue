<script setup lang="ts">
import { useFocusTrap, useScrollLock } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Link } from '@astryx-vue/core/Link'
import { VStack } from '@astryx-vue/core/Stack'
import { ref, watch } from 'vue'

const MENU_ITEMS = ['Products', 'Pricing', 'Customers', 'Support']

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function menu(): HTMLDialogElement | null {
  return menuRef.value as HTMLDialogElement | null
}

useScrollLock(isOpen)
const { focusFirst } = useFocusTrap({ container: menuRef, isActive: isOpen, onEscape: close })

// 先让对话框离开顶层再改状态，焦点陷阱把焦点还给 Menu 时页面已经不是 inert。
function close(): void {
  menu()?.close()
  isOpen.value = false
}

function onCancel(event: Event): void {
  event.preventDefault()
  close()
}

watch(isOpen, (open) => {
  const dialog = menu()
  if (open && dialog != null && !dialog.open) {
    dialog.showModal()
    focusFirst()
  }
}, { flush: 'post' })
</script>

<template>
  <Button label="Menu" @click="isOpen = true" />
  <dialog ref="menuRef" class="mobile-menu" aria-label="Menu" @cancel="onCancel">
    <nav aria-label="Site menu">
      <VStack :gap="4" h-align="start">
        <Button label="Close menu" variant="secondary" @click="close" />
        <Link v-for="item in MENU_ITEMS" :key="item" :href="`#menu-${item.toLowerCase()}`" @click="close">
          {{ item }}
        </Link>
      </VStack>
    </nav>
  </dialog>
</template>

<style scoped>
.mobile-menu {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: var(--astryx-spacing-4, 16px);
  border: 0;
  overflow-y: auto;
  color: var(--astryx-color-text-primary, #171717);
  background-color: var(--astryx-color-background-surface, #fff);
}
</style>
