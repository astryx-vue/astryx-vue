<script setup lang="ts">
import { provide } from 'vue'
import { mobileNavCloseKey, mobileNavKey } from './context.js'

defineOptions({ name: 'AstryxMobileNavScope' })

const props = defineProps<{ close: () => void }>()

// 内容被 Teleport 进外壳的抽屉时，它的组件祖先不是 MobileNav；这一层让它也认得自己在抽屉里。
provide(mobileNavKey, true)
provide(mobileNavCloseKey, () => props.close())
</script>

<template>
  <slot />
</template>
