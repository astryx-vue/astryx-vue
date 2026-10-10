import type { InjectionKey } from 'vue'

export interface InputGroupContext {
  size: 'sm' | 'md' | 'lg'
  disabled: boolean
}

export const INPUT_GROUP_KEY: InjectionKey<InputGroupContext> = Symbol('InputGroup')
