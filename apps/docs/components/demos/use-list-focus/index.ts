import { defineDemo } from '../../demo-infra/defineDemo'
import recentFilesDemo from './recent-files.vue'
import recentFilesSource from './recent-files.vue?raw&highlighted'

export const useListFocusRecentFiles = defineDemo(recentFilesDemo, recentFilesSource)
