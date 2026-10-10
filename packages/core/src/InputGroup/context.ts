import type { ComputedRef, InjectionKey } from 'vue'

export interface InputGroupContext {
  size: ComputedRef<'sm' | 'md' | 'lg'>
  disabled: ComputedRef<boolean>
}

export const INPUT_GROUP_KEY: InjectionKey<InputGroupContext> = Symbol('InputGroup')
