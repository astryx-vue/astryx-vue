import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import loadingDemo from './loading.vue'
import loadingSource from './loading.vue?raw&highlighted'
import nonDestructiveDemo from './non-destructive.vue'
import nonDestructiveSource from './non-destructive.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'alert-dialog-preview' }

export const alertDialogOverview = defineDemo(overviewDemo, overviewSource, options)
export const alertDialogBasic = defineDemo(basicDemo, basicSource, options)
export const alertDialogNonDestructive = defineDemo(nonDestructiveDemo, nonDestructiveSource, options)
export const alertDialogLoading = defineDemo(loadingDemo, loadingSource, options)
