---
title: DiffViewer
---

# DiffViewer

只读的代码 diff：按文件展示路径、增删行数和 hunks，支持统一视图、分栏视图和行内高亮。

<script setup lang="ts">
import { labDiffViewer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labDiffViewer" description="用 createDiffFile 从两段文本生成文件 diff，再分别以统一视图和分栏视图展示。" locale="zh" title="基本用法" /></ClientOnly>

## 导入

```ts
import { createDiffFile, DiffViewer, parseUnifiedDiff } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `file` | `DiffViewerFile` | 必填 | 要展示的文件。用 `parseUnifiedDiff` 或 `createDiffFile` 生成。 |
| `viewMode` | `'unified' \| 'split'` | `'unified'` | 单列展示，或旧文件/新文件左右分栏。 |
| `language` | `string` | 按扩展名推断 | 语法高亮语言；未知扩展名按纯文本展示。 |
| `hasLineNumbers` | `boolean` | `true` | 显示旧文件和新文件的行号列。 |
| `isWrapped` | `boolean` | `false` | 长行换行，而不是横向滚动。 |
| `inlineHighlight` | `'word' \| 'char' \| 'none'` | `'word'` | 成对删除/新增行内按词或按字符高亮变化。 |
| `isCollapsible` | `boolean` | `true` | 让文件头成为可折叠开关；需要文件路径来命名控件。 |
| `isCollapsed` | `boolean` | 非受控 | 受控的折叠状态。 |
| `defaultIsCollapsed` | `boolean` | `false` | 非受控时的初始折叠状态。 |
| `maxHeight` | `number \| string` | `undefined` | 代码区最大高度，超出后滚动。 |
| `syntaxTheme` | `SyntaxThemeDefinition` | `undefined` | 只给这个实例使用的语法主题。 |
| `label` | `string` | `'Diff'` | 没有文件路径时，代码区的无障碍名称。 |
| `renderLineAnnotation` | `(ref) => VNodeChild` | `undefined` | 在某一行下方渲染整行内容，例如评审评论；分栏时放在该行自己的一侧。 |

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `collapsedChange` | `(isCollapsed: boolean)` | 文件头折叠状态变化。 |
| `update:isCollapsed` | `(isCollapsed: boolean)` | 支持 `v-model:isCollapsed`。 |
| `lineNumberClick` | `(ref: DiffViewerLineRef, event: MouseEvent)` | 行号被点击。只有行锚点一侧的数字是按钮。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `headerEnd` | 文件头右侧内容，例如“已查看”复选框。 |

## 工具函数

```ts
const files = parseUnifiedDiff(patch) // 一个文件一条记录
const file = createDiffFile({
  path: 'src/app.ts',
  oldValue: before,
  newValue: after,
  contextLines: 3,
})
```

`parseUnifiedDiff` 接受 `git diff`、`diff -u` 和单独的 hunk，读不出来时返回空数组，不会抛错。`createDiffFile` 用 Myers 行级 diff 从两段文本生成同一种 `DiffViewerFile`；`contextLines` 默认 3，可以用 `oldPath: null` 或 `newPath: null` 标记新增/删除文件。
