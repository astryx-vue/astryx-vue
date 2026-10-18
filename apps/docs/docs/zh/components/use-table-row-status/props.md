---
layout: component-docs
title: useTableRowStatus
outline: false
footer: false
---

配置对象是 `MaybeRefOrGetter`：传一个 getter 或 ref，插件才会跟着最新值走。

## 参数

<div class="component-api-table" role="region" aria-label="useTableRowStatus 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getStatus</code></td>
        <td><code>(item: T) =&gt; TableRowStatus | null</code></td>
        <td>—</td>
        <td>返回语义状态或自定义标记。<code>{status, label}</code> 只认 success、error、warning 三个值，图标和色调从当前主题取。<code>{color, icon?, label}</code> 是自定义标记这条路：颜色只负责上色，不给图标就画 8px 圆点，给了图标就画你指定的那个。颜色名就算叫 success、error、warning，不给图标也还是圆点。可用的图标名：close、chevronDown、chevronLeft、chevronRight、chevronsLeft、chevronsRight、check、success、error、warning、info、calendar、clock、externalLink、menu、moreHorizontal、search、upload、arrowUp、arrowDown、arrowsUpDown、funnel、eyeSlash、viewColumns、copy、checkDouble、wrench、stop、microphone、image。两种写法互斥，<code>label</code> 必填并通过 <code>role="img"</code> 读出来，返回 <code>null</code> 则这一格是空的。</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="useTableRowStatus 状态字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>status</code></td>
        <td><code>'success' | 'warning' | 'error'</code></td>
        <td>语义结果。图标和色调都来自主题，和 <code>color</code> 互斥。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>'accent' | 'success' | 'error' | 'warning' | 'red' | 'orange' | 'green' | 'yellow' | 'blue' | 'gray' | (string &amp; {})</code></td>
        <td>标记的颜色。没有 <code>icon</code> 时给 8px 圆点上色；直接给 CSS 颜色就按原样用。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string</code></td>
        <td>上面列出的图标名；带 <code>:</code> 的字符串按 Iconify id 处理。颜色名会沿用 Icon 的颜色映射，原始 CSS 颜色则精确按你给的上色。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>标记的无障碍名称，同时作为悬浮提示显示。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableRowStatus 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>在最前面加状态列。列键是 <code>__rowStatus</code>，宽 <code>pixel(28)</code>，不能拖宽。列表头视觉上为空，但带有来自内置文案的本地化名称。</td>
      </tr>
    </tbody>
  </table>
</div>
