import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

// 总览宫格和详情页画布共用这一份；宽度由 .table-part-preview 收住，居中交给画布。
export const tableRowOverview = defineDemo(overviewDemo, overviewSource, { className: 'table-part-preview' })
