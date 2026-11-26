import { defineDemo } from '../../demo-infra/defineDemo'
import shareLinkDemo from './share-link.vue'
import shareLinkSource from './share-link.vue?raw&highlighted'

export const useClipboardShareLink = defineDemo(shareLinkDemo, shareLinkSource)
