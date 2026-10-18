import { defineDemo } from '../../demo-infra/defineDemo'
import paginatedDataDemo from '../table/paginated.vue'
import paginatedDataSource from '../table/paginated.vue?raw&highlighted'

export const useTablePaginationPaginatedData = defineDemo(paginatedDataDemo, paginatedDataSource, { className: 'table-preview' })
