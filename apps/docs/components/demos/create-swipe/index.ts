import { defineDemo } from '../../demo-infra/defineDemo'
import mailDemo from './mail.vue'
import mailSource from './mail.vue?raw&highlighted'

export const createSwipeMail = defineDemo(mailDemo, mailSource, { className: 'list-preview' })
