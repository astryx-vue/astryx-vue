import { defineDemo } from '../../demo-infra/defineDemo'
import commentThreadDemo from './comment-thread.vue'
import commentThreadSource from './comment-thread.vue?raw&highlighted'

export const useLinkifyCommentThread = defineDemo(commentThreadDemo, commentThreadSource)
