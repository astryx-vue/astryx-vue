---
layout: component-docs
title: 表格
outline: false
footer: false
---

## 属性

### Table

<div class="component-api-table" role="region" aria-label="Table 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>T[]</code></td>
        <td>-</td>
        <td>行数据。不传时，用默认插槽自己拼表格。</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>TableColumn&lt;T&gt;[]</code></td>
        <td>-</td>
        <td><code>key</code>、<code>header</code>、<code>width</code>、<code>align</code>、<code>verticalAlign</code>、<code>sortable</code>、<code>filter</code> 和 <code>renderCell</code>。</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>string</code></td>
        <td><code>'id'</code></td>
        <td>当作行身份的字段。</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>单元格内边距。紧凑 4×8，适中 8×12，宽松 12×16。</td>
      </tr>
      <tr>
        <td><code>dividers</code></td>
        <td><code>'rows' | 'columns' | 'grid' | 'none'</code></td>
        <td><code>'rows'</code></td>
        <td>表头始终有底边。表体最后一行不再画行线。</td>
      </tr>
      <tr>
        <td><code>isStriped</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>偶数行使用淡底。</td>
      </tr>
      <tr>
        <td><code>hasHover</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>悬停填色，只在指针能悬停时出现。</td>
      </tr>
      <tr>
        <td><code>verticalAlign</code></td>
        <td><code>'top' | 'middle' | 'bottom'</code></td>
        <td><code>'middle'</code></td>
        <td>默认垂直对齐。列上可以单独覆盖。</td>
      </tr>
      <tr>
        <td><code>textOverflow</code></td>
        <td><code>'wrap' | 'truncate'</code></td>
        <td><code>'wrap'</code></td>
        <td>文字换行，或截成一行。</td>
      </tr>
      <tr>
        <td><code>plugins</code></td>
        <td><code>Record&lt;string, TablePlugin&lt;T&gt;&gt;</code></td>
        <td>-</td>
        <td>排序、选择、分页、列设置、拖宽度和过滤。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>本地化的「表格」</td>
        <td>表格的无障碍名称。</td>
      </tr>
    </tbody>
  </table>
</div>

`proportional(value)` 分剩余宽度，默认最小 120px。没写宽度的列是弹性列，下限 60px。`pixel(value)` 同时设定宽度和最小宽度。

### TableSelectionToolbar

`count` 是选中的行数。`clear` 事件让调用方清掉选择。默认插槽放批量操作。数量、清除文案和区域名称来自表格的文案。

## 主题

表头用标签字号、半粗字重和次要文字色。表体用正文字号。选中行用强调色的淡底。斑马纹用淡底。悬停用悬停遮罩。放进卡片时，滚动区域会用卡片公布的容器内边距，让首尾单元格和标题对齐。
