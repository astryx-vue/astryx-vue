import type { ComputedRef } from 'vue'
import type { AstryxMessages } from '../locale/messages.js'
import { useComponentMessages } from '../locale/context.js'
import { dropdownMenuMessages } from '../locale/messages/dropdown-menu.js'

/** 菜单和子菜单共用的内置文案（子菜单的返回按钮等）。 */
export function useDropdownMenuMessages(): ComputedRef<Pick<AstryxMessages, 'dropdownMenu'>> {
  return useComponentMessages({ dropdownMenu: dropdownMenuMessages })
}
