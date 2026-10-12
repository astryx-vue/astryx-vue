---
layout: component-docs
title: 拖拽分隔条
outline: false
footer: false
---

## Resize Handle Props

<div class="component-api-table" role="region" aria-label="Resize Handle Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>direction</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td><code>horizontal</code> 改宽度，<code>vertical</code> 改高度。横向分隔条的 <code>aria-orientation</code> 是 <code>vertical</code>。</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>'inline' | 'overlay'</code></td>
        <td><code>'inline'</code></td>
        <td><code>inline</code> 占一格，<code>overlay</code> 贴在父级边缘。</td>
      </tr>
      <tr>
        <td><code>isReversed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>面板在结束边时，把拖拽方向反过来。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>关掉指针和键盘调整。</td>
      </tr>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>画出 1px 分隔线。线本身就是把手。</td>
      </tr>
      <tr>
        <td><code>isAlwaysVisible</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>静止时也显示握把。</td>
      </tr>
      <tr>
        <td><code>pillPlacement</code></td>
        <td><code>'auto' | 'start' | 'end' | 'center'</code></td>
        <td><code>'auto'</code></td>
        <td>握把相对分隔线的位置。<code>auto</code> 靠面板一侧，面板收到 0 时翻到另一侧。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>当前语言</td>
        <td>无障碍名称。英文默认是 “Resize handle”，中文默认是 “拖拽分隔条”。</td>
      </tr>
      <tr>
        <td><code>resizable</code></td>
        <td><code>ResizableProps</code></td>
        <td>-</td>
        <td><code>useResizable</code> 返回的 <code>props</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Resize Handle Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>替换握把。分隔条角色和键盘行为仍留在把手上。</td>
      </tr>
    </tbody>
  </table>
</div>

## useResizable

从 <code>@astryx-vue/core</code> 引入。单个区域返回 <code>{ size, isCollapsed, collapse, expand, resize, props }</code>。传入 <code>regions</code> 时，每个键各返回一份。

<div class="component-api-table" role="region" aria-label="useResizable options" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>defaultSize</code></td>
        <td><code>number | string | ResizablePercentSize</code></td>
        <td><code>250</code></td>
        <td>初始尺寸。数字是像素。设置了 <code>snaps</code> 时，初值会吸到最近的点。</td>
      </tr>
      <tr>
        <td><code>minSize</code></td>
        <td><code>number | string | ResizablePercentSize</code></td>
        <td><code>50</code></td>
        <td>展开时的最小尺寸。</td>
      </tr>
      <tr>
        <td><code>maxSize</code></td>
        <td><code>number | string | ResizablePercentSize</code></td>
        <td><code>Infinity</code></td>
        <td>最大尺寸。</td>
      </tr>
      <tr>
        <td><code>collapsible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>允许收到 0。</td>
      </tr>
      <tr>
        <td><code>collapsedSize</code></td>
        <td><code>number</code></td>
        <td><code>40</code></td>
        <td>拖拽低于这个像素值时收起。</td>
      </tr>
      <tr>
        <td><code>snaps</code></td>
        <td><code>number[]</code></td>
        <td>-</td>
        <td>吸附的像素值。距离相等时取第一个。</td>
      </tr>
      <tr>
        <td><code>shrinkOrder</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>多个区域共用 <code>containerRef</code> 时的收缩顺序。容器比这些区域更窄时，数字更小的先收到 <code>minSize</code>。拖拽仍然改的是该区域自己的目标尺寸。</td>
      </tr>
      <tr>
        <td><code>direction</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td>百分比尺寸读取容器的哪一条轴。</td>
      </tr>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>-</td>
        <td>用来解析百分比的元素。还没量到时按 1200 计算，并且不写入存储。</td>
      </tr>
      <tr>
        <td><code>autoSaveId</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>把 <code>{ size, isCollapsed }</code> 存在 <code>astryx-resizable:</code> 加这个 id。多个区域会再接 <code>:key</code>。</td>
      </tr>
      <tr>
        <td><code>defaultIsCollapsed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td><code>collapsible</code> 为 true 时，一开始就收起。</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控的收起状态。变化通过 <code>onCollapseChange</code> 报出。</td>
      </tr>
      <tr>
        <td><code>onSizeChange</code></td>
        <td><code>(size: number) =&gt; void</code></td>
        <td>-</td>
        <td>尺寸落下之后调用。</td>
      </tr>
      <tr>
        <td><code>onCollapseChange</code></td>
        <td><code>(isCollapsed: boolean) =&gt; void</code></td>
        <td>-</td>
        <td>收起状态变化时调用。</td>
      </tr>
      <tr>
        <td><code>regions</code></td>
        <td><code>Record&lt;string, ResizableRegionConfig&gt;</code></td>
        <td>-</td>
        <td>一次管多个区域。每一项接受上面的尺寸字段。</td>
      </tr>
    </tbody>
  </table>
</div>

<code>percent(value, { min })</code> 或 <code>percent(value, { max })</code> 用来写百分比尺寸。<code>min</code> 和 <code>max</code> 的形状是 <code>{ type: 'pixel', value }</code>。

方向键移动 10px，按住 Shift 移动 50px。Home、End、Enter 分别跳到最小值、最大值和展开时的尺寸。

## 原生属性

`ResizeHandle` 渲染 `<div role="separator">`。

以下内容落到这个元素上：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

`class` 会合并。
