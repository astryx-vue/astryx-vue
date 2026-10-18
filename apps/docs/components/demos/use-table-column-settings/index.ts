import { defineDemo } from '../../demo-infra/defineDemo'
import columnPickerDemo from '../table/column-settings.vue'
import columnPickerSource from '../table/column-settings.vue?raw&highlighted'

export const useTableColumnSettingsPicker = defineDemo(columnPickerDemo, columnPickerSource, { className: 'table-preview' })
