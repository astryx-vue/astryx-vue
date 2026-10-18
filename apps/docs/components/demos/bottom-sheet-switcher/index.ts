import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import reviewFlowDemo from './review-flow.vue'
import reviewFlowSource from './review-flow.vue?raw&highlighted'

export const bottomSheetSwitcherOverview = defineDemo(overviewDemo, overviewSource)
export const bottomSheetSwitcherReviewFlow = defineDemo(reviewFlowDemo, reviewFlowSource)
