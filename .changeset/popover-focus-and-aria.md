---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Popover 和 Dialog 的焦点更稳：打开时焦点落在第一个可用的 Tab 停靠点（跳过 aria-disabled 控件，onShow 里自己放好的焦点不再被挪走）；关闭时只把困在里面的焦点送回打开者，打开者不在了就找它附近的停靠点，不再掉到 body，也不再抢走你在关闭回调里放好的焦点。关着的 Popover 不再带 dialog 角色和名称，关着的触发器不再写 aria-controls，aria-disabled 的触发器不会打开浮层。
