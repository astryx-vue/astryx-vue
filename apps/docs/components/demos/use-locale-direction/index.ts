import { defineDemo } from '../../demo-infra/defineDemo'
import directionSparklineDemo from './direction-sparkline.vue'
import directionSparklineSource from './direction-sparkline.vue?raw&highlighted'

export const useLocaleDirectionSparkline = defineDemo(directionSparklineDemo, directionSparklineSource, { className: 'internationalization-provider-preview' })
