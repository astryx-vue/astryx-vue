import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

// 原版这一页只有使用方法和建议，没有示例，所以这里只有一份总览视图：
// 总览卡片和详情页画布共用它，居中交给画布。
export const tableSelectionToolbarOverview = defineDemo(overviewDemo, overviewSource)
