<script setup lang="ts">
/**
 * @file TabBarMoreList.vue
 * @input TabBarItem 子节点；core 的 List、Icon、Badge、VisuallyHidden；TabBar 的读标签小工具
 * @output TabBarMoreList：「更多」标签的那一屏，列出第四个之后的标签（UIKit 的 `UIMoreListController`）
 * @position lab 组件：TabBar 的「更多」标签的屏幕
 */
import type { TabBarMoreListEmits, TabBarMoreListProps, TabBarMoreListSlots } from '../TabBar/types'
import { Badge, Icon, List, ListItem, VisuallyHidden } from '@astryx-vue/core'
import { computed } from 'vue'
import { useTabBarMessages } from '../TabBar/messages'
import { badgedName, hasBadge, isDisabledItem, overflowItems, readItems } from '../TabBar/TabBarItem'

defineOptions({ name: 'AstryxTabBarMoreList' })

const props = withDefaults(defineProps<TabBarMoreListProps>(), { modelValue: undefined })
const emit = defineEmits<TabBarMoreListEmits>()
const slots = defineSlots<TabBarMoreListSlots>()
const messages = useTabBarMessages()

const rows = computed(() => overflowItems(readItems(slots.default?.())).map(item => ({
  item,
  name: badgedName(item, messages.value.badgedItem),
})))

function choose(value: string): void {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <List :aria-label="messages.more" has-dividers>
    <ListItem
      v-for="{ item, name } in rows"
      :key="item.value"
      :is-selected="item.value === props.modelValue"
      :is-disabled="isDisabledItem(item)"
      @click="choose(item.value)"
    >
      <template #label>
        <template v-if="name == null">
          {{ item.label }}
        </template>
        <!-- 带角标的行和它的标签念法一样：一条文案里同时有名字和角标。 -->
        <template v-else>
          <span aria-hidden="true">{{ item.label }}</span>
          <VisuallyHidden>{{ name }}</VisuallyHidden>
        </template>
      </template>
      <template v-if="item.icon" #startContent>
        <Icon v-if="typeof item.icon === 'string'" :icon="item.icon" />
        <component :is="item.icon" v-else />
      </template>
      <template #endContent>
        <Badge v-if="hasBadge(item.badge)" variant="error" :label="item.badge" aria-hidden="true" />
        <!-- 从右往左时指向左边，和 core 展开类行的箭头一样。 -->
        <Icon icon="chevronRight" class="astryx-tab-bar-more-list__chevron" />
      </template>
    </ListItem>
  </List>
</template>
