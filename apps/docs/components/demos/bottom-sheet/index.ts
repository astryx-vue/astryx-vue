import { defineDemo } from '../../demo-infra/defineDemo'
import adaptiveDialogDemo from './adaptive-dialog.vue'
import adaptiveDialogSource from './adaptive-dialog.vue?raw&highlighted'
import adaptiveMenuDemo from './adaptive-menu.vue'
import adaptiveMenuSource from './adaptive-menu.vue?raw&highlighted'
import heightsDemo from './heights.vue'
import heightsSource from './heights.vue?raw&highlighted'
import keyboardDemo from './keyboard.vue'
import keyboardSource from './keyboard.vue?raw&highlighted'
import multiSelectorDemo from './multi-selector.vue'
import multiSelectorSource from './multi-selector.vue?raw&highlighted'
import noScrimDemo from './no-scrim.vue'
import noScrimSource from './no-scrim.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import selectorDemo from './selector.vue'
import selectorSource from './selector.vue?raw&highlighted'
import snapPointsDemo from './snap-points.vue'
import snapPointsSource from './snap-points.vue?raw&highlighted'

const options = { className: 'bottom-sheet-preview' }

export const bottomSheetOverview = defineDemo(overviewDemo, overviewSource, options)
export const bottomSheetHeights = defineDemo(heightsDemo, heightsSource, options)
export const bottomSheetKeyboard = defineDemo(keyboardDemo, keyboardSource, options)
export const bottomSheetNoScrim = defineDemo(noScrimDemo, noScrimSource, options)
export const bottomSheetSnapPoints = defineDemo(snapPointsDemo, snapPointsSource, options)
export const bottomSheetAdaptiveDialog = defineDemo(adaptiveDialogDemo, adaptiveDialogSource, options)
export const bottomSheetAdaptiveMenu = defineDemo(adaptiveMenuDemo, adaptiveMenuSource, options)
export const bottomSheetMultiSelector = defineDemo(multiSelectorDemo, multiSelectorSource, options)
export const bottomSheetSelector = defineDemo(selectorDemo, selectorSource, options)
