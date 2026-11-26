// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import VideoPlayer from './VideoPlayer.vue'

describe('videoPlayer SSR', () => {
  it('renders on the server, where media element classes do not exist', async () => {
    const app = createSSRApp({
      render: () => h(VideoPlayer, { src: '/clip.mp4', label: 'Product tour' }),
    })
    const html = await renderToString(app)
    expect(html).toContain('<video')
    expect(html).toContain('/clip.mp4')
  })
})
