# F3g lab 日程表 · 执行计划

## 目标

`@astryx-vue/lab` 提供 `Schedule`。用法和原版 lab（v0.7.1 这一支，以 meta/astryx `main` 上 `packages/lab/src/Schedule` 为准）一致：用视图对象决定月格、日或周时间格、按天分组的列表。日期按 IANA 时区换算，上一页 / Today / 下一页只通过 `onChangeDate` 把下一个时刻交出去，组件自己不改 `date`。`events` 可以是数组，也可以是按当前区间的起止毫秒去拉数据的函数；还在等结果时标题旁转圈，视图先空着。

这是用来看已有日程的，不是日期选择器。没有新建、改期、编辑。

## API

| 导出 | 作用 |
| --- | --- |
| `Schedule` | 外壳。必填 `view`、`events`、`date`。可选 `categories`、`focusDate`、`onChangeDate`、`timezoneID`、`plugins`、`headingLevel`（默认 3） |
| `createEventFromISO` | `YYYY-MM-DD` 做成全天事件，带时间的字符串做成时刻事件 |
| `createScheduleMonthlyView` / `Weekly` / `Day` / `List` | 视图工厂。月和周有 `weekStartsOn`；周和日有 `minHour`、`maxHour`、`hourHeight`；列表有 `days`。月、周、日还有 `renderPopover` |
| `ScheduleContext`、`useScheduleContext` | 视图和插件读当前事件、区间、时区、翻页回调 |
| `defaultSchedulePlugins` | 默认只有分页按钮 |
| `useSchedulePaginationPlugin` | 上一页 / Today / 下一页，`position` 默认 `start` |
| `useScheduleViewSelectorPlugin` | 头部菜单切换视图，`position` 默认 `end` |

另外导出 `types.ts` 里的事件、区间、分类、插件类型。`CalendarEvent` 的 `start` / `end` 要么都是 `PlainDate`（全天，结束日含当天），要么都是毫秒。

Vue 里翻页用 `onChangeDate` 属性，也发出 `changeDate`，模板可以写 `@change-date`。视图对象请保持同一引用；选择器用引用来判断当前项。`renderPopover` 在渲染每个事件时调用，返回内容就画成按钮并打开这一视图唯一的浮层，返回 `null` 则该事件只读。不传这个选项时，整张月历或时间格只读。

分类用 `label === event.category` 对上色。对不上仍用这个名字，颜色退回蓝色。没有分类时读作 Event，也是蓝色。

## 文件

- `packages/lab/src/Schedule/`：类型、日期与布局纯函数、四个视图、分页和视图选择插件、测试
- `packages/lab/styles/schedule.css`，并从 `lab.css` 引入
- 文档：`apps/docs/docs/{zh,en}/lab/schedule`，侧栏和 lab 概览各加一行
- 示例：`apps/docs/components/lab-demos/schedule.vue`

## 验收

1. 月、周、日、列表能切换；上一页、Today、下一页通过 `onChangeDate` 改 `date`，翻页保留一天里的时刻，Today 用当前时刻。
2. 有开始和结束时刻的事件出现在时间格里；重叠的并排；满 24 小时或全天的进全天行。分类颜色落在事件上。
3. 月历一周最多三层；塞不下的那天有 `+N more`，打开后列出当天全部事件。传了 `renderPopover` 时，事件按钮打开同一个浮层，Escape 或再点一次关掉。
4. 时间格是一个能用键盘滚的区域；只读时另有 `role="grid"` 且 `aria-readonly`。月历是 `role="table"`，单元格用完整日期命名。
5. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖布局、区间过滤、视图工厂和分页回调。

## 不在这次里

- 非公历的月份标题。core 没有上游那套 calendar system，格子和翻页仍按公历，文案只跟 `locale` 换语言。
- 上游 `__tests__` 里那一组 Chromium 视觉探针。
- 把事件拖到别的时间。上游没有改期，指针按下只负责在已经打开的浮层之间切换触发块。
- 评论、日期选择器，以及 core 里已有的 Calendar。
