---
title: CodeEditor
---

# CodeEditor

CodeEditor 是一个轻量的代码输入区：受控文本、语法高亮、行号、占位和只读状态。它使用 `contenteditable="plaintext-only"` 与 CSS Custom Highlight API，不引入 Monaco。属于 Lab，只通过 `canary` 标签发布。

<script setup lang="ts">
import { labCodeEditor } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCodeEditor" description="编辑 TypeScript 代码，查看语法高亮和行号。Tab 缩进，Shift+Tab 反缩进，Escape 后 Tab 离开编辑器。" locale="zh" title="基本用法" /></ClientOnly>

## 导入

```ts
import { CodeEditor } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | 必填 | 受控文本。 |
| `label` | `string` | 必填 | 可编辑区域的无障碍名称。 |
| `language` | `string` | `'plaintext'` | 高亮语言。 |
| `hasLineNumbers` | `boolean` | `false` | 显示行号栏。 |
| `isReadOnly` | `boolean` | `false` | 只读；仍可聚焦和选择文本。 |
| `placeholder` | `string` | `undefined` | 空文本时显示的占位文字。 |
| `maxHeight` | `number \| string` | `undefined` | 内容区最大高度，超出后滚动。 |
| `size` | `'sm' \| 'md'` | `'md'` | 代码文字尺寸。 |
| `tokenizer` | `(code, language) => TokenLine[]` | core tokenizer | 自定义语法解析。 |
| `escapeHint` | `string` | 英文提示 | 告诉读屏用户如何离开 Tab 缩进区域。 |

## 事件

`change` 携带最新文本：

```vue
<CodeEditor :value="source" label="Source code" @change="source = $event" />
```

## 键盘操作

- `Tab` 插入两个空格。
- `Shift+Tab` 去掉当前行开头最多两个空格。
- `Enter` 保留当前行缩进。
- 输入括号或引号时自动补上配对符号，caret 留在中间。
- 因为 Tab 用于缩进，按一次 `Escape` 后，下一次 `Tab` 或 `Shift+Tab` 会离开编辑器；这个离开模式只用一次。重新输入后恢复普通缩进。
- 读屏通过 `aria-describedby` 读到 `escapeHint`。可以传本地化文本。

高亮使用 CSS Custom Highlight API，不把语法节点写进可编辑文本。大文本使用 core 的异步 tokenizer；卸载或内容变化时清理旧范围。
