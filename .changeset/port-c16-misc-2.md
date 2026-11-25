---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

跟进上游的另一组零散修复：

- `Theme` 里没有自己设行高的文字取主题的正文行高（`--text-body-leading`），不再落回 reset 的 1.5；设了文字角色字号的部位（表格单元格和表头、日历、分页小尺寸、Tab、空状态紧凑模式、代码块 sm、Slider 数值、多选和搜索菜单的分组标题等）一并设上这个角色的行高。默认主题下 14px 的正文行高从 21px 变为 20px。想保留旧行高，可以在自己的容器上设 `line-height`，或在主题里设对应角色的 leading token。
- `astryx-vue search` 认得别的组件库对组件的叫法（`ScrollArea`、`side sheet`、`toggle group`、`circular progress` 等）和常见图标名（`cog`、`lightning bolt` 会找到 `Icon`）；动词只折叠进行时，`listed` 不再当成 `List`。
- 付款表单和结账向导模板在窄屏首帧（脚本还没量出宽度时）把订单摘要换到表单下面，不再把表单挤窄；`dashboard-scorecard` 和 `dashboard-progress` 模板的整块页面区域不再套卡片。
