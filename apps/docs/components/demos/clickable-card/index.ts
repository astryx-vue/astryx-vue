import { defineDemo } from '../../demo-infra/defineDemo'
import elevatedDemo from './elevated.vue'
import elevatedSource from './elevated.vue?raw&highlighted'
import navigationDemo from './navigation.vue'
import navigationSource from './navigation.vue?raw&highlighted'
import nestedDemo from './nested.vue'
import nestedSource from './nested.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'clickable-card-preview' }

export const clickableCardNavigation = defineDemo(navigationDemo, navigationSource, options)
export const clickableCardNested = defineDemo(nestedDemo, nestedSource, options)
export const clickableCardElevated = defineDemo(elevatedDemo, elevatedSource, options)
export const clickableCardOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
