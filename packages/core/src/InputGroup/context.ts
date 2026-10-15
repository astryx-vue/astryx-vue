import type { ComputedRef, InjectionKey } from 'vue'

export interface InputGroupContext {
  size: ComputedRef<'sm' | 'md' | 'lg'>
  disabled: ComputedRef<boolean>
  /** 组标签的 id。没有标签时为空。 */
  labelId: ComputedRef<string | undefined>
  /** 组的说明和状态文案 id，组内控件可以接进 aria-describedby。 */
  describedBy: ComputedRef<string | undefined>
}

export const INPUT_GROUP_KEY: InjectionKey<InputGroupContext> = Symbol('InputGroup')
