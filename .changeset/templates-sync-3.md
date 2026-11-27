---
'@astryx-vue/cli': minor
---

`component` 和 `composable` 一次可以读几个名字（`component Button Card`），`--json` 返回 `component.details`。`template` 复制后和打印页面时，用一行 `component A B C` 列出页面用到的组件，`--json` 里是 `components` 和 `componentsToRead`。`template` 的路径：项目里的绝对路径按相对路径写入并在 `givenPath` 报出，系统临时目录里的绝对路径写一份临时副本，`~/` 指家目录；写到项目外时，报错会给出能用的命令（写进项目、从那个路径所在目录运行、只打印）。复制后「还缺的包」只看页面 `<script>` 里真正的 import，不再被文字里的代码示例误报（`documentation-technical` 不再要求装 `@astryxdesign/core`）。`template --list` 每个模板只打印描述的第一句，`search` 的模板结果标出不可复制的（JSON 里有 `isReady`），各处名字排序统一按码点。页面模板和文档示例跟上游一批修正：canvas-editor 的圆角和翻转图标贴合含义，kanban-board 窄屏上下排列且手指长按才拎起卡片，付款页 Apply 按钮、竖向向导的封面按钮和工作项子任务在手机上不再丢字，文档示例里原先点了没反应的按钮现在弹演示提示。
