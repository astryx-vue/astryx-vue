import type { InjectionKey } from 'vue'
import { computed, provide } from 'vue'
import { AvatarSizeContext } from '../Avatar/context.js'
import { AvatarGroupContext } from '../AvatarGroup/context.js'
import { breadcrumbContextKey } from '../Breadcrumbs/context.js'
import { buttonGroupContextKey } from '../Button/context.js'
import { chatListContextKey, chatMessageContextKey } from '../Chat/context.js'
import { checkboxListKey } from '../CheckboxList/context.js'
import { collapsibleGroupKey, collapsibleGroupPresentationKey } from '../Collapsible/context.js'
import { formLayoutKey } from '../FormLayout/context.js'
import { ICON_DEFAULT_SIZE_KEY } from '../Icon/context.js'
import { INPUT_GROUP_KEY } from '../InputGroup/context.js'
import { emptyLayoutSlots, layoutAreaKey, layoutDividerKey, layoutSlotsKey } from '../Layout/context.js'
import { listContextKey } from '../List/context.js'
import { metadataListKey } from '../MetadataList/context.js'
import { navMenuKey } from '../NavMenu/context.js'
import { radioContextKey } from '../Radio/types.js'
import { segmentedControlContextKey } from '../SegmentedControl/context.js'
import { stepperContextKey } from '../Stepper/context.js'
import { tabListContextKey } from '../TabList/context.js'
import { toggleButtonGroupContextKey } from '../ToggleButton/context.js'
import '../../styles/layer.css'

/**
 * @file scopedProvide.ts
 * @input The "membership" contexts a container provides to its own children
 * @output The registry of those contexts and the reset a layer content root applies
 * @position Layer runtime; spec:AST-038 (surface membership)
 *
 * 「成员关系」类 context 说的是「我属于外面那个组」：按钮组给我尺寸和禁用
 * 状态、单选组给我选中值、菜单给我关闭入口。这些信息只在组的 DOM 范围里成立。
 *
 * 浮层被 Teleport 出去以后，DOM 上已经不在组里面了（`closest('.astryx-button-group')`
 * 是空的），但 Vue 的 provide/inject 跟的是组件树，不看 DOM，Teleport 也切不断。
 * 结果就是：禁用的按钮组里打开一个 Popover，Popover 里的按钮也是禁用的，点不动。
 * 上游用 `LayerContentBoundary` 把这些 context 整值重置回默认值来解决。
 *
 * 做法：每个浮层的内容根在 setup 里调 `resetLayerScopedContext()`，把登记表里的
 * key 重新 provide 成各自的默认值。必须在这层的组件自己 provide 之前调，之后
 * 自己提供的值会照常覆盖默认值。
 */

interface LayerScopedRegistration {
  key: InjectionKey<unknown>
  /**
   * 进了浮层以后重新提供的值。必须和读者自己 `inject` 时的默认值一致，
   * 这样「组里没有我」的读法和「根本没有组」的读法完全一样。
   */
  resetValue: unknown
}

const registrations: LayerScopedRegistration[] = []

/** 把一个 context 登记成「进了浮层就重置」。同一个 key 只登记一次。 */
export function registerLayerScopedContext<T>(
  key: InjectionKey<T>,
  resetValue: T | null | undefined,
): void {
  if (registrations.some(entry => entry.key === key))
    return
  registrations.push({ key, resetValue })
}

/** 把登记表里的 key 在当前组件里重新提供成默认值。可以重复调用。 */
export function resetLayerScopedContext(): void {
  for (const { key, resetValue } of registrations)
    provide(key, resetValue)
}

/** 登记表里的 key，按登记顺序。 */
export function registeredLayerScopedContexts(): readonly InjectionKey<unknown>[] {
  return registrations.map(entry => entry.key)
}

const NO_FORM_LAYOUT = computed(() => null)
const NO_LAYOUT_AREA = computed<null>(() => null)
const NO_LAYOUT_DIVIDERS = computed(() => undefined)

registerLayerScopedContext(buttonGroupContextKey, null)
registerLayerScopedContext(toggleButtonGroupContextKey, null)
registerLayerScopedContext(segmentedControlContextKey, null)
registerLayerScopedContext(checkboxListKey, undefined)
registerLayerScopedContext(radioContextKey, undefined)
registerLayerScopedContext(listContextKey, undefined)
registerLayerScopedContext(collapsibleGroupKey, null)
registerLayerScopedContext(collapsibleGroupPresentationKey, null)
registerLayerScopedContext(formLayoutKey, NO_FORM_LAYOUT)
registerLayerScopedContext(INPUT_GROUP_KEY, null)
registerLayerScopedContext(ICON_DEFAULT_SIZE_KEY, undefined)
registerLayerScopedContext(AvatarGroupContext, undefined)
registerLayerScopedContext(AvatarSizeContext, null)
registerLayerScopedContext(breadcrumbContextKey, undefined)
registerLayerScopedContext(chatMessageContextKey, undefined)
registerLayerScopedContext(chatListContextKey, undefined)
registerLayerScopedContext(layoutSlotsKey, emptyLayoutSlots)
registerLayerScopedContext(layoutAreaKey, NO_LAYOUT_AREA)
registerLayerScopedContext(layoutDividerKey, NO_LAYOUT_DIVIDERS)
registerLayerScopedContext(metadataListKey, null)
registerLayerScopedContext(navMenuKey, null)
registerLayerScopedContext(tabListContextKey, null)
registerLayerScopedContext(stepperContextKey, null)
