import { defineDemo } from '../../demo-infra/defineDemo'
import confirmationDemo from '../dialog/confirmation.vue'
import confirmationSource from '../dialog/confirmation.vue?raw&highlighted'
import formDemo from '../dialog/form.vue'
import formSource from '../dialog/form.vue?raw&highlighted'
import requiredDemo from '../dialog/required.vue'
import requiredSource from '../dialog/required.vue?raw&highlighted'
import scrollableDemo from '../dialog/scrollable.vue'
import scrollableSource from '../dialog/scrollable.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const useImperativeDialogConfirmation = defineDemo(confirmationDemo, confirmationSource, options)
export const useImperativeDialogForm = defineDemo(formDemo, formSource, options)
export const useImperativeDialogRequired = defineDemo(requiredDemo, requiredSource, options)
export const useImperativeDialogScrollable = defineDemo(scrollableDemo, scrollableSource, options)
