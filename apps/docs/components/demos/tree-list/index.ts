import { defineDemo } from '../../demo-infra/defineDemo'
import fileTreeDemo from './file-tree.vue'
import fileTreeSource from './file-tree.vue?raw&highlighted'
import mailboxDemo from './mailbox.vue'
import mailboxSource from './mailbox.vue?raw&highlighted'
import navigationDemo from './navigation.vue'
import navigationSource from './navigation.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import settingsDemo from './settings.vue'
import settingsSource from './settings.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

export const treeListOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const treeListFileTree = defineDemo(fileTreeDemo, fileTreeSource)
export const treeListMailbox = defineDemo(mailboxDemo, mailboxSource)
export const treeListNavigation = defineDemo(navigationDemo, navigationSource)
export const treeListSettings = defineDemo(settingsDemo, settingsSource)
export const treeListVariants = defineDemo(variantsDemo, variantsSource)
