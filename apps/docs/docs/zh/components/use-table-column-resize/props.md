---
layout: component-docs
title: useTableColumnResize
outline: false
footer: false
---

## 参数

`useTableColumnResize()` 只接一个配置对象。宽度存在 `ref` 里时用 getter 包一层，表格每次读都能拿到最新的值：`useTableColumnResize(() => ({ ... }))`。

<div class="component-api-table" role="region" aria-label="useTableColumnResize 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columnWidths</code></td>
        <td><code>Record&lt;string, number&gt;</code></td>
        <td><code>{}</code></td>
        <td>已经提交的像素宽度，键是列 key。有值时覆盖列自己声明的宽度。</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(updates: Record&lt;string, number&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>一次拖动结束（松开指针或按键）时调用。参数是「列 key → 新宽度」的映射，包含所有宽度变了的列，把它并进 <code>columnWidths</code> 就是新的状态。最后一列不在里面，它的宽度跟着剩余空间走。</td>
      </tr>
      <tr>
        <td><code>minWidth</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>拖动时所有列共用的最窄像素，一设就盖过每一列自己的下限。</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number</code></td>
        <td><code>Infinity</code></td>
        <td>拖动时所有列共用的最宽像素。</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>readonly TableColumn&lt;T&gt;[]</code></td>
        <td>—</td>
        <td>列定义。用来取每一列的下限，并区分比例列和固定像素列，好决定相邻列和最后一列怎么动。表格自己会传，只有自己调下面的辅助函数时才需要给。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableColumnResize()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件约定里的三个字段：

<div class="component-api-table" role="region" aria-label="useTableColumnResize 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>widthFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; number | undefined</code></td>
        <td>返回某一列已经提交的宽度，没有就返回 <code>undefined</code>。</td>
      </tr>
      <tr>
        <td><code>resizeFor</code></td>
        <td><code>(column: TableColumn&lt;T&gt;, columns: readonly TableColumn&lt;T&gt;[]) =&gt; TableColumnResizeContribution | null</code></td>
        <td>说明一列怎么参与拖动：当前宽度、最窄、最宽、让出宽度的相邻列，以及这一列有没有把手。</td>
      </tr>
      <tr>
        <td><code>onColumnResizeEnd</code></td>
        <td><code>(updates: Record&lt;string, number&gt;) =&gt; void</code></td>
        <td><code>Table</code> 把变了的列交给它。它把宽度取整到整像素，再转给你的 <code>onColumnResizeEnd</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 辅助函数

同一个模块也导出插件内部用的计算函数，自己的界面需要算宽度时可以直接用。

<div class="component-api-table" role="region" aria-label="useTableColumnResize 辅助函数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columnResizeMinWidth</code></td>
        <td><code>(width: ColumnWidth | undefined, globalMinWidth?: number) =&gt; number</code></td>
        <td>一列能拖到的最窄像素：设了全局下限就用它，否则用列自己的下限。</td>
      </tr>
      <tr>
        <td><code>isProportionalColumnWidth</code></td>
        <td><code>(width: ColumnWidth | undefined) =&gt; boolean</code></td>
        <td>比例列和没写宽度的列都算比例列。</td>
      </tr>
      <tr>
        <td><code>resizeColumnWidths</code></td>
        <td><code>(plan: ColumnResizePlan, delta: number) =&gt; number[]</code></td>
        <td>把指针位移（像素）套到一组列宽快照上，返回算好的每一列宽度。</td>
      </tr>
      <tr>
        <td><code>columnResizeStep</code></td>
        <td><code>(isShiftKey: boolean) =&gt; number</code></td>
        <td>按一下方向键走多少像素：10px，按住 Shift 是 50px。</td>
      </tr>
      <tr>
        <td><code>columnResizeDirectionSign</code></td>
        <td><code>(direction: string) =&gt; 1 | -1</code></td>
        <td>横向位移在书写方向上的符号。RTL 返回 <code>-1</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
