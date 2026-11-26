---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

Tokenizer 和 Typeahead 新增 `statusVariant`（框内状态图标，`tooltip` 时是能聚焦的图标按钮）并暴露 `aria-invalid`、调用方的 `aria-labelledby` 接在字段标签后面，搜索结果数会念出全部匹配条数，Tokenizer 全部清除会播报一次、禁用时不再向表单交值、聚焦展开的清单里选一项后焦点和清单保留且下一项高亮、有标签时光标落在最后一个标签后面；MultiSelector 和 Selector 的忙碌图标不再对读屏暴露并只播报一次「加载中」，MultiSelector 的 `aria-labelledby` 接在字段标签后面、带搜索时必填标记挪到搜索框、自制触发器带 `aria-disabled` 且禁用时不再执行调用方的处理；选项列表打开时不再高亮禁用项、按字母跳转忽略重音、键盘滚动让行从静止的鼠标下冒出来时不抢高亮；强制颜色下可聚焦的禁用字段焦点边框取 Highlight，触屏上输入框焦点外观不再淡入。
