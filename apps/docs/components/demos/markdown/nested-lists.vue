<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '## Bulleted\n\n- Bullet at depth 0\n  - Bullet at depth 1\n    - Bullet at depth 2\n      - Bullet at depth 3\n        - Bullet at depth 4\n          - Bullet at depth 5\n            - Bullet at depth 6\n              - Bullet at depth 7\n                - Bullet at depth 8\n\n## Numbered\n\n1. Number at depth 0\n   1. Number at depth 1\n      1. Number at depth 2\n         1. Number at depth 3\n            1. Number at depth 4\n               1. Number at depth 5\n                  1. Number at depth 6\n                     1. Number at depth 7\n                        1. Number at depth 8\n\n## Mixed\n\n- Mixed at depth 0\n  1. Mixed at depth 1\n     - Mixed at depth 2\n       1. Mixed at depth 3',
  '## Bulleted\n\n- Bullet at depth 0\n  - Bullet at depth 1\n    - Bullet at depth 2\n      - Bullet at depth 3\n        - Bullet at depth 4\n          - Bullet at depth 5\n            - Bullet at depth 6\n              - Bullet at depth 7\n                - Bullet at depth 8\n\n## Numbered\n\n1. Number at depth 0\n   1. Number at depth 1\n      1. Number at depth 2\n         1. Number at depth 3\n            1. Number at depth 4\n               1. Number at depth 5\n                  1. Number at depth 6\n                     1. Number at depth 7\n                        1. Number at depth 8\n\n## Mixed\n\n- Mixed at depth 0\n  1. Mixed at depth 1\n     - Mixed at depth 2\n       1. Mixed at depth 3',
))
</script>

<template>
  <Markdown :content="content" />
</template>
