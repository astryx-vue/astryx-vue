# @astryx-vue/core

## 0.1.2

### Patch Changes

- [#28](https://github.com/astryx-vue/astryx-vue/pull/28) [`6a6dce3`](https://github.com/astryx-vue/astryx-vue/commit/6a6dce3c41b1ba2721dd1e688a420cb65d05514a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 补上 CommandPalette、Stepper、ClickableCard、SelectableCard、CollapsibleGroup、ComplexSelector 和 TabMenu，以及 useClickableContainer。Stepper 的 minimumStepWidth 默认 112，窄屏收成当前步和 Previous / Next。ComplexSelector 补上 alignment、renderTrigger、startIcon、variant 和 handleRef。

## 0.1.1

### Patch Changes

- [#17](https://github.com/astryx-vue/astryx-vue/pull/17) [`989edc7`](https://github.com/astryx-vue/astryx-vue/commit/989edc76810d91607714b803ef3142f7a450b2bc) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 ContextMenu 子菜单悬停后不关闭、同一层可以一直挂着多个子菜单的问题。开关时机与原版 `useMenuHover` 一致：悬停 150ms 打开，离开 200ms 关闭，斜向移入子菜单时走安全三角。移到同级项同样等这段关闭延迟，稳定后同一层只剩一个由悬停打开的子菜单。

- [#21](https://github.com/astryx-vue/astryx-vue/pull/21) [`0d822b8`](https://github.com/astryx-vue/astryx-vue/commit/0d822b897f084217188bd6f94ad6db55dcca92d1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增数据展示组件 Table、MetadataList、TreeList、Timestamp 和 Thumbnail。Table 覆盖列宽、排序、行选择、分页、列显示、列宽拖拽、行内和弹出过滤、密度、分隔线、斑马纹和空状态。过滤是组件自带的字段匹配，不依赖尚未移植的 PowerSearch。

- [#20](https://github.com/astryx-vue/astryx-vue/pull/20) [`43138ca`](https://github.com/astryx-vue/astryx-vue/commit/43138caf9d3a41d410c348fc0c917369cfa9ad69) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 补上文件输入、时间输入、日期时间输入、日期区间输入和复选列表。字段状态和单选列表按原版拆成独立入口，并补齐中英文文档。

- [#26](https://github.com/astryx-vue/astryx-vue/pull/26) [`f98c4ce`](https://github.com/astryx-vue/astryx-vue/commit/f98c4ce499ad020f02475a1ea22b0af5b856af03) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 日期区间的起止日期改用实心圆和对比字色，避免和区间底融在一起。输入框内部控件不再叠一层页面焦点环，焦点留在外框上。

- [#24](https://github.com/astryx-vue/astryx-vue/pull/24) [`cae99ae`](https://github.com/astryx-vue/astryx-vue/commit/cae99ae0605883798ca7f9ca8efdcdcda93efd9c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 TreeList 嵌套分支的悬停和选中底色，让它从引导线右侧留出间隙后开始，以及外部图标类没有尺寸导致文件树图标不显示。

## 0.1.0

### Minor Changes

- [#13](https://github.com/astryx-vue/astryx-vue/pull/13) [`85aa073`](https://github.com/astryx-vue/astryx-vue/commit/85aa073fb5f855847b6951528e5743dc50bc99aa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 首次发布。`@astryx-vue/core` 提供 Vue 3 组件，`@astryx-vue/themes` 提供 Neutral 主题。
