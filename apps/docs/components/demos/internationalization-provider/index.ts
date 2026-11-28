import { defineDemo } from '../../demo-infra/defineDemo'
import calendarDemo from './calendar.vue'
import calendarSource from './calendar.vue?raw&highlighted'
import overridesDemo from './overrides.vue'
import overridesSource from './overrides.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rtlDirectionDemo from './rtl-direction.vue'
import rtlDirectionSource from './rtl-direction.vue?raw&highlighted'
import shippedLocaleDemo from './shipped-locale.vue'
import shippedLocaleSource from './shipped-locale.vue?raw&highlighted'

const options = { className: 'internationalization-provider-preview' }

export const internationalizationProviderOverview = defineDemo(overviewDemo, overviewSource, options)
export const internationalizationProviderOverrides = defineDemo(overridesDemo, overridesSource, options)
export const internationalizationProviderShippedLocale = defineDemo(shippedLocaleDemo, shippedLocaleSource, options)
export const internationalizationProviderRtlDirection = defineDemo(rtlDirectionDemo, rtlDirectionSource, options)
export const internationalizationProviderCalendar = defineDemo(calendarDemo, calendarSource, options)
