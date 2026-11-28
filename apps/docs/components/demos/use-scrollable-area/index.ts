import { defineDemo } from '../../demo-infra/defineDemo'
import activityLogDemo from './activity-log.vue'
import activityLogSource from './activity-log.vue?raw&highlighted'

export const useScrollableAreaActivityLog = defineDemo(activityLogDemo, activityLogSource)
