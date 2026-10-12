---
layout: component-docs
title: 元数据列表
outline: false
footer: false
---

## 属性

### MetadataList

<div class="component-api-table" role="region" aria-label="MetadataList 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>'multi' | 'single' | number</code></td>
        <td><code>'single'</code></td>
        <td>单列时标签在值旁边。数字或 <code>multi</code> 把标签叠在值上面。<code>multi</code> 按至少 280px 的轨道自动填充。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>{ position?: 'start' | 'top', width?: number | string }</code></td>
        <td>单列在旁边，其余在上方</td>
        <td><code>width</code> 决定标签轨道宽度，只在标签位于值旁边时生效。数字按像素计。</td>
      </tr>
      <tr>
        <td><code>maxNumOfItems</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>超出这个数量的项收进「显示更多」。水平排列时忽略。</td>
      </tr>
      <tr>
        <td><code>orientation</code></td>
        <td><code>'vertical' | 'horizontal'</code></td>
        <td><code>'vertical'</code></td>
        <td>水平排列会换行，并忽略 <code>columns</code>、<code>label</code> 和 <code>maxNumOfItems</code>。</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>列表上方的纯文本标题。复杂内容用 <code>title</code> 插槽。</td>
      </tr>
    </tbody>
  </table>
</div>

### MetadataListItem

<div class="component-api-table" role="region" aria-label="MetadataListItem 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>字段名。默认插槽是值。<code>icon</code> 插槽画在标签前面。</td>
      </tr>
    </tbody>
  </table>
</div>

## 主题

`packages/core/styles/metadata-list.css` 读取语义 token。标签是 medium 字重的正文字号，颜色是次要文字。值是主要文字色。左右排列时行距 8px、列距 16px，值这一行至少 24px 高。上下堆叠时间距 2px。标题下方留 12px。「显示更多」使用强调色。

## 原生属性

其余属性落到根元素 `<dl>`，以及每一项的 `<dt>` 或包裹元素上。
