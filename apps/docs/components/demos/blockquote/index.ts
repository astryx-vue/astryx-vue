import { defineDemo } from '../../demo-infra/defineDemo'
import citeDemo from './cite.vue'
import citeSource from './cite.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import testimonialsDemo from './testimonials.vue'
import testimonialsSource from './testimonials.vue?raw&highlighted'

export const blockquoteTestimonials = defineDemo(testimonialsDemo, testimonialsSource, {
  className: 'blockquote-preview',
})
export const blockquoteCite = defineDemo(citeDemo, citeSource, {
  className: 'blockquote-preview',
})

export const blockquoteOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
