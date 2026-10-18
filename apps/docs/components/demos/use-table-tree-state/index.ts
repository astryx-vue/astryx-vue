import { defineDemo } from '../../demo-infra/defineDemo'
import treeTableDemo from '../table/tree.vue'
import treeTableSource from '../table/tree.vue?raw&highlighted'

export const useTableTreeStateTree = defineDemo(treeTableDemo, treeTableSource, { className: 'table-preview' })
