import { defineDemo } from '../../demo-infra/defineDemo'
import playlistDemo from './playlist.vue'
import playlistSource from './playlist.vue?raw&highlighted'

export const useReorderablePlaylist = defineDemo(playlistDemo, playlistSource, { className: 'list-preview' })
