import { defineDemo } from '../../demo-infra/defineDemo'
import streamingResponseDemo from './streaming-response.vue'
import streamingResponseSource from './streaming-response.vue?raw&highlighted'

export const useStreamingTextResponse = defineDemo(streamingResponseDemo, streamingResponseSource)
