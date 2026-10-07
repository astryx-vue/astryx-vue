import { icons as carbon } from '@iconify-json/carbon'
import { defineConfig, presetIcons } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      'components/**/*.{vue,ts}',
      'docs/**/*.{md,vue}',
    ],
  },
  presets: [
    presetIcons({
      collections: {
        carbon: () => carbon,
      },
      extraProperties: {
        display: 'block',
        height: '100%',
        width: '100%',
      },
    }),
  ],
  safelist: [
    'i-carbon-add',
    'i-carbon-copy',
    'i-carbon-information',
    'i-carbon-overflow-menu-horizontal',
    'i-carbon-search',
    'i-carbon-settings',
  ],
})
