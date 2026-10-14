import { defineDemo } from '../../demo-infra/defineDemo'
import bottomSheetDemo from './bottom-sheet.vue'
import bottomSheetSource from './bottom-sheet.vue?raw&highlighted'
import confirmDemo from './confirm.vue'
import confirmSource from './confirm.vue?raw&highlighted'
import filterDemo from './filter.vue'
import filterSource from './filter.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import settingsDemo from './settings.vue'
import settingsSource from './settings.vue?raw&highlighted'
import shortcutsDemo from './shortcuts.vue'
import shortcutsSource from './shortcuts.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const popoverBottomSheet = defineDemo(bottomSheetDemo, bottomSheetSource, options)
export const popoverConfirm = defineDemo(confirmDemo, confirmSource, options)
export const popoverFilter = defineDemo(filterDemo, filterSource, options)
export const popoverShortcuts = defineDemo(shortcutsDemo, shortcutsSource, options)
export const popoverSettings = defineDemo(settingsDemo, settingsSource, options)
export const popoverOverview = defineDemo(overviewDemo, overviewSource, options)
