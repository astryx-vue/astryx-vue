---
layout: component-docs
title: 快捷键
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { kbdBasic, kbdKeyNames, kbdModifiers } from '../../../../components/demos/kbd'
</script>

## 使用方法

`Kbd` 把一段键盘快捷键画成一组按键徽章，例如 `⌘K`、`⇧↵`。它常出现在菜单项、工具提示和帮助文字里，让你在说明某个操作时顺带告诉用户它的快捷方式，而不必用一句“先按住 Command 再按 K”来描述。

快捷键用字符串传入，按键之间用 `+` 分隔：

```vue
<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <Kbd keys="mod+k" />
</template>
```

每个分段都会得到一枚独立的徽章，所以 `mod+k` 会画出两枚按键。分段周围的空格会被忽略，大小写也不敏感，`mod + K` 和 `mod+k` 完全等价；无法识别的分段会原样转成大写，例如 `f1` 显示为 `F1`。

`mod` 是唯一会随平台变化的按键：在 Apple 平台上它显示为 `⌘`，在其他平台上显示为 `Ctrl`。因此描述跨平台快捷键时优先写 `mod`，只有快捷键确实固定在某一侧修饰键上时才写 `ctrl`。其余具名按键都有固定的字形：

| 写法 | 显示 |
| --- | --- |
| `mod` | `⌘`（Apple 平台）/ `Ctrl`（其他平台） |
| `ctrl` | `⌃` |
| `alt` | `⌥` |
| `shift` | `⇧` |
| `enter` | `↵` |
| `backspace` | `⌫` |
| `tab` | `⇥` |
| `escape` | `Esc` |
| `up` / `down` / `left` / `right` | `↑` `↓` `←` `→` |
| `plus` | `+` |

`esc` 是 `escape` 的别名，`return` 是 `enter` 的别名，两者的渲染和朗读完全一致。由于 `+` 本身是分隔符，要表示加号键请写 `plus`，例如 `shift+plus`。

对屏幕阅读器来说，整组按键是一个名为 “Command + K” 的整体，徽章里的图形字符不会被逐个朗读——`⌘`、`⇧` 这类字形读出来没有意义，所以组件改用 `Command`、`Shift` 这样的词来描述这组快捷键。这也意味着 `Kbd` 只负责提示，它不会真的监听键盘，快捷键本身需要在产品里真正实现。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把快捷键放在它触发的操作旁边：菜单项右侧、工具提示里，或紧跟在说明文字之后。 |
| <Badge variant="success">推荐</Badge> | 用 `mod` 而不是 `ctrl` 或 `cmd` 描述跨平台快捷键，让 macOS 用户看到 `⌘`，其他用户看到 `Ctrl`。 |
| <Badge variant="success">推荐</Badge> | 只提示已经实现、并且在当前上下文里真的能按下的快捷键。错误的提示比没有提示更让人受挫。 |
| <Badge variant="success">推荐</Badge> | 快捷键的写法与产品文档、设置页保持一致，避免同一个操作出现两种写法。 |
| <Badge variant="error">避免</Badge> | 把 `Kbd` 当作发现操作的唯一途径。快捷键是可见控件的补充，不是替代品。 |
| <Badge variant="error">避免</Badge> | 在一个界面里堆满快捷键提示。这类提示属于次要信息，出现得太频繁就会盖过正文。 |
| <Badge variant="error">避免</Badge> | 为了省事手写 `⌘`、`⇧` 等字符代替组件。手写的字符不会随平台切换，屏幕阅读器也读不出它们的含义。 |

## 示例

<DemoExample
  :demo="kbdBasic"
  description="把快捷键放在它触发的操作旁边：标签在左，按键徽章在右，用户一眼就能把两者对应起来。"
  locale="zh"
  title="快捷键列表"
/>

<DemoExample
  :demo="kbdModifiers"
  description="mod 在 macOS 上显示为 ⌘，在其他平台显示为 Ctrl；ctrl、alt、shift 等修饰键各有固定字形，plus 用来表示加号键本身。"
  locale="zh"
  title="修饰键与组合键"
/>

<DemoExample
  :demo="kbdKeyNames"
  description="组件认识的全部按键写法，以及它们各自画出的字形。esc 与 return 分别是 escape 和 enter 的别名。"
  locale="zh"
  title="按键名称"
/>
