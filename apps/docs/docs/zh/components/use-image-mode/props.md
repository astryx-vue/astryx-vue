---
layout: component-docs
title: useImageMode
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useImageMode 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td><code>MaybeRefOrGetter&lt;string | null | undefined&gt;</code></td>
        <td>—</td>
        <td>要分析的图片地址。普通字符串、ref、getter 都行。为 null 或 undefined 时直接给 <code>fallback</code>。必填。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseImageModeOptions&gt;</code></td>
        <td><code>{}</code></td>
        <td>分析的可选配置。每次分析时重新读，写成 getter 就能一直取到最新值。</td>
      </tr>
      <tr>
        <td><code>options.region</code></td>
        <td><code>ImageSampleRegion</code></td>
        <td>整张图</td>
        <td>只采这一块。坐标都按 0 到 1 的比例给出：<code>{ x, y, width, height }</code>。</td>
      </tr>
      <tr>
        <td><code>options.threshold</code></td>
        <td><code>number</code></td>
        <td><code>0.5</code></td>
        <td>分深浅的亮度阈值。低于算暗，高于算亮。</td>
      </tr>
      <tr>
        <td><code>options.fallback</code></td>
        <td><code>'dark' | 'light' | null</code></td>
        <td><code>null</code></td>
        <td>还在加载，或者读图失败时返回的值。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useImageMode 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mode</code></td>
        <td><code>Ref&lt;'dark' | 'light' | null&gt;</code></td>
        <td>图片的深浅。还在加载时是 <code>null</code>，<code>src</code> 为空时是 <code>fallback</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

分析的两段也一起导出了：`perceptualLightness(r, g, b)` 返回一个颜色的 APCA 感知亮度，`imageModeFromPixels(pixels, threshold)` 把一段 RGBA 像素平均成 `'dark'` 或 `'light'`。
