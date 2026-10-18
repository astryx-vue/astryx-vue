import { defineDemo } from '../../demo-infra/defineDemo'
import controlledDemo from './controlled.vue'
import controlledSource from './controlled.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import mentionsDemo from './mentions.vue'
import mentionsSource from './mentions.vue?raw&highlighted'
import multipleTriggersDemo from './multiple-triggers.vue'
import multipleTriggersSource from './multiple-triggers.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import slashCommandsDemo from './slash-commands.vue'
import slashCommandsSource from './slash-commands.vue?raw&highlighted'

const shell = { className: 'chat-preview-composer' }

export const chatComposerInputOverview = defineDemo(overviewDemo, overviewSource, shell)
export const chatComposerInputControlled = defineDemo(controlledDemo, controlledSource, shell)
export const chatComposerInputDisabled = defineDemo(disabledDemo, disabledSource, shell)
export const chatComposerInputMentions = defineDemo(mentionsDemo, mentionsSource, shell)
export const chatComposerInputMultipleTriggers = defineDemo(multipleTriggersDemo, multipleTriggersSource, shell)
export const chatComposerInputSlashCommands = defineDemo(slashCommandsDemo, slashCommandsSource, shell)
