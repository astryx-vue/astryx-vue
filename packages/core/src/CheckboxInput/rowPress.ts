import { defineLayerScopedKey } from '../layer/scopedProvide.js'

/**
 * 复选框外面有一整行都在回应按压（CheckboxListItem 的行）时为真：
 * 这一行自己画按压，复选框不再单独当按压表面，手指落在标签、说明还是框上，亮的都是同一行。
 */
export const checkboxRowPressKey = defineLayerScopedKey<boolean>('astryx-checkbox-row-press', false)
