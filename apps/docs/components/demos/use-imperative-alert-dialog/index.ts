import { defineDemo } from '../../demo-infra/defineDemo'
import deleteDemo from './delete.vue'
import deleteSource from './delete.vue?raw&highlighted'

export const useImperativeAlertDialogDelete = defineDemo(deleteDemo, deleteSource, { className: 'alert-dialog-preview' })
