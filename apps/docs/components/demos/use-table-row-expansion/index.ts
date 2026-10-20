import { defineDemo } from '../../demo-infra/defineDemo'
import detailPanelDemo from '../table/expansion.vue'
import detailPanelSource from '../table/expansion.vue?raw&highlighted'

export const useTableRowExpansionDetail = defineDemo(detailPanelDemo, detailPanelSource, { className: 'table-preview' })
