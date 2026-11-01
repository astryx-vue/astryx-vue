// 上游路径到任务树节点的归类规则。
//
// classifyPath(path) 按 RULES 的顺序逐条匹配，第一条命中的规则决定归属：
//   - nodes 非空：这个文件归到这些节点。
//   - unrelated 有值：这个文件和移植无关，值是原因。
// 没有任何规则命中时返回 null，脚本会报错并列出这些文件。
// 规则带 review 字段的，表示归属是本表自行判断的，会列进 _summary.md 的「需要总控确认」。

/** 任务树节点，顺序就是台账总表里的顺序。名称取自 ROADMAP。 */
export const NODES = {
  A1: '上游差异台账',
  A2: '视觉对照工具',
  A3: '工程质量护栏',
  A4: '蜂群基础设施',
  B1: '主题系统与设计变量',
  B2: '基础重置样式',
  B3: '交互逻辑常用函数',
  B4: '浮层图层运行时',
  B5: '界面文案与图标',
  B6: '属性规则与样式分层',
  B7: '常用工具函数',
  C1: '基础输入框',
  C2: '勾选与开关',
  C3: '选择器家族',
  C4: '快捷搜索与命令面板',
  C5: '日期与时间',
  C6: '菜单家族',
  C7: '弹出浮层家族',
  C8: '底部抽屉',
  C9: '文档排版与代码高亮',
  C10: '对话组件',
  C11: '数据表格',
  C12: '列表与树形结构',
  C13: '页面导航',
  C14: '布局与排版容器',
  C15: '状态反馈与加载',
  C16: '基础展示与动作按钮',
  D1: 'Neutral 主题底色',
  D2: '其余六套主题适配',
  D3: 'Probe 主题调研',
  D4: '命令行搜索与更新',
  D5: '命令行新增页面模板',
  D6: '样式分层自动迁移脚本',
  D7: '升级指南与版本说明',
  D8: '在线演练场同步更新',
  E1: '拆分脚本与命令行大文件',
  E2: '拆分文档站大文件',
  E3: '页面无障碍自动检查',
  E4: '自动对比页面外观',
  F0: '新包技术选型决策',
  F1a: '富文本核心逻辑',
  F1b: '富文本编辑器组件',
  F1c: '富文本使用文档',
  F2a: '图表纯计算逻辑',
  F2b: '图表展示组件',
  F2c: '图表使用文档',
  F3a: '实验包：输入类组件',
  F3b: '实验包：展示类组件',
  F3c: '实验包：浮层与引导',
  F3d: '实验包：图表与编辑器',
  F3e: '实验包：对话类组件',
  F3f: '实验包：使用文档',
  F4: 'Nuxt 模块',
  F5: 'vega 包',
  F6: 'build 构建插件',
  G1: '发布核心组件与主题包',
  G2: '发布命令行工具',
  G3: '发布全新扩展包',
  G4: '每周自动追踪上游更新',
}

/** 把「节点 → 名字列表」翻成「名字 → 节点」。 */
function invert(byNode) {
  const out = {}
  for (const [node, names] of Object.entries(byNode)) {
    for (const name of names)
      out[name] = node
  }
  return out
}

/** packages/core/src/<目录>/ 到节点。按 ROADMAP 里 C1–C16 的「涵盖组件」，再补上底座目录。 */
export const CORE_DIR_NODES = invert({
  B1: ['theme'],
  B3: ['hooks', 'gestures', 'motion'],
  B4: ['Layer', 'Overlay'],
  B5: ['i18n'],
  B6: ['InteractiveRoleContext', 'SizeContext'],
  B7: ['utils'],
  C1: ['TextInput', 'TextArea', 'NumberInput', 'FileInput', 'InputGroup', 'Field', 'FieldStatus', 'FormLayout'],
  C2: ['CheckboxInput', 'CheckboxList', 'RadioList', 'Radio', 'Switch', 'Slider', 'SegmentedControl', 'ToggleButton'],
  C3: ['Selector', 'MultiSelector', 'ComplexSelector', 'Typeahead', 'Tokenizer'],
  C4: ['PowerSearch', 'CommandPalette'],
  C5: ['Calendar', 'DateInput', 'DateRangeInput', 'DateTimeInput', 'TimeInput', 'Timestamp', 'Timer'],
  C6: ['DropdownMenu', 'ContextMenu', 'MoreMenu'],
  C7: ['Dialog', 'AlertDialog', 'Popover', 'HoverCard', 'Tooltip', 'Lightbox', 'Toast', 'Drawer'],
  C8: ['BottomSheet'],
  C9: ['Markdown', 'CodeBlock', 'Code'],
  C10: ['Chat'],
  C11: ['Table'],
  C12: ['List', 'Item', 'TreeList', 'Outline', 'OverflowList', 'MetadataList'],
  C13: ['SideNav', 'TopNav', 'MobileNav', 'NavMenu', 'NavItem', 'NavIcon', 'Breadcrumbs', 'TabList', 'Pagination'],
  C14: ['AppShell', 'Layout', 'Grid', 'Stack', 'Center', 'AspectRatio', 'Section', 'ScrollableArea', 'Resizable', 'Collapsible', 'Card', 'ClickableCard', 'SelectableCard', 'Toolbar', 'Divider'],
  C15: ['Banner', 'Spinner', 'ProgressBar', 'Indicator', 'StatusDot', 'Skeleton', 'Stepper', 'EmptyState'],
  C16: ['Button', 'ButtonGroup', 'IconButton', 'Link', 'Avatar', 'AvatarGroup', 'Badge', 'Token', 'Thumbnail', 'Kbd', 'Citation', 'Carousel', 'Heading', 'Text', 'Blockquote'],
})

/** ROADMAP 没有列出、由本表就近归类的 core 目录。 */
export const CORE_DIR_EXTRA_NODES = invert({
  C14: ['HStack', 'VStack', 'VisuallyHidden'],
})

/** packages/lab/src/<目录>/ 到节点。按 ROADMAP 里 F3a–F3e 的组件列表。 */
export const LAB_DIR_NODES = invert({
  F3a: ['ListInput', 'MobileTokenizer', 'TransferList', 'MobilePowerSearch'],
  F3b: ['Stat', 'CircularProgress', 'InfoTip', 'SVGIcon', 'LogStream', 'Schedule'],
  F3c: ['Drawer', 'Tour'],
  F3d: ['Chart', 'Radial', 'Sankey', 'ThreeD', 'CodeEditor', 'DiffViewer'],
  F3e: ['Chat', 'ChatReasoning', 'CommentPin', 'Comments', 'EmojiPicker'],
})

/** 在 lab 里孵化、后来升进 core 的组件。它们在 lab 时期的改动归 core 对应节点。 */
export const LAB_PROMOTED_DIR_NODES = invert({
  C8: ['BottomSheet'],
  C15: ['Stepper'],
})

/** docs/specs/AST-xxx 规范记录到节点。按每份记录的标题判断主题。 */
export const SPEC_NODES = invert({
  B1: ['AST-006', 'AST-008', 'AST-012', 'AST-022', 'AST-066', 'AST-102', 'AST-108'],
  B3: ['AST-081', 'AST-085', 'AST-090', 'AST-094', 'AST-099', 'AST-105', 'AST-107'],
  B4: ['AST-003', 'AST-027', 'AST-038', 'AST-059'],
  B5: ['AST-032', 'AST-084', 'AST-086', 'AST-087'],
  B6: ['AST-002', 'AST-056', 'AST-071'],
  B7: ['AST-005', 'AST-067'],
  C3: ['AST-001', 'AST-004', 'AST-011', 'AST-055', 'AST-058', 'AST-075', 'AST-079', 'AST-109'],
  C4: ['AST-083', 'AST-092'],
  C5: ['AST-037', 'AST-043'],
  C9: ['AST-036', 'AST-061'],
  C12: ['AST-057'],
  C14: ['AST-010', 'AST-025'],
  C16: ['AST-024'],
  D1: ['AST-018'],
  D4: ['AST-031', 'AST-034', 'AST-035', 'AST-039', 'AST-040', 'AST-041', 'AST-042', 'AST-046', 'AST-047', 'AST-048', 'AST-050', 'AST-051', 'AST-053'],
  D5: ['AST-028'],
  D7: ['AST-013'],
  E3: ['AST-009', 'AST-020', 'AST-021'],
  F0: ['AST-080'],
  F1a: ['AST-062', 'AST-064'],
  F3a: ['AST-103'],
  G1: ['AST-017'],
})

/** 只记录上游流程、和移植无关的规范记录。 */
export const SPEC_UNRELATED = {
  'AST-026': 'shadcn 组件注册表兼容规范，只服务 React 生态',
  'AST-029': '上游组件审计与自动合并流程规范',
  'AST-030': '上游 CI 路由流程规范',
  'AST-033': '上游 Next.js 文档站的交互与数据约定',
  'AST-070': '上游规范记录的写作格式约定（草稿已删除）',
  'AST-082': '原生平台界面规范，Vue 版不适用',
  'AST-091': '原生平台模板规范，Vue 版不适用',
  'AST-093': '原生组件指南，Vue 版不适用',
  'AST-100': '上游发布节奏流程规范',
}

/** docs/architecture、docs/design、docs/families 下的 Markdown 到节点。key 是不带 .md 的文件名。 */
export const KNOWLEDGE_DOC_NODES = {
  architecture: invert({
    B1: ['component-theming-surface', 'theme-application', 'theme-authoring-contract', 'theme-compilation', 'theme-tokens'],
    B3: ['interaction-modality'],
    B4: ['layer-runtime'],
    B5: ['icon-resolution-and-component-slots', 'internationalization', 'rtl-audit-evidence'],
    B6: ['component-size-cascade', 'component-style-authoring', 'public-component-api'],
    C8: ['container-padding'],
    D4: ['cli-surface'],
    D5: ['template-authoring'],
  }),
  design: invert({
    B1: ['color-emphasis', 'control-rhythm', 'elevation-hierarchy', 'mobile-typography', 'motion', 'shape-relationships', 'spatial-hierarchy', 'typography-hierarchy'],
    B3: ['user-states', 'reduced-motion'],
    B5: ['iconography', 'bidirectionality'],
    C10: ['agentic-states'],
    C15: ['system-states'],
    D5: ['template-composition'],
    F3a: ['ordered-collection-reordering'],
  }),
  families: invert({
    C1: ['input-fields'],
    C7: ['overlay-dismissal'],
    C13: ['navigation-destinations'],
    C14: ['layout-primitives', 'layout-regions'],
    C16: ['buttons', 'action-groups'],
  }),
}

/** 和移植无关的知识库文档。 */
export const KNOWLEDGE_DOC_UNRELATED = {
  'architecture/README': '知识库目录索引',
  'architecture/component-test-sufficiency': '上游 React 组件测试充分性约定',
  'architecture/knowledge-contracts': '上游知识库记录格式约定',
  'architecture/react-component-runtime': 'React 组件运行时约定（Effect、ref 等），Vue 无对应',
  'design/README': '知识库目录索引',
  'families/README': '知识库目录索引',
}

/** 仓库根目录 scripts/ 下和某个节点直接相关的脚本。key 是去掉 .test 和扩展名后的文件名。 */
export const ROOT_SCRIPT_NODES = invert({
  B1: ['generate-data-tokens', 'data-token-consumers', 'generate-token-docs', 'check-appearance-nesting'],
  B5: ['generate-i18n-runtime', 'check-i18n-catalog', 'generate-cldr-weekdays'],
  D1: ['generate-neutral-palette-refs'],
  D2: ['check-badge-contrast', 'check-stone-secondary-text-contrast', 'check-secondary-selector-parity', 'check-syntax-punctuation-contrast', 'check-theme-icon-coverage'],
  D4: ['generate-cli-themes', 'check-cli-theme-bundle', 'check-cli-structure', 'check-theme-template'],
})

/**
 * 按提交追加的归属，补在路径归类之后。
 * ROADMAP 点名了某个上游 PR 由某节点负责，但那个 PR 没有改到该节点名下的路径时，在这里登记。
 * key 是提交标题末尾的 PR 编号。
 */
export const COMMIT_PINS = {
  6118: { nodes: ['B6'], reason: 'ROADMAP B6 点名：删除 0.6 标记废弃的 API' },
  7289: { nodes: ['B6'], reason: 'ROADMAP B6 点名：删除 emptySearchResultsText' },
  7331: { nodes: ['B6'], reason: 'ROADMAP B6 点名：非表单组件透传自定义属性' },
}

/** 破坏性提交还要追加到这些节点。D7 要在迁移指南里逐条写清每个破坏性改动。 */
export const BREAKING_NODES = {
  nodes: ['D7'],
  reason: 'ROADMAP D7：迁移指南要逐条覆盖每个破坏性改动',
}

const OTHER_THEMES = 'butter|chocolate|gothic|matcha|stone|y2k'

/** 从正则的第一个捕获组里查表，查到就返回节点列表。 */
function lookup(table) {
  return match => (table[match[1]] ? [table[match[1]]] : null)
}

function unrelated(id, pattern, reason) {
  return { id, pattern, unrelated: reason }
}

function to(id, pattern, nodes, review) {
  return { id, pattern, nodes, ...(review ? { review } : {}) }
}

export const RULES = [
  // 全仓通用的无关文件
  unrelated('changelog', /(?:^|\/)CHANGELOG\.md$/, '上游各包的更新日志，由上游发布流程生成'),
  unrelated('changeset', /^\.changeset\//, '上游的 changeset 变更记录，我们有自己的 changeset'),
  unrelated('release-state', /^\.release\//, '上游发布流程的状态文件'),
  unrelated('github', /^\.github\//, '上游 CI 工作流、视觉回归基线截图和仓库治理文件'),
  unrelated('local-tooling', /^\.(?:husky|claude)\//, '上游开发者本地钩子与 AI 助手配置'),

  // 仓库根目录文件
  to('root-readme', /^README\.md$/, ['G1'], '根 README 的改动归 G1，由它在发布时更新我们的主说明'),
  to('ime-guard-design', /^IME_GUARD_DESIGN\.md$/, ['B7']),
  unrelated('root-agent-docs', /^(?:AGENTS|CLAUDE|CONTRIBUTING)\.md$/, '上游贡献者与 AI 代理的工作说明'),
  unrelated('root-config', /^(?:package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|\.gitignore|\.gitattributes|\.npmrc|\.nvmrc|crowdin\.yml|tsconfig[^/]*\.json|[^/]+\.config\.(?:ts|js|mjs|cjs|mts)|vitest\.[^/]+\.mjs)$/, '上游 monorepo 根配置与锁文件'),

  // 各包通用的无关文件
  unrelated('native', /^packages\/native\//, '上游 Apple 原生平台与桥接代码，Vue 版不适用'),
  unrelated('package-manifest', /^packages\/(?:themes\/)?[^/]+\/package\.json$/, '上游包清单（版本号、依赖、导出表）；我们的包清单独立维护，导出表由 pnpm sync 生成，实质改动随同提交的源码进入各节点'),
  unrelated('package-build-config', /^packages\/.+\/(?:babel\.config\.(?:js|json|cjs)|tsup\.config\.ts|tsconfig[^/]*\.json)$/, '上游 Babel、tsup、TypeScript 构建配置；Vue 版用自己的 tsdown 与 tsconfig'),

  // packages/core 包级文件
  to('core-locales', /^packages\/core\/locales\//, ['B5']),
  to('core-pseudo-locale', /^packages\/core\/scripts\/build-pseudo-locale\.mjs$/, ['B5']),
  unrelated('core-scripts', /^packages\/core\/scripts\//, '上游 npm postinstall 与 agent 初始化提示脚本，Vue 版不提供'),
  to('core-readme', /^packages\/core\/(?:README\.md|docs\.mjs)$/, ['G1'], 'core 包 README 与文档生成入口的改动归 G1'),

  // packages/core/src 根文件
  to('core-base-props', /^packages\/core\/src\/(?:BaseProps\.ts|naming(?:\.test)?\.ts)$/, ['B6']),
  to('core-reset', /^packages\/core\/src\/(?:reset[^/]*|inputFontFloor[^/]*)$/, ['B2']),
  to('core-tailwind-bridge', /^packages\/core\/src\/tailwind-theme[^/]*$/, ['B1'], 'Tailwind 主题桥（把 token 暴露给 Tailwind）归 B1，Vue 版是否提供由 B1 决定'),
  to('core-unicode-utils', /^packages\/core\/src\/unicodePropertyEscapes[^/]*$/, ['B7']),
  unrelated('core-index', /^packages\/core\/src\/index\.ts$/, '核心包入口导出；我们的 index.ts 由 pnpm sync 生成，新增导出随对应组件节点处理'),
  unrelated('core-ambient-types', /^packages\/core\/src\/(?:astryx\.css\.d\.ts|raw-import\.d\.ts|doc-mjs\.d\.ts)$/, '上游 TypeScript 环境声明，服务 React 构建'),
  unrelated('core-doc-tooling-tests', /^packages\/core\/src\/(?:docPropLiterals\.test\.ts|docPropReferences\.test\.ts|docs-script\.test\.mjs|postinstall\.test\.mjs)$/, '上游 .doc.mjs 文档格式与 postinstall 脚本的自检测试'),
  unrelated('core-rsc-boundary', /^packages\/core\/src\/serverSafeComponents\.test\.ts$/, 'React Server Components 边界检查，Vue 无对应'),
  unrelated('core-stylex-validation', /^packages\/core\/src\/stylexValidation[^/]*$/, 'StyleX 专用校验，Vue 版不用 StyleX'),
  unrelated('core-src-readme', /^packages\/core\/src\/README\.md$/, '上游源码目录的内部说明'),

  // packages/core/src/__tests__ 跨组件测试
  to('core-tests-field', /^packages\/core\/src\/__tests__\/(?:fieldContract|inputWidthContract)[^/]*$/, ['C1']),
  to('core-tests-press', /^packages\/core\/src\/__tests__\/(?:PressedState|pressState|stubMatchMedia)[^/]*$/, ['B3']),
  unrelated('core-tests-stylex', /^packages\/core\/src\/__tests__\/(?:stylexDeclarations|babelPlugin)[^/]*$/, 'StyleX 与 Babel 插件的测试辅助，Vue 版不用'),
  to('core-tests-contract', /^packages\/core\/src\/__tests__\//, ['B6'], '跨组件的公共 API 契约测试（apiContractDrift 等）归 B6'),

  // packages/core/src 下需要拆开归类的底座目录
  to('core-utils-press', /^packages\/core\/src\/utils\/(?:press|interactionModality|interactionOverlay|focusReturn)[^/]*$/, ['B3'], '按压模型、交互模态、焦点归还虽在 utils/，但 ROADMAP 把它们划给 B3'),
  to('core-utils-theme-props', /^packages\/core\/src\/utils\/themeProps[^/]*$/, ['B1'], 'themeProps 生成 theme target 类名，归 B1 的换肤机制'),
  to('core-theme-syntax', /^packages\/core\/src\/theme\/syntax\//, ['B1', 'C9'], '代码高亮的语法主题同时属于主题系统（B1）和代码高亮（C9）'),
  to('core-icon', /^packages\/core\/src\/Icon\//, ['B5', 'C16'], 'Icon 目录统一归 B5（图标注册表），同时标 C16（Icon 组件外观）'),
  to('core-internal-tokenizer', /^packages\/core\/src\/internal\/tokenizer-presentation[^/]*$/, ['C3']),
  to('core-internal-touch', /^packages\/core\/src\/internal\/touch[^/]*$/, ['B3']),
  to('core-dir', /^packages\/core\/src\/([^/]+)\//, lookup(CORE_DIR_NODES)),
  to('core-dir-extra', /^packages\/core\/src\/([^/]+)\//, lookup(CORE_DIR_EXTRA_NODES), 'ROADMAP 没有列出的 core 目录（HStack、VStack、VisuallyHidden），就近归 C14'),

  // packages/themes
  to('theme-neutral', /^packages\/themes\/neutral\//, ['D1']),
  to('theme-probe', /^packages\/themes\/probe\//, ['D3']),
  to('theme-others', new RegExp(`^packages/themes/(?:${OTHER_THEMES})/`), ['D2']),

  // packages/cli：先分出主题副本、模板和 codemod，其余归 D4
  unrelated('cli-doc-routes', /^packages\/cli\/test\/doc-routes(?:\.ids)?\.json$/, '上游自动生成的文档路由清单，随源码重生成'),
  to('cli-theme-copy-neutral', /^packages\/cli\/assets\/templates\/themes\/neutral\//, ['D1'], 'CLI 内置的 Neutral 主题副本，跟主题包一起归 D1'),
  to('cli-theme-copy-others', new RegExp(`^packages/cli/assets/templates/themes/(?:${OTHER_THEMES})/`), ['D2'], 'CLI 内置的其余主题副本，跟主题包一起归 D2'),
  to('cli-theme-template', /^packages\/cli\/.*(?:theme[-.]template|themeTemplate|\/theme\/template\/|assets\/templates\/themes\/)/, ['D4']),
  to('cli-codemod', /^packages\/cli\/.*(?:codemod|upgrad)/i, ['D6'], 'upgrade 命令负责执行 codemod，它的改动和 codemod 一起归 D6'),
  to('cli-template', /^packages\/cli\/.*template/i, ['D5']),
  to('cli-other', /^packages\/cli\//, ['D4'], 'CLI 自带的指南文档（assets/docs，主题、token、样式等）也落在 D4；是否改由文档类节点承接请总控确认'),

  // packages/richtext
  to('richtext-docs', /^packages\/richtext\/(?:blocks\/|README\.md$|src\/[^/]+\.doc\.mjs$)/, ['F1c']),
  to('richtext-components', /^packages\/richtext\/.+\.tsx$/, ['F1b']),
  to('richtext-logic', /^packages\/richtext\//, ['F1a']),

  // packages/charts
  to('charts-docs', /^packages\/charts\/(?:blocks\/|README\.md$|src\/[^/]+\.doc\.mjs$)/, ['F2c']),
  to('charts-components', /^packages\/charts\/.+\.tsx$/, ['F2b']),
  to('charts-logic', /^packages\/charts\//, ['F2a']),

  // packages/lab
  to('lab-emoji-script', /^packages\/lab\/scripts\/generate-emoji-data\.mjs$/, ['F3e']),
  to('lab-drawer-blocks', /^packages\/lab\/blocks\/Drawer/, ['F3c']),
  to('lab-package', /^packages\/lab\/(?:blocks\/|README\.md$|astryx\.integration\.mjs$|src\/index\.ts$|src\/__tests__\/)/, ['F3f'], 'lab 包级文件（入口、README、示例块、集成描述、包级测试）归 F3f'),
  to('lab-reorder-styles', /^packages\/lab\/src\/reorderStyles\.ts$/, ['F3a'], 'lab 内部共享的拖拽排序样式，就近归 F3a（ListInput、TransferList）'),
  to('lab-promoted', /^packages\/lab\/src\/([^/]+)\//, lookup(LAB_PROMOTED_DIR_NODES), 'BottomSheet、Stepper 在 lab 孵化期的改动，归 core 对应节点 C8、C15'),
  to('lab-dir', /^packages\/lab\/src\/([^/]+)\//, lookup(LAB_DIR_NODES)),

  to('vega', /^packages\/vega\//, ['F5']),
  to('build', /^packages\/build\//, ['F6']),

  // apps
  to('docsite-release-posts', /^apps\/docsite\/src\/content\/blog\/posts\/astryx-v\d[^/]*\.md$/, ['D7'], '上游版本发布博客，作为 D7 写升级指南的参考'),
  to('docsite-playground', /^apps\/docsite\/src\/app\/playground\//, ['D8'], '上游演练场（编辑器、预览、主题编辑器）归 D8'),
  unrelated('docsite', /^apps\/docsite\//, '上游 Next.js 文档站的框架代码、博客与配置，Vue 版文档站自成体系'),
  unrelated('storybook', /^apps\/storybook\//, '上游 React Storybook 故事与配置'),
  unrelated('example-apps', /^apps\/example-[^/]+\//, '上游 Next.js、Vite 的 React 示例应用'),
  unrelated('sandbox', /^apps\/sandbox\//, '上游内部 React 实验沙盒，不对外发布'),
  unrelated('template-viewer', /^apps\/template-viewer\//, '上游 React 模板预览宿主；模板本身的改动已随 CLI 模板进入 D5'),
  unrelated('apps-readme', /^apps\/README\.md$/, '上游 apps 目录说明'),

  // docs
  to('spec', /^docs\/specs\/(AST-\d+)(?:-[^/]*)?\//, lookup(SPEC_NODES), 'docs/specs 下的 AST 规范记录按记录标题就近归类，见 rules.mjs 的 SPEC_NODES'),
  { id: 'spec-unrelated', pattern: /^docs\/specs\/(AST-\d+)(?:-[^/]*)?\//, unrelated: match => SPEC_UNRELATED[match[1]] ?? null },
  unrelated('spec-readme', /^docs\/specs\/README\.md$/, '规范记录目录索引'),
  to('knowledge-doc', /^docs\/(architecture|design|families)\/([^/]+)\.md$/, match => (KNOWLEDGE_DOC_NODES[match[1]][match[2]] ? [KNOWLEDGE_DOC_NODES[match[1]][match[2]]] : null), 'docs/architecture、design、families 下的知识库文档按主题就近归类，见 rules.mjs 的 KNOWLEDGE_DOC_NODES'),
  { id: 'knowledge-doc-unrelated', pattern: /^docs\/((?:architecture|design|families)\/[^/]+)\.md$/, unrelated: match => KNOWLEDGE_DOC_UNRELATED[match[1]] ?? null },
  to('chart-v2-docs', /^docs\/CHARTV2_[^/]+\.md$/, ['F2a']),
  unrelated('docs-process', /^docs\/(?:contributing\/|schemas\/|templates\/|pr-assets\/|themes\/|README\.md$|release\.md$)/, '上游知识库流程文档（贡献规范、记录模板、schema、PR 素材、发布流程）'),

  // internal
  to('interaction-harness', /^internal\/interaction-harness\//, ['A3'], '跨组件交互测试工具归工程质量护栏'),
  to('a11y-spec', /^internal\/a11y-spec\//, ['E3'], '上游 APG 无障碍模式契约测试，归 E3 作为无障碍检查的参考'),
  unrelated('vibe-tests', /^internal\/vibe-tests\//, '上游 AI 代理生成效果的评测用例'),
  unrelated('eslint-plugin', /^internal\/eslint-plugin-astryx\//, '上游 React、StyleX 专用的 ESLint 规则'),
  unrelated('lab-readiness', /^internal\/lab-readiness\//, '上游 lab 组件转正的审计工具'),
  unrelated('stylex-capabilities', /^internal\/stylex-capabilities\//, 'StyleX 能力扫描，Vue 版不用 StyleX'),
  unrelated('shadcn-registry', /^internal\/shadcn-registry\//, 'shadcn 组件注册表，只服务 React 生态'),
  unrelated('internal-test-utils', /^internal\/test-utils\//, '上游 React 测试环境的初始化代码'),
  unrelated('internal-scripts', /^internal\/scripts\//, '上游 Crowdin 翻译平台的截图上传脚本'),
  unrelated('internal-readme', /^internal\/README\.md$/, '上游 internal 目录说明'),

  // 仓库根目录 scripts/
  to('root-script', /^scripts\/(?:[^/]+\/)*([^/.]+)(?:\.test)?\.[^/]+$/, lookup(ROOT_SCRIPT_NODES)),
  unrelated('root-scripts', /^scripts\//, '上游 monorepo 的构建、发布与 CI 辅助脚本'),
]

/** 规则表里出现过的节点都必须在 NODES 里登记，否则说明规则写错了。 */
export function validateRules(rules = RULES) {
  const problems = []
  for (const rule of rules) {
    if (Array.isArray(rule.nodes)) {
      for (const node of rule.nodes) {
        if (!(node in NODES))
          problems.push(`规则 ${rule.id} 用到了未登记的节点 ${node}`)
      }
    }
  }
  const pinned = [...Object.values(COMMIT_PINS).flatMap(pin => pin.nodes), ...BREAKING_NODES.nodes]
  for (const node of pinned) {
    if (!(node in NODES))
      problems.push(`按提交追加的归属用到了未登记的节点 ${node}`)
  }
  const tables = [CORE_DIR_NODES, CORE_DIR_EXTRA_NODES, LAB_DIR_NODES, LAB_PROMOTED_DIR_NODES, SPEC_NODES, ROOT_SCRIPT_NODES, ...Object.values(KNOWLEDGE_DOC_NODES)]
  for (const table of tables) {
    for (const [key, node] of Object.entries(table)) {
      if (!(node in NODES))
        problems.push(`${key} 映射到了未登记的节点 ${node}`)
    }
  }
  return problems
}

/**
 * 给一个上游文件路径找归属。
 * 返回 { rule, nodes, reason }：nodes 非空时归这些节点；nodes 为空时 reason 是无关原因。
 * 没有规则命中时返回 null。
 */
export function classifyPath(path, rules = RULES) {
  for (const rule of rules) {
    const match = rule.pattern.exec(path)
    if (!match)
      continue
    if (rule.unrelated !== undefined) {
      const reason = typeof rule.unrelated === 'function' ? rule.unrelated(match) : rule.unrelated
      if (reason)
        return { rule: rule.id, nodes: [], reason }
      continue
    }
    const nodes = typeof rule.nodes === 'function' ? rule.nodes(match) : rule.nodes
    if (nodes && nodes.length > 0)
      return { rule: rule.id, nodes: [...nodes], reason: null }
  }
  return null
}
