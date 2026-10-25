# @astryx-vue/charts

Astryx 图表（`@astryxdesign/charts`）的 Vue 3 移植版。只用 d3 做计算，用 Vue 模板画 SVG。本项目是非官方移植，与 Meta 无关。

这个包只发 canary：`package.json` 里是 `private: true` 加 `"astryxVue": { "canaryOnly": true }`，只发布到 `canary` 标签，不会有稳定版。

现在只有和框架无关的纯计算：格式化函数、配色、比例尺与布局、图例与提示框取值、8 种 SVG 标记的坐标计算（`resolve()`）。图表组件和标记渲染还没有。
