<script setup lang="ts">
/**
 * @file TabBar.vue
 * @input TabBarItem 子节点；core 的 Icon、列表焦点和文案；TabBar 的触屏层（useTabBarLens.ts）、
 *   CSS 几何（tabBarGeometry.ts）和面板滚动（panelScroll.ts）
 * @output TabBar：iOS 26 的浮动标签栏
 * @position lab 组件：app 顶层分区在手机上的呈现，对应 UITabBarController
 *
 * 布局全在 CSS 里，所以水合前和改尺寸时都是对的。每个按钮铺到和邻居的中点，按在哪都落到最近
 * 的项上。透镜在手指下移动时，里面带着一份项的副本，所以半个项在透镜下就半个项着色。标签超过
 * 五个时，「更多」占第五格，按五个标签的布局排，和 UITabBarController 一样。
 */
import type { TabBarEmits, TabBarItemProps, TabBarProps, TabBarSlots } from './types'
import { Icon, useCoarsePointer, useListFocus } from '@astryx-vue/core'
import { computed, h, shallowRef, useId } from 'vue'
import { useTabBarMessages } from './messages'
import { scrollPanelToTop } from './panelScroll'
import { center, column, lensOffset, px, SIZE_VARIABLES, SIZES } from './tabBarGeometry'
import { badgedName, hasBadge, isDisabledItem, MAX_TABS, overflowItems, readItems } from './TabBarItem'
import TabBarItemFace from './TabBarItemFace.vue'
import { itemWidthCss, naturalWidth } from './tabBarModel'
import { useTabBarLens } from './useTabBarLens'

defineOptions({ name: 'AstryxTabBar' })

const props = withDefaults(defineProps<TabBarProps>(), {
  label: undefined,
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  moreValue: 'more',
})
const emit = defineEmits<TabBarEmits>()
const slots = defineSlots<TabBarSlots>()
const messages = useTabBarMessages()

// 标签列表总有名字；aria 命名 props 落在标签列表上，不在根元素上，和 TabList 一样。
const tabListLabel = computed(() => props.ariaLabelledby != null
  ? undefined
  : (props.ariaLabel ?? props.label ?? messages.value.tabListLabel))

const allItems = computed(() => readItems(slots.default?.()))
const overflow = computed(() => overflowItems(allItems.value))
const hasMore = computed(() => overflow.value.length > 0)
const moreIcon = (): ReturnType<typeof h> => h(Icon, { icon: 'moreHorizontal', size: 'lg' })
// UITabBarController 超过五个标签时显示前四个和「更多」。
const items = computed<TabBarItemProps[]>(() => hasMore.value
  ? [...allItems.value.slice(0, MAX_TABS - 1), { value: props.moreValue, label: messages.value.more, icon: moreIcon }]
  : allItems.value)
const count = computed(() => items.value.length)
// iOS 在「更多」显示它里面的某个标签时，仍然让「更多」显示为选中。
const isMoreSelected = computed(() => hasMore.value
  && (props.modelValue === props.moreValue || overflow.value.some(item => item.value === props.modelValue)))
const selectedIndex = computed(() => isMoreSelected.value
  ? MAX_TABS - 1
  : items.value.findIndex(item => item.value === props.modelValue))
const baseId = useId()

// UIKit 的动效属于手指（主指针是粗指针，iOS 和 Android 一样）。细指针下按压就是普通的按钮点击，
// 透镜用主题的动效。
const isTouch = useCoarsePointer()

const capsule = shallowRef<HTMLElement | null>(null)
const { listRef, handleKeyDown, handleFocus } = useListFocus({
  itemSelector: '[role="tab"]',
  orientation: 'horizontal',
  hasRovingTabIndex: true,
})

function choose(item: TabBarItemProps | undefined): void {
  if (item == null || isDisabledItem(item))
    return
  // 「更多」显示着它里面的标签时再点它，回到它的列表，像 iOS 退回「更多」的导航栈：算再次选中。
  // 只有选中的标签会滚它的面板。
  if (item.value === props.modelValue || (item.value === props.moreValue && isMoreSelected.value)) {
    const document = capsule.value?.ownerDocument
    if (item.value === props.modelValue && document != null)
      scrollPanelToTop(document, item.panelId)
    emit('reselect', item.value)
    return
  }
  emit('update:modelValue', item.value)
  emit('change', item.value)
}

const lens = useTabBarLens({
  capsule,
  count: () => count.value,
  selectedIndex: () => selectedIndex.value,
  isTouch: () => isTouch.value,
  onLift: index => choose(items.value[index]),
  isDisabled: index => isDisabledItem(items.value[index]),
})

function capsuleRef(element: unknown): void {
  const node = element instanceof HTMLElement ? element : null
  capsule.value = node
  listRef.value = node
  lens.capsuleRef(node)
}

const itemSize = computed(() => `calc(${itemWidthCss(count.value)})`)
const restOffset = computed(() => lensOffset(Math.max(selectedIndex.value, 0), count.value))

const rootStyle = computed(() => ({ ...SIZE_VARIABLES, '--_tab-bar-lens-offset': restOffset.value }))
const capsuleStyle = computed(() => ({ height: SIZES.barHeight, maxWidth: px(naturalWidth(count.value)) }))
function boxStyle(start: string): Record<string, string> {
  return {
    insetInlineStart: start,
    top: SIZES.itemInset,
    width: itemSize.value,
    height: SIZES.itemHeight,
  }
}
function columnStyle(index: number): Record<string, string> {
  const { start, width } = column(index, count.value)
  return { insetInlineStart: start, width }
}
function copyItemStyle(index: number): Record<string, string> {
  return boxStyle(`calc(${center(index, count.value)} - ${itemWidthCss(count.value)} / 2)`)
}
function badgeStyle(index: number): Record<string, string> {
  return {
    insetInlineStart: `calc(${center(index, count.value)} + ${SIZES.badgeOffsetX})`,
  }
}

function badgedLabel(item: TabBarItemProps): string | undefined {
  return badgedName(item, messages.value.badgedItem)
}

function tabIndexOf(index: number): 0 | -1 {
  return index === selectedIndex.value || (selectedIndex.value < 0 && index === 0) ? 0 : -1
}
</script>

<template>
  <div
    class="astryx-tab-bar"
    :style="rootStyle"
  >
    <!-- eslint-disable-next-line vue-a11y/interactive-supports-focus -- 焦点停在里面的标签上（漫游 tabindex），列表本身不进 Tab 序。 -->
    <div
      :ref="capsuleRef"
      role="tablist"
      class="astryx-tab-bar__capsule"
      :style="capsuleStyle"
      :aria-label="tabListLabel"
      :aria-labelledby="ariaLabelledby"
      aria-orientation="horizontal"
      @keydown="handleKeyDown"
      @focusin="handleFocus"
    >
      <button
        v-for="(item, index) in items"
        :id="`${baseId}-tab-${index}`"
        :key="item.value"
        type="button"
        role="tab"
        class="astryx-tab-bar-item"
        :style="columnStyle(index)"
        :aria-selected="index === selectedIndex"
        :aria-disabled="isDisabledItem(item) || undefined"
        :aria-controls="item.panelId"
        :aria-label="badgedLabel(item)"
        :tabindex="tabIndexOf(index)"
        :data-selected="index === selectedIndex ? 'selected' : undefined"
        :data-tab-bar-value="item.value"
        @click="choose(item)"
      >
        <span
          class="astryx-tab-bar__item-box"
          :class="{
            'astryx-tab-bar__item-box--selected': index === selectedIndex && !lens.isCopyShown.value,
            'astryx-tab-bar__item-box--disabled': isDisabledItem(item),
          }"
          :style="boxStyle(column(index, count).itemStart)"
        >
          <TabBarItemFace :item="item" :is-selected-look="index === selectedIndex && !isDisabledItem(item) && !lens.isCopyShown.value" />
        </span>
      </button>
      <div
        v-if="selectedIndex >= 0"
        aria-hidden="true"
        data-tab-bar-lens=""
        class="astryx-tab-bar__lens"
        :class="{ 'astryx-tab-bar__lens--under': !lens.isCopyShown.value }"
        :style="boxStyle(SIZES.itemInset)"
      >
        <div :ref="lens.bodyRef" data-tab-bar-lens-body="" class="astryx-tab-bar__lens-body">
          <div :ref="lens.clipRef" data-tab-bar-lens-clip="" class="astryx-tab-bar__lens-clip">
            <div v-if="lens.isCopyShown.value" :ref="lens.copyRef" data-tab-bar-copy="" class="astryx-tab-bar__copy">
              <div class="astryx-tab-bar__copy-outer" :style="{ height: SIZES.barHeight }">
                <span
                  v-for="(item, index) in items"
                  :key="item.value"
                  :ref="lens.copyItemRef(index)"
                  :data-tab-bar-copy-item="item.value"
                  class="astryx-tab-bar__copy-item"
                  :class="{ 'astryx-tab-bar__item-box--disabled': isDisabledItem(item) }"
                  :style="copyItemStyle(index)"
                >
                  <TabBarItemFace :item="item" :is-selected-look="!isDisabledItem(item)" is-copy />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" class="astryx-tab-bar__badges">
        <template v-for="(item, index) in items" :key="item.value">
          <span
            v-if="hasBadge(item.badge)"
            :data-tab-bar-badge="item.value"
            class="astryx-tab-bar__badge"
            :style="badgeStyle(index)"
          >{{ item.badge }}</span>
        </template>
      </div>
    </div>
  </div>
</template>
