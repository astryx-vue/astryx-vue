import type { VNode } from 'vue'
import type { DropdownMenuItemData, DropdownMenuOption } from './types.js'
import { defineComponent, h } from 'vue'
import DropdownMenuDivider from './DropdownMenuDivider.vue'
import DropdownMenuGroup from './DropdownMenuGroup.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'

/**
 * Renders one data-mode entry. A section renders through `DropdownMenuGroup`,
 * so both modes produce one `role="group"` named by its visible heading.
 */
function renderOption(option: DropdownMenuOption, index: number): VNode {
  if ('type' in option) {
    if (option.type === 'divider')
      return h(DropdownMenuDivider, { key: `divider-${index}` })

    return h(
      DropdownMenuGroup,
      { key: option.id ?? `section-${index}`, title: option.title },
      { default: () => option.items.map((item, itemIndex) => renderItem(item, itemIndex)) },
    )
  }

  return renderItem(option, index)
}

function renderItem(item: DropdownMenuItemData, index: number): VNode {
  const { endContent, id, ...itemProps } = item
  return h(
    DropdownMenuItem,
    { key: id ?? `item-${index}`, ...itemProps },
    endContent == null ? undefined : { endContent: () => endContent },
  )
}

/** Data-mode content of a `DropdownMenu`, as a component so the template stays flat. */
export const DropdownMenuItems = defineComponent({
  name: 'AstryxDropdownMenuItems',
  inheritAttrs: false,
  props: {
    items: { type: Array as () => DropdownMenuOption[], required: true },
  },
  setup(props) {
    return () => (props.items as DropdownMenuOption[]).map((option, index) => renderOption(option, index))
  },
})
