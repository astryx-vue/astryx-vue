import { defineDemo } from '../../demo-infra/defineDemo'
import transcriptDemo from './transcript.vue'
import transcriptSource from './transcript.vue?raw&highlighted'

export const useSpeechRecognitionTranscript = defineDemo(transcriptDemo, transcriptSource)
