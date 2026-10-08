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
    'i-carbon-arrows-vertical',
    'i-carbon-calendar',
    'i-carbon-checkmark',
    'i-carbon-checkmark-filled',
    'i-carbon-chevron-down',
    'i-carbon-chevron-right',
    'i-carbon-column',
    'i-carbon-copy',
    'i-carbon-cut',
    'i-carbon-filter',
    'i-carbon-grid',
    'i-carbon-information',
    'i-carbon-launch',
    'i-carbon-list',
    'i-carbon-microphone',
    'i-carbon-overflow-menu-horizontal',
    'i-carbon-search',
    'i-carbon-settings',
    'i-carbon-stop-filled',
    'i-carbon-tools',
    'i-carbon-trash-can',
    'i-carbon-upload',
    'i-carbon-view-off',
    'i-carbon-warning',
  ],
})
