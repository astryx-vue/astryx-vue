import type { Ref } from 'vue'
import type { ComboboxOption } from '../useCombobox.js'
import { isImeKeyEvent } from '../../utils/ime.js'

/** 展开到调用方自己渲染的单行输入框上的属性。 */
export interface ComboboxFieldProps {
  'role': 'combobox'
  'aria-autocomplete': 'list'
  'aria-expanded': boolean
  'aria-controls'?: string
  'aria-activedescendant'?: string
  'onKeydown': (event: KeyboardEvent) => void
}

/** 展开到调用方自己渲染的列表上的属性，名字由调用方给。 */
export interface ComboboxListboxProps {
  id: string
  role: 'listbox'
  onMousedown: (event: MouseEvent) => void
}

/** 展开到某一行选项上的属性。 */
export interface ComboboxOptionProps {
  'id': string
  'role': 'option'
  'aria-selected': boolean
  'aria-disabled'?: true
  'onMousemove': () => void
  'onClick': () => void
}

export interface ComboboxFieldHandlers {
  onKeydown?: (event: KeyboardEvent) => void
}

interface ComboboxFieldHost {
  listboxId: string
  isOpen: Ref<boolean>
  isEnabled: Ref<boolean>
  activeIndex: Ref<number>
  /** 现在显示的选项，按渲染顺序。 */
  options: Readonly<Ref<readonly ComboboxOption[]>>
  open: () => void
  close: () => void
  select: (value: ComboboxOption['value']) => void
}

function hasModifier(event: KeyboardEvent): boolean {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
}

/**
 * 调用方自己渲染输入框、列表和选项时，把组合框语义、按键和指针模型接上去的属性生成器。
 * 焦点始终留在输入框里，高亮的选项由 `aria-activedescendant` 指出；输入框保留列表用不到的所有按键。
 */
export function createComboboxFieldProps(host: ComboboxFieldHost): {
  getItemId: (index: number) => string
  getFieldProps: (handlers?: ComboboxFieldHandlers) => ComboboxFieldProps
  getListboxProps: () => ComboboxListboxProps
  getOptionProps: (index: number) => ComboboxOptionProps
} {
  const getItemId = (index: number): string => `${host.listboxId}-option-${index}`
  /** 列表只在有选项时才渲染：打开了但一个选项也没有时显示的是调用方的空状态，它不是 listbox。 */
  const isShown = (): boolean => host.isOpen.value && host.options.value.length > 0

  function enabledIndices(): number[] {
    return host.options.value.flatMap((option, index) => option.disabled ? [] : [index])
  }

  function onFieldKeyDown(event: KeyboardEvent): void {
    // 带修饰键的是输入框自己的命令（比如 Shift+Enter），Escape 例外：不管按了什么修饰键，
    // 都先收起列表，外层的层不会在同一次按键里一起关掉。输入法正在组词时每个键都归输入法。
    if (!host.isEnabled.value || isImeKeyEvent(event) || (hasModifier(event) && event.key !== 'Escape'))
      return
    const enabled = enabledIndices()
    if (!host.isOpen.value) {
      // 单行输入框的 ArrowDown 没有光标要移，所以用来显示收起的列表。
      if (event.key === 'ArrowDown' && host.options.value.length > 0) {
        event.preventDefault()
        host.open()
        host.activeIndex.value = enabled[0] ?? -1
      }
      return
    }
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        // 列表开着时方向键归它，哪怕没有可去的选项，也不让它们去动光标。
        event.preventDefault()
        if (enabled.length === 0)
          break
        // 两头循环；没有高亮时 ArrowDown 从第一项开始，ArrowUp 从最后一项开始。
        const position = enabled.indexOf(host.activeIndex.value)
        const next = event.key === 'ArrowDown'
          ? (position + 1) % enabled.length
          : position < 0 ? enabled.length - 1 : (position - 1 + enabled.length) % enabled.length
        host.activeIndex.value = enabled[next]!
        break
      }
      case 'Enter': {
        // 只有选中才拦下输入框自己的回车（发送、换行）。
        const option = host.activeIndex.value >= 0 ? host.options.value[host.activeIndex.value] : undefined
        if (option && !option.disabled) {
          event.preventDefault()
          host.select(option.value)
        }
        break
      }
      case 'Escape':
        // 认领这次按键，外层的对话框或弹出框不会跟着关。
        event.preventDefault()
        host.close()
        break
      default:
        // 其余的键原样交给输入框。Home 和 End 留给光标。
        break
    }
  }

  function getFieldProps(handlers: ComboboxFieldHandlers = {}): ComboboxFieldProps {
    const shown = isShown()
    const active = host.activeIndex.value
    return {
      'role': 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': shown,
      'aria-controls': shown ? host.listboxId : undefined,
      'aria-activedescendant': shown && active >= 0 && active < host.options.value.length ? getItemId(active) : undefined,
      'onKeydown': (event) => {
        onFieldKeyDown(event)
        if (!event.defaultPrevented)
          handlers.onKeydown?.(event)
      },
    }
  }

  function getListboxProps(): ComboboxListboxProps {
    return {
      id: host.listboxId,
      role: 'listbox',
      // 在列表里任何地方按下都不把焦点从输入框带走。
      onMousedown: event => event.preventDefault(),
    }
  }

  function getOptionProps(index: number): ComboboxOptionProps {
    const option = host.options.value[index]
    const isDisabled = option?.disabled === true
    return {
      'id': getItemId(index),
      'role': 'option',
      'aria-selected': index === host.activeIndex.value,
      ...(isDisabled ? { 'aria-disabled': true as const } : {}),
      'onMousemove': () => {
        if (option && !isDisabled && index !== host.activeIndex.value)
          host.activeIndex.value = index
      },
      'onClick': () => {
        if (option && !isDisabled)
          host.select(option.value)
      },
    }
  }

  return { getItemId, getFieldProps, getListboxProps, getOptionProps }
}
