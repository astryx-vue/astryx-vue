---
layout: component-docs
title: 代码
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { codeBasic, codeCollapsible, codeInline, codeLineNumbers } from '../../../../components/demos/code'
</script>

## 使用方法

`Code` 用来标注句子里的短技术引用，例如函数名、属性名、文件路径或者命令行参数。它渲染的是语义化的 `<code>` 元素，等宽字体配浅色底，长标识符会折行，而不会把整段文字撑宽。

`CodeBlock` 用来展示一行或多行只读代码。它补齐了一段代码独立出现时需要的部分：带标题和语言名的头部、复制按钮、可选的行号、可选的高亮行、可选的语法着色、限高的滚动区域，以及可选的折叠控件。两个组件都从 `@astryx-vue/core/Code` 导出。

```vue
<script setup lang="ts">
import { Code, CodeBlock } from '@astryx-vue/core/Code'

const snippet = 'const total = items.length'
</script>

<template>
  <p>用 <Code>items.length</Code> 统计条数。</p>

  <CodeBlock :code="snippet" language="typescript" title="count.ts" />
</template>
```

`language` 决定用哪套分词器。内置支持 `typescript`、`javascript`、`tsx`、`jsx`、`ts`、`js`、`json`、`html`、`xml`、`svg`、`css`、`scss`、`less`、`python`、`py`、`bash`、`sh`、`zsh`、`shell`、`php`、`hack`、`yaml`、`yml`、`markdown` 和 `md`。其他取值（包括 `plaintext`）都会原样显示，不做任何着色；`plaintext` 同时会隐藏语言标签，因为这个标签不提供任何信息。语言不认识不算错误：你也可以传入自己的 `tokenizer` 函数，返回带绝对偏移的 token，它只影响着色，显示和复制的文本始终是原始字符串。

标题或者可见的语言标签存在时会出现头部，复制按钮就放在头部里。两者都没有时，复制按钮会浮在代码块的右上角，所以没有头部也照样能复制。`hasLanguageLabel` 可以关掉语言标签，只留下标题。

行号默认关闭，用 `hasLineNumbers` 打开；行号栏的宽度按最大行号计算，所以代码列的起点是稳定的。`highlightLines` 接收从 1 开始的行号，把这些行加上底色以引起注意。长行不希望横向滚动时用 `isWrapped` 让它折行；用 `maxHeight` 限制高度，超出后纵向滚动，`0` 是合法取值，表示把正文收成和头部一样高。默认宽度贴着最长的一行：`width="fit-content"` 会让短代码保持紧凑（有一个最小宽度下限），`width="100%"` 则撑满父容器。`container="section"` 会去掉边框、圆角和背景，让代码块嵌在卡片或面板里时不再多画一层底色。

较长的代码块可以折叠。设置 `isCollapsible` 之后，只要头部可见并且代码行数达到 `collapsibleThreshold`（默认 10 行），头部就会变成折叠控件。代码块初始是展开的，通过 `aria-expanded` 报告状态，通过 `aria-controls` 指向被它控制的内容区域。折叠时这块区域仍然挂载，但会被设为 `inert`：它既不在 Tab 顺序里，也不在无障碍树上，不会变成一个看不见却能被键盘碰到的地方。如果控件消失了（例如标题被移除），代码块会自己重新展开。

复制按钮写入的是 `code` 原字符串，所以读者粘贴出来的内容和源码一致，不受着色、行号或者折行影响。写入成功后控件名称变为 `Copied`，图标从复制变成对勾，同时有一个礼貌的 live region 读出同一个词；悬停提示一直保持 `Copy code`，因为真正的确认是对勾。写入被拒绝时控件保持原状，也不触发任何事件。`copyLabel`、`copiedLabel`、`codeLabel` 带着英文默认值，用来做本地化。

代码视口是一个有名字的 `role="group"`，并且可以聚焦，键盘用户因此能滚动溢出的代码。复制按钮和折叠控件是并列的兄弟节点，各自有自己的无障碍名称，按下一个不会连带触发另一个。语法颜色来自 `--astryx-code-syntax-*` 这一组 token，`highlightMode` 决定着色方式：`auto` 在浏览器支持良好时使用 CSS Custom Highlight API，否则回退到 span；`ranges` 完全通过该 API 着色，代码文本里不会多出任何元素；`spans` 则把每个 token 包进一个元素。三种方式的文本、语义和复制结果完全相同。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 只出现在句子里的短引用用 `Code`，能独立成立或者超过一行的代码用 `CodeBlock`。 |
| <Badge variant="success">推荐</Badge> | 让 `language` 和代码内容一致，着色才准确；代码来自某个文件时给一个 `title`，读者才知道它的出处。 |
| <Badge variant="success">推荐</Badge> | 行内代码出现在更大或更小的文字里时，用 `size="inherit"` 让它跟随所在行的大小。 |
| <Badge variant="success">推荐</Badge> | 长代码用 `maxHeight` 或者 `isCollapsible` 处理，不要再把它塞进自己的滚动容器里。 |
| <Badge variant="error">避免</Badge> | 给两行的代码打开行号。它只会增加噪音，没有人需要靠它找第几行。 |
| <Badge variant="error">避免</Badge> | 把整段说明文字放进 `CodeBlock`，或者用 `Code` 展示整个文件。每个组件只做一件事。 |
| <Badge variant="error">避免</Badge> | 指望颜色单独说明含义。着色只是把代码染上颜色，它不做解释。 |

## 示例

<DemoExample
  :demo="codeBasic"
  description="带标题和可见语言标签的代码块，复制按钮位于头部。"
  locale="zh"
  title="基础用法"
/>

<DemoExample
  :demo="codeInline"
  description="句子里的行内代码，次要色写法，以及在较大的文字里用 size=inherit 让它跟随字号。"
  locale="zh"
  title="行内代码"
/>

<DemoExample
  :demo="codeLineNumbers"
  description="打开行号，行号栏按最大行号占宽；两行加了底色，把注意力引到关键处。"
  locale="zh"
  title="行号与高亮"
/>

<DemoExample
  :demo="codeCollapsible"
  description="从头部折叠的长代码块，同时限制了最大高度，展开后纵向滚动而不是无限变高。"
  locale="zh"
  title="折叠与限高"
/>
