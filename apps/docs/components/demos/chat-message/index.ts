import { defineDemo } from '../../demo-infra/defineDemo'
import avatarDemo from './avatar.vue'
import avatarSource from './avatar.vue?raw&highlighted'
import ghostDemo from './ghost.vue'
import ghostSource from './ghost.vue?raw&highlighted'
import multiBubbleDemo from './multi-bubble.vue'
import multiBubbleSource from './multi-bubble.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const column = { className: 'chat-preview' }

export const chatMessageOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatMessageAvatar = defineDemo(avatarDemo, avatarSource, column)
export const chatMessageGhost = defineDemo(ghostDemo, ghostSource, column)
export const chatMessageMultiBubble = defineDemo(multiBubbleDemo, multiBubbleSource, column)
