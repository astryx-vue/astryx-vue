import type { VNode, VNodeChild } from 'vue'
import type {
  DropdownMenuCheckboxData,
  DropdownMenuEntry,
  DropdownMenuItemData,
  DropdownMenuOption,
  DropdownMenuRadioData,
  DropdownMenuRadioOptionData,
} from './types.js'
import { defineComponent, h } from 'vue'
import DropdownMenuCheckboxItem from './DropdownMenuCheckboxItem.vue'
import DropdownMenuDivider from './DropdownMenuDivider.vue'
import DropdownMenuGroup from './DropdownMenuGroup.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuRadioGroup from './DropdownMenuRadioGroup.vue'
import DropdownMenuRadioItem from './DropdownMenuRadioItem.vue'

function endSlot(endContent: VNodeChild | undefined): { endContent: () => VNodeChild } | undefined {
  return endContent == null ? undefined : { endContent: () => endContent }
}

function renderRadioOption(option: DropdownMenuRadioOptionData, index: number): VNode {
  const { endContent, id, ...itemProps } = option
  return h(
    DropdownMenuRadioItem,
    { key: id ?? `radio-${index}`, ...itemProps },
    endSlot(endContent),
  )
}

function renderCheckbox(item: DropdownMenuCheckboxData, index: number): VNode {
  const { checked, endContent, id, onChange, ...itemProps } = item
  return h(
    DropdownMenuCheckboxItem,
    {
      'key': id ?? `checkbox-${index}`,
      ...itemProps,
      'modelValue': checked,
      'onUpdate:modelValue': (value: boolean) => onChange?.(value),
    },
    endSlot(endContent),
  )
}

function renderRadio(item: DropdownMenuRadioData, index: number): VNode {
  return h(
    DropdownMenuRadioGroup,
    {
      'key': item.id ?? `radio-group-${index}`,
      'label': item.label,
      'modelValue': item.value,
      'onUpdate:modelValue': (value: string | undefined) => {
        if (value != null)
          item.onChange?.(value)
      },
      ...(item.hasCloseOnSelect == null ? {} : { hasCloseOnSelect: item.hasCloseOnSelect }),
    },
    { default: () => item.items.map((option, optionIndex) => renderRadioOption(option, optionIndex)) },
  )
}

function renderItem(item: DropdownMenuItemData, index: number): VNode {
  const { endContent, id, ...itemProps } = item
  return h(
    DropdownMenuItem,
    { key: id ?? `item-${index}`, ...itemProps },
    endSlot(endContent),
  )
}

function renderEntry(entry: DropdownMenuEntry, index: number): VNode {
  if ('type' in entry && entry.type === 'checkbox')
    return renderCheckbox(entry, index)
  if ('type' in entry && entry.type === 'radio')
    return renderRadio(entry, index)
  return renderItem(entry, index)
}

/**
 * Renders one data-mode entry. A section renders through `DropdownMenuGroup`,
 * so both modes produce one `role="group"` named by its visible heading.
 */
function renderOption(option: DropdownMenuOption, index: number): VNode {
  if ('type' in option && option.type === 'divider')
    return h(DropdownMenuDivider, { key: `divider-${index}` })

  if ('type' in option && option.type === 'section') {
    return h(
      DropdownMenuGroup,
      { key: option.id ?? `section-${index}`, title: option.title },
      { default: () => option.items.map((item, itemIndex) => renderEntry(item, itemIndex)) },
    )
  }

  if ('type' in option && option.type === 'checkbox')
    return renderCheckbox(option, index)

  if ('type' in option && option.type === 'radio')
    return renderRadio(option, index)

  return renderItem(option, index)
}

/** Data-mode content of a `DropdownMenu`, as a component so the template stays flat. */
export const DropdownMenuItems = defineComponent({
  name: 'AstryxDropdownMenuItems',
  inheritAttrs: false,
  props: {
    items: { type: Array as () => readonly DropdownMenuOption[], required: true },
  },
  setup(props) {
    return () => props.items.map((option, index) => renderOption(option, index))
  },
})
