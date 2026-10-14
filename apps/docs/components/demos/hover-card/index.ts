import { defineDemo } from '../../demo-infra/defineDemo'
import definitionDemo from './definition.vue'
import definitionSource from './definition.vue?raw&highlighted'
import linkPreviewDemo from './link-preview.vue'
import linkPreviewSource from './link-preview.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import profileDemo from './profile.vue'
import profileSource from './profile.vue?raw&highlighted'

const options = { className: 'hover-card-preview' }

export const hoverCardDefinition = defineDemo(definitionDemo, definitionSource, options)
export const hoverCardLinkPreview = defineDemo(linkPreviewDemo, linkPreviewSource, options)
export const hoverCardProfile = defineDemo(profileDemo, profileSource, options)
export const hoverCardOverview = defineDemo(overviewDemo, overviewSource, options)
