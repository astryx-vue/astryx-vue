import { defineDemo } from '../../demo-infra/defineDemo'
import settingsSavedDemo from './settings-saved.vue'
import settingsSavedSource from './settings-saved.vue?raw&highlighted'
import showDemo from './show.vue'
import showSource from './show.vue?raw&highlighted'

export const useToastShow = defineDemo(showDemo, showSource, { className: 'toast-preview' })
export const useToastSettingsSaved = defineDemo(settingsSavedDemo, settingsSavedSource)
