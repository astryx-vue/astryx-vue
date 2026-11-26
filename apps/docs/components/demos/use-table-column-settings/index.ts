import { defineDemo } from '../../demo-infra/defineDemo'
import columnPickerDemo from '../table/column-settings.vue'
import columnPickerSource from '../table/column-settings.vue?raw&highlighted'
import visibilityPickerDemo from './visibility-picker.vue'
import visibilityPickerSource from './visibility-picker.vue?raw&highlighted'

export const useTableColumnSettingsPicker = defineDemo(columnPickerDemo, columnPickerSource, { className: 'table-preview' })
export const useTableColumnSettingsStateVisibilityPicker = defineDemo(visibilityPickerDemo, visibilityPickerSource, { className: 'table-preview' })
