---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

聊天输入对齐上游：ChatComposerInput 新增 `enterKeyHint`（默认 `send`，触屏键盘的回车键显示“发送”）；禁用后编辑区仍留在 Tab 顺序里、不丢焦点，打字、粘贴、拖入文件、命令式句柄和调用方回调都不再生效，触发菜单随之收起；点进编辑区不再把打开的触发菜单关掉，点击把光标挪出查询时菜单会跟着关；触发菜单的“Searching…”不再靠没有 live 角色的加载行，改走共用忙碌播报，每次搜索只念一次；ChatComposer 的状态条改由渲染文字播报，类型变化算新的一次，页面加载前已显示的状态保持安静，点在打开着的 Tooltip 或 HoverCard 里不再抢走输入框焦点；ChatMessageList 顶部加载的转圈静音，由列表播报一次；长文本粘贴成令牌只触发一次 `change`；输入法组字时光标落进文本节点，不再把第一个拼音字母直接上屏；ChatSystemMessage、ChatMessageList、ChatLayout 的空插槽判断改为看是否真的渲染出内容。
