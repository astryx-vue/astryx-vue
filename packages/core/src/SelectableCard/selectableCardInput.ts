import type { ComputedRef, InjectionKey } from 'vue'

/** 卡片组交给一张卡片的原生输入：类型、分组名和提交值。 */
export interface SelectableCardInput {
  /** `radio` 让卡片成为单选集合里的一项：只会选中，不会自己取消。 */
  readonly type: 'checkbox' | 'radio'
  /** 输入的 `name`。同名的单选框组成一个原生分组。 */
  readonly name: string
  /** 输入的 `value`。 */
  readonly value: string
}

/** 不在卡片组里时没有提供者，卡片自己渲染复选框。实验包的 SelectableCardGroup 通过它给每张卡片配输入。 */
export const selectableCardInputKey: InjectionKey<ComputedRef<SelectableCardInput>> = Symbol('astryx-selectable-card-input')
