---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
---

主题与进度条对齐上游：
- 主题字体随包安装：Butter、Chocolate、Gothic、Matcha、Stone、Y2K 不再从 Google Fonts 加载自己的字体，改用 `@fontsource` 包，页面从自己的源站取字体。
- Stone 的 accent 进度条填充改取蓝色阶，Butter 和 Stone 的状态填充与标记取主题的状态色和对应的 on 色，Neutral、Butter、Stone 暗色下的中性和禁用填充取更亮的一档，所有启用的进度条填充在轨道上都够 3:1；其余主题的状态填充走核心的状态文字角色。
- ProgressBar：状态填充读状态文字角色，neutral 和禁用的填充读次要文字角色（不再读在有些主题里就是暗色轨道本身的禁用文字色）；禁用的进度条轨道和填充降到半透明，强制颜色模式下用 GrayText 描一圈；填充里的标记（accent 除外）取表面色。
- Stone、Matcha、Neutral、Chocolate、Y2K 的分类色卡片与灰底卡片上，次要文字（Y2K 深色下还有主文字和链接）退到够 4.5:1 的色阶；Y2K 深色下分类色卡片用深色墨水。
- Chocolate 浅色下的分类文字色（青、绿、橙、粉、红、黄）取更深的色阶；Matcha 暗色下的灰底和浮层底色取主题的深灰中性色。
- Butter 和 Stone 输入框的状态描边和图标用色阶中段（Butter 浅色下达到 3:1），Stone 随审定后的调色板更新。
- Butter、Gothic、Y2K 的「自带填充文字色」规则只作用于斑马纹表格的行，普通表格的行保持周围的文字色。
- Gothic 的强调文字和图标跟着媒体表面的强调色走，浅色表面上不再停在近白色。
- `reset.css`：`html` 取 `--astryx-font-family-body`，页面里不在主题包装元素内的文字不再退回浏览器的衬线体；带 `list` 的输入框，下拉标记回到输入框中线。
- 按压反馈：没有按压时收到没带指针 id 的触屏抬起事件，不再抛出「读 null 的 live」的错误。
