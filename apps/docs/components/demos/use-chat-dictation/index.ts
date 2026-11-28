import { defineDemo } from '../../demo-infra/defineDemo'
import voiceInputDemo from './voice-input.vue'
import voiceInputSource from './voice-input.vue?raw&highlighted'

export const useChatDictationVoiceInput = defineDemo(voiceInputDemo, voiceInputSource)
