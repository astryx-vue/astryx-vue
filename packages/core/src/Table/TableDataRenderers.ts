import type { VNodeChild } from 'vue'
import type { TableColumn, TablePlugin } from './types.js'
import { defineComponent } from 'vue'
import { cellText } from './columnUtils.js'

/**
 * 渲染单元格内容：优先走列自己的 renderCell，没给就回退成纯文本。
 */
export const CellContent = defineComponent({
  name: 'AstryxTableCellContent',
  props: {
    column: { type: Object, required: true },
    row: { type: Object, required: true },
    index: { type: Number, required: true },
  },
  setup(cellProps) {
    return () => {
      const column = cellProps.column as TableColumn
      const row = cellProps.row as Record<string, unknown>
      const rendered = column.renderCell?.(row, cellProps.index)
      if (rendered == null)
        return cellText(row[column.key])
      return rendered
    }
  },
})

/**
 * 把外部传入的 render 函数包成组件，让模板里能直接当标签用。
 */
export const RenderFn = defineComponent({
  name: 'AstryxTableRenderFn',
  props: { render: { type: Function, required: true } },
  setup(renderProps) {
    return () => (renderProps.render as () => VNodeChild)()
  },
})

/**
 * 表头单元格里留给插件的扩展位。
 */
export const HeaderAddon = defineComponent({
  name: 'AstryxTableHeaderAddon',
  props: {
    column: { type: Object, required: true },
    plugins: { type: Array, required: true },
  },
  setup(addonProps) {
    return () => {
      const column = addonProps.column as TableColumn
      const nodes: VNodeChild[] = []
      for (const plugin of addonProps.plugins as TablePlugin[]) {
        const before = plugin.headerPatch?.(column)?.before?.()
        if (before != null)
          nodes.push(before)
      }
      return nodes
    }
  },
})

/**
 * 渲染插件挂在表格下方的 footer 内容。
 */
export const PluginFooter = defineComponent({
  name: 'AstryxTablePluginFooter',
  props: { plugin: { type: Object, required: true } },
  setup(footerProps) {
    return () => (footerProps.plugin as TablePlugin).below?.() ?? null
  },
})
