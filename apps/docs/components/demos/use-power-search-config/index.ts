import { defineDemo } from '../../demo-infra/defineDemo'
import filteredDirectoryDemo from './filtered-directory.vue'
import filteredDirectorySource from './filtered-directory.vue?raw&highlighted'

export const usePowerSearchConfigFilteredDirectory = defineDemo(filteredDirectoryDemo, filteredDirectorySource)
