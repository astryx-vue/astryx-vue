---
layout: component-docs
title: useGridFocus
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useGridFocus 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseGridFocusOptions</code></td>
        <td>—</td>
        <td>必填。网格焦点行为的配置对象。</td>
      </tr>
      <tr>
        <td><code>options.columns</code></td>
        <td><code>number | MaybeRefOrGetter&lt;number&gt;</code></td>
        <td>—</td>
        <td>必填。网格列数。上下方向键按这个数跨格。</td>
      </tr>
      <tr>
        <td><code>options.cellSelector</code></td>
        <td><code>string</code></td>
        <td><code>'button:not([disabled]), [tabindex]:not([tabindex="-1"])'</code></td>
        <td>选格子的选择器。要按 DOM 顺序选中<strong>所有</strong>位置，禁用和空的也算，这样行列几何才对得上。</td>
      </tr>
      <tr>
        <td><code>options.isCellFocusable</code></td>
        <td><code>(cell: HTMLElement) =&gt; boolean</code></td>
        <td>每个选中的格子都能接焦点</td>
        <td>判断某个格子能不能接焦点。不传就当成都能接。</td>
      </tr>
      <tr>
        <td><code>options.getFocusTarget</code></td>
        <td><code>(cell: HTMLElement) =&gt; HTMLElement | null</code></td>
        <td>格子本身</td>
        <td>从一个格子算出真正要聚焦的元素，例如 <code>role="gridcell"</code> 里包着的按钮。</td>
      </tr>
      <tr>
        <td><code>options.onNavigateBefore</code></td>
        <td><code>(column: number, offset: number) =&gt; void</code></td>
        <td>—</td>
        <td>焦点要走到第一个格子之前时调用。拿到当前列序号和步长（横向是 1，纵向是列数）。</td>
      </tr>
      <tr>
        <td><code>options.onNavigateAfter</code></td>
        <td><code>(column: number, offset: number) =&gt; void</code></td>
        <td>—</td>
        <td>焦点要走到最后一个格子之后时调用。参数同上。</td>
      </tr>
      <tr>
        <td><code>options.onPageUp</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>按 Page Up 时调用（例如日历翻到上个月）。不传就不拦这个键。</td>
      </tr>
      <tr>
        <td><code>options.onPageDown</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>按 Page Down 时调用（例如日历翻到下个月）。不传就不拦这个键。</td>
      </tr>
      <tr>
        <td><code>options.hasRovingTabIndex</code></td>
        <td><code>boolean | MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>整张网格只留一个 Tab 落脚点：当前格子的目标元素 <code>tabindex="0"</code>，其余 <code>-1</code>。挂载后补上，方向键移动时跟着走。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useGridFocus 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>gridRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>挂到网格容器上的模板 ref。</td>
      </tr>
      <tr>
        <td><code>handleKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>挂到网格容器的 <code>keydown</code> 上。</td>
      </tr>
      <tr>
        <td><code>handleFocus</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>挂到网格容器的 <code>focusin</code> 上。开着 <code>hasRovingTabIndex</code> 时保持 Tab 落脚点同步，没开就什么都不做，挂上也无害。</td>
      </tr>
      <tr>
        <td><code>focusCell</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>按序号聚焦某个格子，序号会夹到合法范围里。接不了焦点的格子会跳过。</td>
      </tr>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦第一个能接焦点的格子。</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦最后一个能接焦点的格子。</td>
      </tr>
    </tbody>
  </table>
</div>
