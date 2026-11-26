---
layout: component-docs
title: useTableRowsVirtualization
outline: false
footer: false
---

配置是 `MaybeRefOrGetter`，传 getter 或 ref，插件就能一直读到最新的值。

## 参数

<div class="component-api-table" role="region" aria-label="useTableRowsVirtualization 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>rowHeight</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>一行的总高度（CSS 像素），含内边距和分隔线。行不会比它矮；所有挂载的行一起变高时，按量到的行高继续窗口化。</td>
      </tr>
      <tr>
        <td><code>initialViewportHeight</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>首帧（服务端渲染、还没量到视口时）用来估算要渲染几行的视口高度（CSS 像素）。它不决定表格多高。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableRowsVirtualization 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>rowModel</code></td>
        <td><code>'flat'</code></td>
        <td>声明这个插件只处理扁平行。</td>
      </tr>
      <tr>
        <td><code>virtualization</code></td>
        <td><code>TableVirtualizationContribution</code></td>
        <td>把行高和初始视口高度交给表格。表格据此决定挂载哪些行，条件不满足时退回全部渲染。</td>
      </tr>
    </tbody>
  </table>
</div>
