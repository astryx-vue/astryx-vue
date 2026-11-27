import type { SelectableCardProps } from '@astryx-vue/core'
import type { InjectionKey } from 'vue'

export type SelectableCardGroupSelectionMode = 'single' | 'multiple'
export type SelectableCardGroupOrientation = 'horizontal' | 'vertical'

export interface SelectableCardGroupProps {
  /** 组的可见标签，也是组的无障碍名。 */
  label: string
  /** 视觉上隐藏标签，读屏仍然读得到。 */
  isLabelHidden?: boolean
  /** 标签下方的说明，和组关联。 */
  description?: string
  /**
   * 选择方式。`single` 是单选组（一个 Tab 停靠点、方向键切换、读出「第 2 项，共 3 项」），
   * `multiple` 是一组复选框。
   * @default 'single'
   */
  selectionMode?: SelectableCardGroupSelectionMode
  /**
   * 选中的卡片值。`single` 下是一个值，还没选时为 `null`；`multiple` 下是值的数组。
   * 用 `v-model` 绑定。
   */
  modelValue: string | null | readonly string[]
  /**
   * 选中值提交到表单时用的名字。单选框按生成的名字分组。
   * 默认生成一个。
   */
  htmlName?: string
  /** 禁用所有卡片；卡片仍可聚焦并读出禁用。 */
  isDisabled?: boolean
  /**
   * `horizontal` 让卡片按行换行排列，`vertical` 竖着叠放。
   * @default 'horizontal'
   */
  orientation?: SelectableCardGroupOrientation
}

export interface SelectableCardGroupEmits {
  /** 选中值变了。`single` 带一个值，`multiple` 带新的值数组（最新选的在最后）。 */
  'update:modelValue': [value: string | string[]]
  'change': [value: string | string[]]
}

export interface SelectableCardGroupSlots {
  /** 一组 `SelectableCardGroupItem`。 */
  default?: () => unknown
}

export interface SelectableCardGroupItemProps extends Omit<SelectableCardProps, 'isSelected'> {
  /** 这张卡片在组的选中值里代表的值。 */
  value: string
}

export interface SelectableCardGroupItemSlots {
  /** 卡片内容。 */
  default?: () => unknown
}

export interface SelectableCardGroupContext {
  inputType: 'checkbox' | 'radio'
  groupName: string
  submitName: string
  isDisabled: boolean
  isSelected: (value: string) => boolean
  change: (value: string, isSelected: boolean) => void
}

export const selectableCardGroupKey: InjectionKey<() => SelectableCardGroupContext> = Symbol('astryx-selectable-card-group')
