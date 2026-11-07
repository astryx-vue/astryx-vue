import type { Component, VNodeChild } from 'vue'
import type {
  ScheduleHeaderContent,
  SchedulePlugin,
  SchedulePluginPosition,
  ScheduleView,
  ScheduleViewBase,
} from './types.js'
import { Button, ButtonGroup, DropdownMenu, Icon, IconButton } from '@astryx-vue/core'
import { h, markRaw, toRaw } from 'vue'
import { useScheduleContext } from './context.js'

export interface SchedulePaginationPluginOptions {
  position?: SchedulePluginPosition
}

export interface ScheduleViewSelectorOption<View extends ScheduleViewBase = ScheduleView> {
  view: View
  label: string
}

export interface ScheduleViewSelectorPluginOptions<View extends ScheduleViewBase = ScheduleView> {
  onChangeView?: (view: View) => void
  position?: SchedulePluginPosition
}

const SchedulePaginationControls = {
  name: 'AstryxSchedulePagination',
  setup() {
    const ctx = useScheduleContext()
    return () => h(ButtonGroup, { label: 'Schedule pagination', size: 'sm' }, {
      default: () => [
        h(IconButton, {
          label: ctx.previousDateLabel,
          size: 'sm',
          onClick: () => ctx.onPreviousDate(),
        }, {
          default: () => h(Icon, { icon: 'chevronLeft', size: 'sm', color: 'inherit', class: 'astryx-schedule__chevron' }),
        }),
        h(Button, { label: 'Today', size: 'sm', onClick: () => ctx.onToday() }),
        h(IconButton, {
          label: ctx.nextDateLabel,
          size: 'sm',
          onClick: () => ctx.onNextDate(),
        }, {
          default: () => h(Icon, { icon: 'chevronRight', size: 'sm', color: 'inherit', class: 'astryx-schedule__chevron' }),
        }),
      ],
    })
  },
}

function paginationHeader(position: SchedulePluginPosition, start: VNodeChild, center: VNodeChild, end: VNodeChild): ScheduleHeaderContent {
  const controls = h(SchedulePaginationControls)
  return position === 'start'
    ? { startContent: [controls, start], centerContent: center, endContent: end }
    : { startContent: start, centerContent: center, endContent: [end, controls] }
}

function createSchedulePaginationPlugin({ position = 'start' }: SchedulePaginationPluginOptions = {}): SchedulePlugin {
  return markRaw({
    renderHeader: (start, center, end) => paginationHeader(position, start, center, end),
  })
}

export const defaultSchedulePaginationPlugin = createSchedulePaginationPlugin()

export const defaultSchedulePlugins: ReadonlyArray<SchedulePlugin> = markRaw([
  defaultSchedulePaginationPlugin,
])

export function useSchedulePaginationPlugin({
  position = 'start',
}: SchedulePaginationPluginOptions = {}): SchedulePlugin {
  return createSchedulePaginationPlugin({ position })
}

const ScheduleViewSelectorControl = {
  name: 'AstryxScheduleViewSelector',
  props: {
    options: { type: Array, required: true },
    onChangeView: { type: Function, default: undefined },
  },
  setup(props: { options: ReadonlyArray<ScheduleViewSelectorOption>, onChangeView?: (view: ScheduleViewBase) => void }) {
    const ctx = useScheduleContext()
    return () => {
      const options = props.options
      const selectedIndex = options.findIndex(option => toRaw(option.view) === toRaw(ctx.view))
      const selectedLabel = options[selectedIndex]?.label ?? 'View'
      return h(DropdownMenu, {
        button: { label: selectedLabel, size: 'sm', isDisabled: props.onChangeView == null },
        alignment: 'end',
        menuWidth: 160,
        items: options.map((option, index) => ({
          label: option.label,
          onClick: () => props.onChangeView?.(option.view),
          endContent: index === selectedIndex ? h(Icon, { icon: 'check', size: 'sm', color: 'primary' }) : null,
        })),
      })
    }
  },
}

function createScheduleViewSelectorPlugin<View extends ScheduleViewBase>(
  options: ReadonlyArray<ScheduleViewSelectorOption<View>>,
  { onChangeView, position = 'end' }: ScheduleViewSelectorPluginOptions<View> = {},
): SchedulePlugin {
  return markRaw({
    renderHeader(start, center, end) {
      const control = h(ScheduleViewSelectorControl as unknown as Component, { options, onChangeView })
      return position === 'start'
        ? { startContent: [start, control], centerContent: center, endContent: end }
        : { startContent: start, centerContent: center, endContent: [end, control] }
    },
  })
}

export function useScheduleViewSelectorPlugin<View extends ScheduleViewBase>(
  options: ReadonlyArray<ScheduleViewSelectorOption<View>>,
  pluginOptions: ScheduleViewSelectorPluginOptions<View> = {},
): SchedulePlugin {
  const { onChangeView, position = 'end' } = pluginOptions
  return createScheduleViewSelectorPlugin(options, { onChangeView, position })
}
