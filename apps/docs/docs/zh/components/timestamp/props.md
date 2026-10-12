---
layout: component-docs
title: 时间戳
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Timestamp 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>ISO 时刻，或按秒计的 unix 时间。会写到 <code>datetime</code>。</td>
      </tr>
      <tr>
        <td><code>format</code></td>
        <td><code>TimestampFormat</code></td>
        <td><code>'auto'</code></td>
        <td><code>relative</code>、<code>relative_short</code>、<code>auto</code>、<code>date</code>、<code>date_long</code>、<code>date_weekday</code>、<code>date_time</code>、<code>time</code>、<code>system_date</code>、<code>system_date_time</code>、<code>system_time</code> 或 <code>unix_seconds</code>。</td>
      </tr>
      <tr>
        <td><code>autoThreshold</code></td>
        <td><code>number</code></td>
        <td><code>604800</code></td>
        <td><code>auto</code> 从相对时间换成 <code>date_time</code> 的秒数门槛。</td>
      </tr>
      <tr>
        <td><code>hasTooltip</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>悬停卡片里是可复制的绝对时间。<code>tooltipEntries</code> 会替换默认行。</td>
      </tr>
      <tr>
        <td><code>tooltipEntries</code></td>
        <td><code>TimestampTooltipEntry[]</code></td>
        <td>-</td>
        <td>每一项选择一种格式、可选的 <code>timezoneID</code> 和可选标签。</td>
      </tr>
      <tr>
        <td><code>isTimezoneShown</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>在 <code>date_time</code> 和 <code>time</code> 后面加上短时区名。</td>
      </tr>
      <tr>
        <td><code>isLive</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>刷新相对时间。间隔会随时刻变远而变长。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>TextType</code></td>
        <td><code>'supporting'</code></td>
        <td>传给 <code>Text</code> 的排版角色。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>TextSize</code></td>
        <td>-</td>
        <td>可选的字号覆盖。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>TextColor | 'disabled'</code></td>
        <td><code>'secondary'</code></td>
        <td><code>disabled</code> 由本组件自己上色。其余名称是文字颜色。</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>TextWeight</code></td>
        <td>-</td>
        <td>可选的字重覆盖。</td>
      </tr>
    </tbody>
  </table>
</div>

不认识的 <code>timezoneID</code> 会在控制台警告，并回退到本地时区。

## 主题

可见文字使用所选颜色对应的文字 token。<code>disabled</code> 使用 <code>--astryx-color-text-disabled</code>。悬停卡片是共用的 <code>HoverCard</code>。
