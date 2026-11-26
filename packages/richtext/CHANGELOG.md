# @astryx-vue/richtext

## 0.21.0

### Patch Changes

- Updated dependencies [[`6e36420`](https://github.com/astryx-vue/astryx-vue/commit/6e36420c236439f2e81584d905501be1b63d79c3)]:
  - @astryx-vue/core@0.21.0

## 0.20.1

### Patch Changes

- Updated dependencies [[`04df208`](https://github.com/astryx-vue/astryx-vue/commit/04df2084111d41780ec2c58efd68a3d1e5ba1288), [`d14bab0`](https://github.com/astryx-vue/astryx-vue/commit/d14bab0a6236ca38b3874dfbb6e196bfbcebc661), [`21f37ba`](https://github.com/astryx-vue/astryx-vue/commit/21f37baaa173c85e9892a91e2e15e59f8d1c56db)]:
  - @astryx-vue/core@0.20.1

## 0.20.0

### Patch Changes

- Updated dependencies [[`4c7b227`](https://github.com/astryx-vue/astryx-vue/commit/4c7b2277f9643201e9c37a39856941b821142dd4)]:
  - @astryx-vue/core@0.20.0

## 0.19.1

### Patch Changes

- Updated dependencies [[`815ff06`](https://github.com/astryx-vue/astryx-vue/commit/815ff0633ed0c8ee086b63742a7d1f04a12f934b)]:
  - @astryx-vue/core@0.19.1

## 0.19.0

### Patch Changes

- Updated dependencies [[`dbc08b8`](https://github.com/astryx-vue/astryx-vue/commit/dbc08b8abccd4b06c24d1be3771a679801bea68f), [`427fe3c`](https://github.com/astryx-vue/astryx-vue/commit/427fe3c616eca359f46cf20dbe13d6965e3e9d16), [`eca17f2`](https://github.com/astryx-vue/astryx-vue/commit/eca17f24b65bd2e4860f223d687f0b6c12a93b1b)]:
  - @astryx-vue/core@0.19.0

## 0.18.0

### Patch Changes

- Updated dependencies [[`3482ec8`](https://github.com/astryx-vue/astryx-vue/commit/3482ec86f1a322a9fea811d67d456166e0378986), [`8f246ae`](https://github.com/astryx-vue/astryx-vue/commit/8f246ae8499d5cd9b1ac56db6e9ee441a2a5fc9a)]:
  - @astryx-vue/core@0.18.0

## 0.17.0

### Patch Changes

- Updated dependencies [[`a9ae1a0`](https://github.com/astryx-vue/astryx-vue/commit/a9ae1a0767b1781ec2af2333b0fc50f07f218b56), [`b272df5`](https://github.com/astryx-vue/astryx-vue/commit/b272df56af84a0ad60f9044a3c582221e7f4c52b), [`815fd22`](https://github.com/astryx-vue/astryx-vue/commit/815fd22cd455f3bf03ecfee74ee1d5260c925c4f)]:
  - @astryx-vue/core@0.17.0

## 0.16.5

### Patch Changes

- Updated dependencies [[`d34dfc2`](https://github.com/astryx-vue/astryx-vue/commit/d34dfc261958b9f9bcda78a702b989f268c34159), [`30f0c5b`](https://github.com/astryx-vue/astryx-vue/commit/30f0c5b3819f8ddb1143669f75f9cc40193ffb98), [`8f755e5`](https://github.com/astryx-vue/astryx-vue/commit/8f755e542a881dc8042ed6d87501cd969fa6587d), [`773b43a`](https://github.com/astryx-vue/astryx-vue/commit/773b43aa2fceb2787a8cee743806249c7cd998f8)]:
  - @astryx-vue/core@0.16.5

## 0.16.4

### Patch Changes

- Updated dependencies [[`a12067c`](https://github.com/astryx-vue/astryx-vue/commit/a12067c18293f163990c985818406cae013a8a07)]:
  - @astryx-vue/core@0.16.4

## 0.16.3

### Patch Changes

- Updated dependencies [[`2851fe3`](https://github.com/astryx-vue/astryx-vue/commit/2851fe345c0e0d9daeb1601325bac102aa5f2ed5)]:
  - @astryx-vue/core@0.16.3

## 0.16.2

### Patch Changes

- Updated dependencies [[`b9dc365`](https://github.com/astryx-vue/astryx-vue/commit/b9dc36576e535848f53b0f25f4602fe38a89c213)]:
  - @astryx-vue/core@0.16.2

## 0.16.1

### Patch Changes

- Updated dependencies [[`68cac05`](https://github.com/astryx-vue/astryx-vue/commit/68cac056a700ba83d73a4c0207c76a20733b617d)]:
  - @astryx-vue/core@0.16.1

## 0.16.0

### Patch Changes

- [#550](https://github.com/astryx-vue/astryx-vue/pull/550) [`d27092a`](https://github.com/astryx-vue/astryx-vue/commit/d27092a9f35a07901650fe9100b60dbdadbf86f4) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 读屏播报：同一帧里播报的多条消息按顺序连在一起念，一模一样的重复只念一次，空消息连同还没念的一起清掉；`useAnnounce` 新增 `hasReplace` 选项，让每次按键都重说一遍的状态（MultiSelector、CommandPalette 的搜索状态）只念最新一条；Selector、MultiSelector 的结果播报会收回还没念出去的「加载中」，TextInput、TextArea 的加载圈改为装饰、忙碌由输入框自己念一次；原生模态对话框打开时，播报写进那个对话框自己的区域；EmptyState 的根不再是 live 区域，页面加载后才出现或文字之后变了才播报一次。复制：`useClipboard` 新增 `isFailed`、`announceFailure`、`onError`，CodeBlock 新增 `copyFailedLabel` 和 `copyError` 事件，复制失败时按钮变叉并用 assertive 播报，Timestamp、评论链接和富文本代码块同样；`useOverflow` 新增 `gapToken`、`renderedGap`、`inlineBounds`。其余：可滚动的 LayoutContent、LayoutPanel、StackItem 溢出时是有名字的 group，AppShell 的 `fill` 主区域溢出时成为键盘停靠点；锁滚动在触屏上取消没人接的单指拖动并关掉页面回弹；TreeList 收起时焦点回到行；Selector、MultiSelector 键盘移到的高亮选项画焦点环；强制配色下聚焦的菜单行可见；`useImageMode` 在区域数值变化时重新采样；Calendar 今天在接管服务端 HTML 之后才读，服务端和浏览器不同日期也不再对不上；`useMediaQuery` 每条查询只挂一个监听。
- Updated dependencies [[`d27092a`](https://github.com/astryx-vue/astryx-vue/commit/d27092a9f35a07901650fe9100b60dbdadbf86f4), [`9f4cd31`](https://github.com/astryx-vue/astryx-vue/commit/9f4cd3181d8e390437b3f23b766525e3395d0c22)]:
  - @astryx-vue/core@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [[`0dab467`](https://github.com/astryx-vue/astryx-vue/commit/0dab467a81ac4130ac5f33511c69c9fa0b3b30e7), [`b17b492`](https://github.com/astryx-vue/astryx-vue/commit/b17b4922330c59dec2eb8973615848aa1b22e63f)]:
  - @astryx-vue/core@0.15.0

## 0.14.0

### Patch Changes

- Updated dependencies [[`2f825cd`](https://github.com/astryx-vue/astryx-vue/commit/2f825cdf9c5c41cd4de6ab097ab28ee6665ad65e)]:
  - @astryx-vue/core@0.14.0

## 0.13.1

### Patch Changes

- Updated dependencies [[`2ef57bb`](https://github.com/astryx-vue/astryx-vue/commit/2ef57bb652b19c3c320c339f641b9489afe18b1c), [`403286d`](https://github.com/astryx-vue/astryx-vue/commit/403286d491fec9a147fac31250e2a06f4963bbc1)]:
  - @astryx-vue/core@0.13.1

## 0.13.0

### Patch Changes

- Updated dependencies [[`fe992ac`](https://github.com/astryx-vue/astryx-vue/commit/fe992ac67b9b112c3685be0b249ab42dfbb670fc), [`d2849f1`](https://github.com/astryx-vue/astryx-vue/commit/d2849f15a3059c03dab71271bc64e5811fd766ec)]:
  - @astryx-vue/core@0.13.0

## 0.12.1

### Patch Changes

- Updated dependencies [[`a059c14`](https://github.com/astryx-vue/astryx-vue/commit/a059c14bcde7d82367b5bf2f82e6e2b6d81d4b39), [`d74f8eb`](https://github.com/astryx-vue/astryx-vue/commit/d74f8eb77d168e27efbad72a49268dff795d3de5), [`32ea195`](https://github.com/astryx-vue/astryx-vue/commit/32ea1954e3beea4936962d24d555582c8a859b9b)]:
  - @astryx-vue/core@0.12.1

## 0.12.0

### Patch Changes

- Updated dependencies [[`b74909f`](https://github.com/astryx-vue/astryx-vue/commit/b74909fc6e89b8cf365eb9ce41cda4178c69cc99), [`083cd85`](https://github.com/astryx-vue/astryx-vue/commit/083cd85c3e72ee76353719f81598895b13707072)]:
  - @astryx-vue/core@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [[`bf97b13`](https://github.com/astryx-vue/astryx-vue/commit/bf97b13f85a406f7e637a8f5b4977546504e28aa)]:
  - @astryx-vue/core@0.11.0

## 0.10.2

### Patch Changes

- Updated dependencies [[`dc8015d`](https://github.com/astryx-vue/astryx-vue/commit/dc8015d7a86410799e01769fc2ee0aa4554dabbf)]:
  - @astryx-vue/core@0.10.2

## 0.10.1

### Patch Changes

- Updated dependencies [[`e869ec3`](https://github.com/astryx-vue/astryx-vue/commit/e869ec3cb4f87419d5f78ddcbf9d5fa1fda63f75)]:
  - @astryx-vue/core@0.10.1

## 0.10.0

### Patch Changes

- Updated dependencies []:
  - @astryx-vue/core@0.10.0

## 0.9.2

### Patch Changes

- Updated dependencies [[`c4f306d`](https://github.com/astryx-vue/astryx-vue/commit/c4f306d4de9b02036f7fc7aae1e9188cd833f535)]:
  - @astryx-vue/core@0.9.2

## 0.9.1

### Patch Changes

- Updated dependencies [[`bd3e926`](https://github.com/astryx-vue/astryx-vue/commit/bd3e92607249ed99ec025c868c6e33690fb2af24)]:
  - @astryx-vue/core@0.9.1

## 0.9.0

### Patch Changes

- [#520](https://github.com/astryx-vue/astryx-vue/pull/520) [`40d7a78`](https://github.com/astryx-vue/astryx-vue/commit/40d7a782e6a420ce21a3d9d2d8fe1dc6b2fd0162) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 公开 `useComponentMessages` 和各组件的内置文案（如 `tableMessages`、`codeBlockMessages`），自己的组件可以只取用到的几组文案。富文本编辑器改用它，打包时不再带上全部组件的文案。
- Updated dependencies [[`40d7a78`](https://github.com/astryx-vue/astryx-vue/commit/40d7a782e6a420ce21a3d9d2d8fe1dc6b2fd0162)]:
  - @astryx-vue/core@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [[`76d1bb6`](https://github.com/astryx-vue/astryx-vue/commit/76d1bb68afc03cd54a727b22e8932ec8217862cb)]:
  - @astryx-vue/core@0.8.0

## 0.7.29

### Patch Changes

- [#517](https://github.com/astryx-vue/astryx-vue/pull/517) [`3d1eb56`](https://github.com/astryx-vue/astryx-vue/commit/3d1eb56dd9c087bad55a31afffa709929b896dd0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 状态色按所在的底分成几种角色，组件各取其一：
  
  - `defineTheme` 做的主题只写了状态底色（或改了表面色、`--color-on-dark` / `--color-on-light`）时，会按主题自己的颜色算出没写的 `--color-on-<状态>`、`--color-text-<状态>`、`--color-on-<状态>-muted`，图标和边框角色跟着文字色走；Badge、StatusDot、输入框、图标等组件变量也在这个主题里跟着换。算出来的变量名记在 `theme.derivedTokens`。新增 `STATUS_COLOR_DEFAULTS`，和默认主题 CSS 里的状态色一致。
  - `Icon` 新增 `color="info"`。各主题里 `Icon` 的 success / warning / error 颜色、Stepper 的状态图标改用图标角色；默认主题下成功图标从 `#00490B` 变为 `#2F7D33`。
  - 输入框的状态边框改用边框角色，表单状态提示的文字改用浅底内容色；默认主题下浅色模式的警告边框从 `#FFCE2F` 变为 `[#836700](https://github.com/astryx-vue/astryx-vue/issues/836700)`。
  - 默认主题的 StatusDot 用实心状态底色，图标用对应的 on 角色；头像状态点的图标也用 on 角色。
  - 聊天输入框状态条的文字和图标改用浅底内容色；菜单里的危险操作、TextArea 和富文本编辑器超出字数的计数、未读分隔线标签、lab 里 Stat、CircularProgress、LogStream、SVGIcon 的状态色改用文字或图标角色。
  - 强制配色模式下，Badge、StatusDot、进度条填充、步骤条数字徽标、聊天输入框状态条、列表滑动的危险操作都补一圈边，形状不会消失。
  
  想保留某个组件原来的颜色，在主题里写上对应的角色即可，比如把 `--color-icon-success` 设成原来的值。
- Updated dependencies [[`c7035a1`](https://github.com/astryx-vue/astryx-vue/commit/c7035a1463495c9fbafc4823bedb4c5e2d082aa2), [`3d1eb56`](https://github.com/astryx-vue/astryx-vue/commit/3d1eb56dd9c087bad55a31afffa709929b896dd0)]:
  - @astryx-vue/core@0.7.29

## 0.7.28

### Patch Changes

- Updated dependencies [[`2bd41f7`](https://github.com/astryx-vue/astryx-vue/commit/2bd41f7c964b4b7bc0e31c7594b4703a34ed2189)]:
  - @astryx-vue/core@0.7.28

## 0.7.27

### Patch Changes

- Updated dependencies [[`cd143dc`](https://github.com/astryx-vue/astryx-vue/commit/cd143dcc55229632183f74c32ae913016782dc07)]:
  - @astryx-vue/core@0.7.27

## 0.7.26

### Patch Changes

- Updated dependencies [[`cc73651`](https://github.com/astryx-vue/astryx-vue/commit/cc73651813d0dc905150a67a8d4377f8f5f882d8), [`90a7127`](https://github.com/astryx-vue/astryx-vue/commit/90a7127a47057e379ff9255cf00c7fe4cee09a79), [`45b95b5`](https://github.com/astryx-vue/astryx-vue/commit/45b95b5ffc4b0c6d3faf8bdf7de1b9f59cfa5f51), [`ce2bfa4`](https://github.com/astryx-vue/astryx-vue/commit/ce2bfa4602747acbafa5e91108be1b755003e041), [`ca023d0`](https://github.com/astryx-vue/astryx-vue/commit/ca023d06a64172f5a17a4f6fc0ecdf233c9b352f), [`d94de78`](https://github.com/astryx-vue/astryx-vue/commit/d94de78d16484142ef7642d410b060e59deec27c), [`6fc4715`](https://github.com/astryx-vue/astryx-vue/commit/6fc471578ecb89aa5cdd4c0c5c6751273bbb02cf), [`473ae5a`](https://github.com/astryx-vue/astryx-vue/commit/473ae5a6c8b9471ac1bcd267760058ad38c89338), [`4e7767f`](https://github.com/astryx-vue/astryx-vue/commit/4e7767f0707c19e4208b003e5f4e767ede363848)]:
  - @astryx-vue/core@0.7.26

## 0.7.25

### Patch Changes

- [#499](https://github.com/astryx-vue/astryx-vue/pull/499) [`88aabd1`](https://github.com/astryx-vue/astryx-vue/commit/88aabd16b6545d9a1b9102fcfbc779fe9aba36c5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Link 跟进上游的一组修复。
  
  - 禁用的 Link 不会被调用方传的 `role` 或 `aria-disabled` 换掉禁用状态，读屏仍然读出「已禁用」；调用方传的 `tabindex` 照常生效。启用时，调用方的 `role`、`tabindex`、`aria-disabled`、`aria-label` 也都能落到根元素上。
  - 根元素带上 `data-color`，始终和 `color` 一致，调用方传的同名值不会盖掉它。
  - 放在设了 `maxLines` 的 Text 里的链接会并入文字的行里，外面的截断能从链接中间切开。
  - 没有断点的长标签（比如一串网址）在窄栏里换行，不再撑出容器；按钮形态的 Link 换行后和锚点一样跟随外面的对齐；设了 `maxLines` 的链接在弹性行里也能收窄并画出省略号。
  - RichTextEditor 自动识别邮箱时，匹配耗时和文字长度成正比，粘贴一长串哈希或 base64 不会让页面卡住。
- Updated dependencies [[`eb86f99`](https://github.com/astryx-vue/astryx-vue/commit/eb86f99216430d1c736a63d7b84ab909491e379d), [`10edf09`](https://github.com/astryx-vue/astryx-vue/commit/10edf09cbfac1686d29d08917a9e1782a7dcfb83), [`25e3e52`](https://github.com/astryx-vue/astryx-vue/commit/25e3e5212409f95de8841fa22f6de2ed01c5079d), [`12b3dd9`](https://github.com/astryx-vue/astryx-vue/commit/12b3dd9e586de415324f6288ad44e2985d25b281), [`88aabd1`](https://github.com/astryx-vue/astryx-vue/commit/88aabd16b6545d9a1b9102fcfbc779fe9aba36c5), [`283935c`](https://github.com/astryx-vue/astryx-vue/commit/283935ced65c9d03fb7929e6c128c8e0afcd0298)]:
  - @astryx-vue/core@0.7.25

## 0.7.24

### Patch Changes

- Updated dependencies [[`6a92b59`](https://github.com/astryx-vue/astryx-vue/commit/6a92b59f5baf06d67147403a5b2ea28f6edffbe9)]:
  - @astryx-vue/core@0.7.24

## 0.7.23

### Patch Changes

- Updated dependencies [[`1d5a19c`](https://github.com/astryx-vue/astryx-vue/commit/1d5a19c11fec40d598457896067445b64a344720)]:
  - @astryx-vue/core@0.7.23

## 0.7.22

### Patch Changes

- Updated dependencies [[`20c48f1`](https://github.com/astryx-vue/astryx-vue/commit/20c48f17c0b62e80c233ca7d67e0b63e25b073f5), [`5b9dce9`](https://github.com/astryx-vue/astryx-vue/commit/5b9dce93dd38ed2363e396eb120712edb176f005), [`2a38dd0`](https://github.com/astryx-vue/astryx-vue/commit/2a38dd02da165ade1427f88e839596f29a075699), [`fe5496f`](https://github.com/astryx-vue/astryx-vue/commit/fe5496f0425150f91799da27d1ad1b585e07aaf9), [`cfb4c25`](https://github.com/astryx-vue/astryx-vue/commit/cfb4c256039f483e4dd0860a2ac245114a20453d), [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff), [`5b9dce9`](https://github.com/astryx-vue/astryx-vue/commit/5b9dce93dd38ed2363e396eb120712edb176f005), [`09a2429`](https://github.com/astryx-vue/astryx-vue/commit/09a2429529e3f7e71efc0e2241e9df54780221a1), [`6378227`](https://github.com/astryx-vue/astryx-vue/commit/6378227b35868057dd6b0503da763d241319e0ea), [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff), [`f63ed1e`](https://github.com/astryx-vue/astryx-vue/commit/f63ed1e87583564a278f4d43fc54fe7e6c09dfc4), [`5b9dce9`](https://github.com/astryx-vue/astryx-vue/commit/5b9dce93dd38ed2363e396eb120712edb176f005), [`41cea82`](https://github.com/astryx-vue/astryx-vue/commit/41cea82675601a1396e4ed5c402421f96c92a36d), [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff), [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff), [`20c48f1`](https://github.com/astryx-vue/astryx-vue/commit/20c48f17c0b62e80c233ca7d67e0b63e25b073f5), [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff), [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff), [`a02b3c5`](https://github.com/astryx-vue/astryx-vue/commit/a02b3c5080e714a55e89b71cd89dfe7f15db7571), [`93a2bd6`](https://github.com/astryx-vue/astryx-vue/commit/93a2bd610b7da4be7f8a9bdaf60a998ff3dc87ef), [`6d652d0`](https://github.com/astryx-vue/astryx-vue/commit/6d652d0daa9a479fc3c3d2a647133b50b25d07a8), [`996f0de`](https://github.com/astryx-vue/astryx-vue/commit/996f0debe329d945925dfb633b9e05cc45b6a7fa), [`ea63146`](https://github.com/astryx-vue/astryx-vue/commit/ea6314652240068183179c7edbfdfa1917830857)]:
  - @astryx-vue/core@0.7.22

## 0.7.21

### Patch Changes

- Updated dependencies [[`09406e4`](https://github.com/astryx-vue/astryx-vue/commit/09406e4bd9394300ebe5ddb06a60443a40916b51), [`7cc9752`](https://github.com/astryx-vue/astryx-vue/commit/7cc97528ab7160b7c7b0664b365a78ce407237f5), [`0178b04`](https://github.com/astryx-vue/astryx-vue/commit/0178b0495d010c81d4877af48763e4cb8532baeb), [`10044cd`](https://github.com/astryx-vue/astryx-vue/commit/10044cd7550c3e5234483490b017c33bf59efd29), [`900f0ed`](https://github.com/astryx-vue/astryx-vue/commit/900f0edeb7f06989850b955267249dfff5f3c5b3)]:
  - @astryx-vue/core@0.7.21

## 0.7.20

### Patch Changes

- Updated dependencies [[`ceb6ae3`](https://github.com/astryx-vue/astryx-vue/commit/ceb6ae3cd75452218e7978d7232feed3b817090f)]:
  - @astryx-vue/core@0.7.20

## 0.7.19

### Patch Changes

- Updated dependencies [[`1f1209a`](https://github.com/astryx-vue/astryx-vue/commit/1f1209a3255b5d83226ef24d8f6d25645aeaa833)]:
  - @astryx-vue/core@0.7.19

## 0.7.18

### Patch Changes

- Updated dependencies [[`021bcb4`](https://github.com/astryx-vue/astryx-vue/commit/021bcb467162f0175e3aae49f14a504cb64631ee)]:
  - @astryx-vue/core@0.7.18

## 0.7.17

### Patch Changes

- Updated dependencies [[`dbad081`](https://github.com/astryx-vue/astryx-vue/commit/dbad081f09ced3c3a80089070b3980acb2c41e87)]:
  - @astryx-vue/core@0.7.17

## 0.7.16

### Patch Changes

- Updated dependencies [[`878937f`](https://github.com/astryx-vue/astryx-vue/commit/878937fba15a968ae4d2115f9871190c2854b3d0)]:
  - @astryx-vue/core@0.7.16

## 0.7.15

### Patch Changes

- Updated dependencies [[`9a83bc0`](https://github.com/astryx-vue/astryx-vue/commit/9a83bc0b6d239985f52ad4737f76eb10d634307d)]:
  - @astryx-vue/core@0.7.15

## 0.7.14

### Patch Changes

- Updated dependencies [[`6d4641e`](https://github.com/astryx-vue/astryx-vue/commit/6d4641ec4b35370d51c51d654ee4aee071801c30)]:
  - @astryx-vue/core@0.7.14

## 0.7.13

### Patch Changes

- Updated dependencies [[`9f1f68a`](https://github.com/astryx-vue/astryx-vue/commit/9f1f68a28296b709479407fbca2c1a229e01491e)]:
  - @astryx-vue/core@0.7.13

## 0.7.12

### Patch Changes

- Updated dependencies [[`ca5a8ea`](https://github.com/astryx-vue/astryx-vue/commit/ca5a8eaf3eb9f2dc966d89995697bd3d2feda936)]:
  - @astryx-vue/core@0.7.12

## 0.7.11

### Patch Changes

- Updated dependencies [[`d3a9e5f`](https://github.com/astryx-vue/astryx-vue/commit/d3a9e5f8d58d3c2f1f5302860650e3500fd75796)]:
  - @astryx-vue/core@0.7.11

## 0.7.10

### Patch Changes

- Updated dependencies [[`49efa1f`](https://github.com/astryx-vue/astryx-vue/commit/49efa1f4b1f033a46de76eaf2004be7669bf11fe)]:
  - @astryx-vue/core@0.7.10

## 0.7.9

### Patch Changes

- Updated dependencies [[`8a86866`](https://github.com/astryx-vue/astryx-vue/commit/8a86866bd08cf332afb296e3099b6714c562c8ed)]:
  - @astryx-vue/core@0.7.9

## 0.7.8

### Patch Changes

- [#444](https://github.com/astryx-vue/astryx-vue/pull/444) [`00c41e4`](https://github.com/astryx-vue/astryx-vue/commit/00c41e44bf9c1a5c477898f0fe34eea22b7b97ce) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 RichText 任务勾选框在缩略预览中错位的问题。使用 transform 缩放时，先把视口坐标换算回本地 CSS 像素，再计算位置和 RTL 左偏，确保勾选框仍对齐自己的任务项。
- Updated dependencies [[`63cfdac`](https://github.com/astryx-vue/astryx-vue/commit/63cfdac4324597396e1be4f7029e9a73282a235b), [`09d2796`](https://github.com/astryx-vue/astryx-vue/commit/09d2796d233d2ca7a82aadf1b476d31739b3c0c6)]:
  - @astryx-vue/core@0.7.8

## 0.7.7

### Patch Changes

- Updated dependencies [[`4351a2b`](https://github.com/astryx-vue/astryx-vue/commit/4351a2baf8a5f81a93744994d3621ba40eedef3d)]:
  - @astryx-vue/core@0.7.7

## 0.7.6

### Patch Changes

- Updated dependencies [[`b3a63e7`](https://github.com/astryx-vue/astryx-vue/commit/b3a63e769e1be385051ee892b1f3c73d27702684)]:
  - @astryx-vue/core@0.7.6

## 0.7.5

### Patch Changes

- Updated dependencies [[`9e510f3`](https://github.com/astryx-vue/astryx-vue/commit/9e510f3a8608c8f24656de70aa7545dbd31225b1)]:
  - @astryx-vue/core@0.7.5

## 0.7.4

### Patch Changes

- Updated dependencies [[`30ae6eb`](https://github.com/astryx-vue/astryx-vue/commit/30ae6eba1f83f87b6120081a6d668fa71e50a575)]:
  - @astryx-vue/core@0.7.4

## 0.7.3

### Patch Changes

- Updated dependencies [[`59d5124`](https://github.com/astryx-vue/astryx-vue/commit/59d5124182f376013d12bc8ee6667acc02b58a61)]:
  - @astryx-vue/core@0.7.3

## 0.7.2

### Patch Changes

- Updated dependencies [[`99c6e58`](https://github.com/astryx-vue/astryx-vue/commit/99c6e58da250ce44e7306d12b62bce18e5186256)]:
  - @astryx-vue/core@0.7.2

## 0.7.1

### Patch Changes

- Updated dependencies [[`d54c4a1`](https://github.com/astryx-vue/astryx-vue/commit/d54c4a1e3f9bd97697e3ec4ce93c0db7cbc07668)]:
  - @astryx-vue/core@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [[`dacf1fe`](https://github.com/astryx-vue/astryx-vue/commit/dacf1fe1fe16bd653cf15b78798e16819a292b29)]:
  - @astryx-vue/core@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [[`f0edcfe`](https://github.com/astryx-vue/astryx-vue/commit/f0edcfec10c33ae019c076a7d05b87665cbcf347), [`fb0dacd`](https://github.com/astryx-vue/astryx-vue/commit/fb0dacdda76aa603025210406e12e4c9b41907f7)]:
  - @astryx-vue/core@0.6.1

## 0.6.0

### Patch Changes

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正 Markdown 与富文本的表格边框：每个单元格四条边都画线，不再只有行与行之间的分隔线；表格外沿由表格自身的边框闭合，和格线折叠成一条 1px 的线，不会在边缘叠成双线。两个界面用同一套 `--astryx-color-border` 行线和列线，最后一行、最后一列不重复画线，所以同一张表在 Markdown 阅读状态和富文本里的格子边界一致。
- Updated dependencies [[`88e2214`](https://github.com/astryx-vue/astryx-vue/commit/88e22141ad5d24ce3f6db2aefe082a9df44a5359), [`c4f2aa5`](https://github.com/astryx-vue/astryx-vue/commit/c4f2aa52b3834549263b8a98e7787ef6a54262c3), [`004f655`](https://github.com/astryx-vue/astryx-vue/commit/004f655f04fcae2194eb694c9a6b61b19adaff0a), [`22e9a74`](https://github.com/astryx-vue/astryx-vue/commit/22e9a74dcc1bcc38bea4bb8499212afbddf7bbd1), [`9685f9a`](https://github.com/astryx-vue/astryx-vue/commit/9685f9a39d4b01c73f59237f1cff0326bd60864e), [`6d366de`](https://github.com/astryx-vue/astryx-vue/commit/6d366de2fac28a02a75315f0b7283a5eed100ca1), [`78d5669`](https://github.com/astryx-vue/astryx-vue/commit/78d56695cc7ee13c01d3347e4b7dd5ce24665c7a), [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c), [`346ff39`](https://github.com/astryx-vue/astryx-vue/commit/346ff392db97126214613c6b5608a173b79240a8), [`a74832f`](https://github.com/astryx-vue/astryx-vue/commit/a74832fee24df16e017324f5fb80e8eff76c9baa), [`7ba5cb9`](https://github.com/astryx-vue/astryx-vue/commit/7ba5cb9a0de1d4e824baf235ec23524f4c11be7b)]:
  - @astryx-vue/core@0.6.0

## 0.5.2

### Patch Changes

- Updated dependencies [[`748f379`](https://github.com/astryx-vue/astryx-vue/commit/748f37980c93fbc5d2f90a07d8a488e34a4fcecd)]:
  - @astryx-vue/core@0.5.2

## 0.5.1

### Patch Changes

- [#257](https://github.com/astryx-vue/astryx-vue/pull/257) [`5688596`](https://github.com/astryx-vue/astryx-vue/commit/5688596e50ead2c7ad8ed458a6a76ddba3850fad) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正富文本的几处样式：代码块的语言名和复制按钮不再溢出代码块；聚焦框改成和 `TextArea` 一致；表格单元格的段落不再留上下外边距，单元格高度和原版一致；代码块背景和边框改用 core 的 `--astryx-code-block-*` 变量。
- Updated dependencies []:
  - @astryx-vue/core@0.5.1

## 0.5.0

### Minor Changes

- **新包 `@astryx-vue/richtext`：富文本编辑器首发。**
  
  - `RichTextEditor`：基于 Lexical 的所见即所得编辑器。标题、列表、引用、链接、代码块、表格、分割线；撤销重做；输入 `# `、`- ` 变成标题和列表；按 Escape 再按 Tab 离开编辑器。只读和禁用是两种状态，读屏软件读得出区别。
  - `RichTextEditorToolbar`：块格式、行内格式、链接对话框（Cmd/Ctrl+K）。图标可以被主题用 `richtext:*` 键换掉。
  - `RichTextView`：只读视图，是文档内容而不是表单控件。内容读不出来时不会带崩页面，改走 `errorFallback` 插槽。
  - 任务项勾选框、代码块标题栏与复制按钮、代码语法高亮、表格列宽、自动链接插件 `RichTextEditorAutoLinkPlugin`。
  - Markdown 原样往返：`markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`。没改过的块原样导出，只有改动过的块用规范写法。从 `@astryx-vue/richtext/markdown` 引入，服务端可用。
  - Markdown 插件节点：`createRichTextExtension` 加 `markdownExtensions`，节点按 core 的 `Markdown` 一样渲染，当成一个整体编辑。
  - Lexical（`lexical` 和 `@lexical/*`，锁在 0.52）是可选依赖，使用者自己安装。
  
  **core 和 themes 同步升到 0.5.0**（三个包共用一条版本线）：
  
  - 按钮字重、`Text` 的默认颜色（次要文字不再被压成主色）。
  - 表格：内边距、列宽计算、选择列宽度、分组头高度。表格数据模式的列宽现在按声明的比例分配。
  - `Toolbar` 外面套了 `Section`，`variant` 新增 `section`。
  - `StatusDot` 补上 `accent`；`Button` 接上 `icon` 属性；`OverflowList` 按真实的溢出内容测量；`Table` 的 `column.header` 可以传函数。
  - Markdown：标题间距按源文档的标题深度取；`parseInlineAst` 现在能读出放在原文开头的插件语法，起点偏移不再出现 -1。

### Patch Changes

- Updated dependencies []:
  - @astryx-vue/core@0.5.0
