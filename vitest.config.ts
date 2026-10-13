import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['packages/**/*.test.ts', 'tests/**/*.test.ts'],
    // Vitest stubs every CSS import, including `?raw`. The playground reads
    // Neutral tokens from that source, so keep those files intact.
    css: {
      include: [/\.css\?raw(?:&|$)/],
    },
  },
}))
