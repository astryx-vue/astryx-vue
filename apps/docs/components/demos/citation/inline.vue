<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <p class="citation-preview">
    {{ pick('React 用虚拟 DOM 来减少昂贵的 DOM 操作', 'React uses a virtual DOM to minimize expensive DOM operations') }}
    <Citation :number="1" variant="number" :source="{ title: pick('React 文档', 'React Documentation'), url: 'https://react.dev' }" />.
    {{ pick('这个做法受到更早的函数式界面框架启发', 'This approach was inspired by earlier functional UI frameworks') }}
    <Citation :number="2" variant="number" :source="{ title: pick('函数式界面', 'Functional UI'), url: 'https://example.com/functional-ui' }" />.
    {{ pick('TypeScript 给 JavaScript 加上静态类型，重构更稳妥', 'TypeScript adds static types to JavaScript for safer refactoring') }}
    <Citation :number="3" :source="{ title: pick('TypeScript 文档', 'TypeScript Documentation'), url: 'https://www.typescriptlang.org/docs/' }" />.
  </p>
</template>
