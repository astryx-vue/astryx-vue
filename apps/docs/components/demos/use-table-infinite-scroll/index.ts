import { defineDemo } from '../../demo-infra/defineDemo'
import loadMoreDemo from './load-more.vue'
import loadMoreSource from './load-more.vue?raw&highlighted'

export const useTableInfiniteScrollLoadMore = defineDemo(loadMoreDemo, loadMoreSource, { className: 'table-preview' })
