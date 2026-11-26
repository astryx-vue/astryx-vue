---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

HoverCard 与 Tooltip：笔落下时取消挂着的悬停打开，不再在按下期间打开又被这一下轻点关掉；HoverCard 的 focusTrigger="auto" 在焦点到达时才判断（漫游 tabindex 的成员变成 Tab 停靠点后会打开），受控 isOpen 为 false 时焦点也不再打开卡片；触发元素被子组件悄悄换掉后会重新接线；文本触发器画共用的焦点环。
