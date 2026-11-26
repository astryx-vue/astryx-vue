import { defineDemo } from '../../demo-infra/defineDemo'
import editorToolbarDemo from './editor-toolbar.vue'
import editorToolbarSource from './editor-toolbar.vue?raw&highlighted'

export const useOverflowEditorToolbar = defineDemo(editorToolbarDemo, editorToolbarSource)
