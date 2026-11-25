---
layout: component-docs
title: 标题
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Heading Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>level</code></td>
        <td><code>HeadingLevel</code></td>
        <td>-</td>
        <td>标题层级（1–6），决定渲染 h1–h6 中的哪个语义元素。数字字符串按数字读；没写或不是 1–6 时按 2 级渲染，并在开发时给出警告。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>HeadingType</code></td>
        <td>-</td>
        <td>视觉类型变体，可选 display-1、display-2、display-3、body、large、label、supporting。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>HeadingColor</code></td>
        <td><code>'primary'</code></td>
        <td>标题的文字颜色，可选 primary、secondary、accent、inherit。</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>HeadingWeight</code></td>
        <td>-</td>
        <td>字重覆盖，可选 regular、medium、semibold、bold。</td>
      </tr>
      <tr>
        <td><code>display</code></td>
        <td><code>HeadingDisplay</code></td>
        <td><code>'block'</code></td>
        <td>显示类型：<code>block</code> 或 <code>inline</code>。</td>
      </tr>
      <tr>
        <td><code>accessibilityLevel</code></td>
        <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
        <td>-</td>
        <td>和视觉 <code>level</code> 不同时，读屏使用的大纲级别。元素仍是 <code>h{level}</code>。</td>
      </tr>
      <tr>
        <td><code>textWrap</code></td>
        <td><code>'wrap' | 'nowrap' | 'balance' | 'pretty'</code></td>
        <td>-</td>
        <td>CSS <code>text-wrap</code>。</td>
      </tr>
      <tr>
        <td><code>wordBreak</code></td>
        <td><code>'break-word' | 'break-all'</code></td>
        <td>单行截断为 <code>break-all</code>，多行为 <code>break-word</code></td>
        <td>截断时长词如何断开。没有截断时，比一行还长的串（URL、ID）会换行（<code>overflow-wrap: break-word</code>），普通文档流里不会撑出横向滚动。放在 flex 行里时，记得给 flex 子项设 <code>min-width: 0</code> 让它能收缩。你自己设了 <code>overflow-wrap: anywhere</code> 的容器管不到这里的文字；Astryx 自带的容器会把它们的换行方式传进来。</td>
      </tr>
      <tr>
        <td><code>justify</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>对齐方式。<code>start</code> 和 <code>end</code> 跟随书写方向。</td>
      </tr>
      <tr>
        <td><code>hasCapsize</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>用 <code>text-box-trim</code> 裁掉大写字母高度以上的空白和基线以下的空白，让字形贴住盒子边缘。打开后强制块级布局。</td>
      </tr>
      <tr>
        <td><code>hasStrikethrough</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>给文字加删除线。</td>
      </tr>
      <tr>
        <td><code>hasTruncateTooltip</code></td>
        <td><code>boolean | 'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>true</code></td>
        <td>截断之后要不要把全文放进提示。<code>false</code> 关掉，同时也不再测量。没被截断时不会弹出。提示等到第一次悬停、轻点或键盘聚焦才挂载，在那之前元素上没有提示层，也没有 <code>aria-describedby</code>。</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>最大显示行数，超出部分截断并显示省略号，0 表示不截断。</td>
      </tr>
    </tbody>
  </table>
</div>



## 原生属性

根元素为 `<h1>` 至 `<h6>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。自己写的 `aria-level` 优先于 `accessibilityLevel` 算出的值。
- `data-*` 属性。
- `class`。
- `style`。`maxLines` 大于 1 时，行数截断会替换 `style` 里的 `-webkit-line-clamp`。
