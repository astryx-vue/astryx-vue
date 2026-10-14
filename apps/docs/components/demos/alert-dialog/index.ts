import { defineDemo } from '../../demo-infra/defineDemo'
import loadingDemo from './loading.vue'
import loadingSource from './loading.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'alert-dialog-preview' }

export const alertDialogOverview = defineDemo(overviewDemo, overviewSource, options)
export const alertDialogLoading = defineDemo(loadingDemo, loadingSource, options)
