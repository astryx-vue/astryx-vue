import { defineDemo } from '../../demo-infra/defineDemo'
import fileTreeDemo from './file-tree.vue'
import fileTreeSource from './file-tree.vue?raw&highlighted'

export const useTreeFocusFileTree = defineDemo(fileTreeDemo, fileTreeSource)
