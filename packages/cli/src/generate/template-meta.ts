import type { LocaleText } from '../catalog-types.ts'

/**
 * Hand-written facts about each playground page. This file is source data, not a
 * generated artifact: the titles and categories come from the playground
 * manifest, but the sentence a person reads and the words `build` scores against
 * have no machine-readable origin.
 *
 * Keywords are what a person would type, not what the page is called: a login
 * card answers to "sign in", a dashboard to "KPI" and "后台". Keep both
 * languages, because `build` matches an idea against every template regardless
 * of `--zh`, and the reply is the only localized part.
 */
export interface TemplateMeta {
  description: LocaleText
  keywords: { en: string[], zh: string[] }
  /** Used when the playground manifest has no category for the page. */
  category?: LocaleText
}

export const TEMPLATE_META: Record<string, TemplateMeta> = {
  'theme-showcase': {
    description: {
      en: 'A sampler page that shows tokens, colors, typography, inputs, and cards under the active theme.',
      zh: '一页看全当前主题的令牌、颜色、字体、输入框和卡片。',
    },
    keywords: {
      en: ['theme', 'themes', 'tokens', 'colors', 'typography', 'swatches', 'style guide', 'design system'],
      zh: ['主题', '令牌', '颜色', '字体', '色板', '样式指南', '设计系统'],
    },
    category: { en: 'Theme', zh: '主题' },
  },
  'ai-chat': {
    description: {
      en: 'An AI conversation screen with a message transcript, streaming answers, tool calls, code blocks, and a composer.',
      zh: 'AI 对话界面：消息记录、流式回答、工具调用、代码块和输入框。',
    },
    keywords: {
      en: ['ai', 'chat', 'assistant', 'conversation', 'thread', 'transcript', 'chatbot', 'message', 'prompt', 'llm'],
      zh: ['AI 对话', '聊天', '助手', '对话', '会话', '消息', '提示词', '大模型', '机器人'],
    },
  },
  'ai-chat-landing': {
    description: {
      en: 'A landing page with a headline and a prompt box that starts an AI chat.',
      zh: '带标题和输入框的落地页，输入一句话就开始 AI 对话。',
    },
    keywords: {
      en: ['ai', 'landing', 'hero', 'prompt', 'composer', 'start chat', 'marketing', 'home'],
      zh: ['AI', '落地页', '首页', '提示词', '输入框', '营销'],
    },
  },
  'library': {
    description: {
      en: 'A card grid for browsing media and documents, with search, filters, sorting, and sections.',
      zh: '用卡片网格浏览素材和文档，带搜索、筛选、排序和分组。',
    },
    keywords: {
      en: ['library', 'cards', 'grid', 'gallery', 'media', 'browse', 'catalog', 'content', 'assets', 'files'],
      zh: ['素材库', '卡片', '网格', '媒体', '浏览', '目录', '内容', '文件'],
    },
  },
  'documentation': {
    description: {
      en: 'A documentation catalog: cards that lead into the sections of a docs site.',
      zh: '文档目录页：用卡片进入文档站的各个部分。',
    },
    keywords: {
      en: ['docs', 'documentation', 'catalog', 'help center', 'knowledge base', 'articles', 'guides', 'support'],
      zh: ['文档', '帮助中心', '知识库', '文章', '指南', '支持'],
    },
  },
  'documentation-design': {
    description: {
      en: 'A documentation article page with a side outline, prose, code blocks, and a media dialog.',
      zh: '文档正文页：侧边目录、正文、代码块和图片弹窗。',
    },
    keywords: {
      en: ['documentation', 'docs', 'article', 'guide', 'sidebar', 'outline', 'content page', 'prose'],
      zh: ['文档', '文章', '指南', '侧边栏', '目录', '正文'],
    },
  },
  'documentation-technical': {
    description: {
      en: 'A technical reference page with a side outline, API prose, lists, and code samples.',
      zh: '技术参考页：侧边目录、API 说明、列表和代码示例。',
    },
    keywords: {
      en: ['documentation', 'technical', 'reference', 'api docs', 'code samples', 'developer', 'manual'],
      zh: ['文档', '技术', '参考', 'API 文档', '代码示例', '开发者', '手册'],
    },
  },
  'detail-page': {
    description: {
      en: 'An order detail page with a header, contact rows, line items, and totals.',
      zh: '订单详情页：头部信息、联系人信息、商品行和金额汇总。',
    },
    keywords: {
      en: ['order', 'detail', 'invoice', 'receipt', 'summary', 'purchase', 'transaction', 'billing'],
      zh: ['订单', '详情', '发票', '收据', '汇总', '交易', '账单'],
    },
  },
  'product-detail': {
    description: {
      en: 'A product detail page with an image gallery, variant pickers, price, and a buy button.',
      zh: '商品详情页：图片画廊、规格选择、价格和购买按钮。',
    },
    keywords: {
      en: ['product', 'detail', 'ecommerce', 'shop', 'pdp', 'item', 'variants', 'buy', 'price'],
      zh: ['商品', '详情', '电商', '购物', '规格', '购买', '价格'],
    },
  },
  'work-item-detail': {
    description: {
      en: 'A work item page with status, assignees, description, and an activity timeline.',
      zh: '工作项详情页：状态、负责人、描述和活动时间线。',
    },
    keywords: {
      en: ['work item', 'task', 'issue', 'ticket', 'detail', 'project', 'assignee', 'activity'],
      zh: ['工作项', '任务', '问题', '工单', '详情', '项目', '负责人'],
    },
  },
  'dashboard': {
    description: {
      en: 'An analytics dashboard with a title row, KPI cards, and chart cards.',
      zh: '分析仪表盘：标题行、KPI 卡片和图表卡片。',
    },
    keywords: {
      en: ['dashboard', 'analytics', 'admin dashboard', 'metrics', 'kpi', 'charts', 'chart', 'overview', 'stats', 'reports'],
      zh: ['仪表盘', '分析', '后台', '指标', '图表', '概览', '统计', '报表'],
    },
  },
  'dashboard-comparison': {
    description: {
      en: 'A dashboard that compares two periods, with a date range and side-by-side KPI cards.',
      zh: '对比两个周期的数据仪表盘：日期范围加左右并列的指标卡片。',
    },
    keywords: {
      en: ['dashboard', 'comparison', 'compare', 'period', 'trend', 'metrics', 'data', 'analytics'],
      zh: ['仪表盘', '对比', '比较', '周期', '趋势', '指标', '数据'],
    },
  },
  'dashboard-scorecard': {
    description: {
      en: 'An executive summary dashboard built from scorecard numbers and short breakdowns.',
      zh: '高管摘要仪表盘：一堆记分卡数字和简短拆解。',
    },
    keywords: {
      en: ['dashboard', 'scorecard', 'executive', 'summary', 'kpi', 'numbers', 'report', 'business review'],
      zh: ['仪表盘', '记分卡', '高管', '摘要', '指标', '报表'],
    },
  },
  'dashboard-cohort-funnel': {
    description: {
      en: 'A funnel and cohort dashboard with bar charts and retention breakdowns.',
      zh: '漏斗和群组仪表盘：柱状图加留存拆解。',
    },
    keywords: {
      en: ['dashboard', 'funnel', 'cohort', 'retention', 'conversion', 'bar chart', 'charts', 'growth'],
      zh: ['仪表盘', '漏斗', '群组', '留存', '转化', '柱状图', '增长'],
    },
  },
  'dashboard-composition': {
    description: {
      en: 'A portfolio dashboard with an area chart, composition cards, and a project list.',
      zh: '项目组合仪表盘：面积图、构成卡片和项目列表。',
    },
    keywords: {
      en: ['dashboard', 'portfolio', 'projects', 'composition', 'area chart', 'breakdown', 'charts'],
      zh: ['仪表盘', '组合', '项目', '构成', '面积图', '占比'],
    },
  },
  'dashboard-progress': {
    description: {
      en: 'A project status dashboard with a gantt chart, a donut chart, and progress cards.',
      zh: '项目状态仪表盘：甘特图、环形图和进度卡片。',
    },
    keywords: {
      en: ['dashboard', 'progress', 'project status', 'gantt', 'timeline', 'donut', 'roadmap', 'charts'],
      zh: ['仪表盘', '进度', '项目状态', '甘特图', '时间线', '环形图', '路线图'],
    },
  },
  'dashboard-alert-rail': {
    description: {
      en: 'A service monitoring dashboard with status dots, an alert rail, and sparklines.',
      zh: '服务监控仪表盘：状态点、告警栏和迷你趋势图。',
    },
    keywords: {
      en: ['dashboard', 'monitoring', 'alert', 'alerts', 'status', 'uptime', 'service', 'sparkline', 'ops', 'charts'],
      zh: ['仪表盘', '监控', '告警', '状态', '服务', '运维', '迷你图'],
    },
  },
  'payment-form': {
    description: {
      en: 'A checkout payment form with card fields, contact rows, totals, and a place-order button.',
      zh: '结账支付表单：卡号信息、联系人信息、金额汇总和下单按钮。',
    },
    keywords: {
      en: ['payment', 'checkout', 'credit card', 'billing', 'order', 'form', 'purchase', 'pay'],
      zh: ['支付', '结账', '信用卡', '账单', '订单', '表单', '付款'],
    },
  },
  'checkout-wizard': {
    description: {
      en: 'A multi-step checkout with a stepper, shipping options, and a payment summary.',
      zh: '分步结账向导：步骤条、配送选项和支付汇总。',
    },
    keywords: {
      en: ['checkout', 'wizard', 'steps', 'stepper', 'cart', 'shipping', 'payment', 'order'],
      zh: ['结账', '向导', '步骤', '购物车', '配送', '支付', '下单'],
    },
  },
  'contact-form': {
    description: {
      en: 'A contact form with a message field, a plan selector, and a submit button.',
      zh: '联系表单：留言输入、方案选择和提交按钮。',
    },
    keywords: {
      en: ['contact', 'form', 'feedback', 'support', 'message', 'inquiry', 'get in touch'],
      zh: ['联系', '表单', '反馈', '支持', '留言', '咨询'],
    },
  },
  'form-wizard-dialog': {
    description: {
      en: 'A multi-step form inside a dialog, with a stepper and one question group per step.',
      zh: '对话框里的分步表单：步骤条，每步一组问题。',
    },
    keywords: {
      en: ['form', 'wizard', 'dialog', 'modal', 'steps', 'onboarding', 'multi-step', 'survey'],
      zh: ['表单', '向导', '对话框', '弹窗', '步骤', '引导', '问卷'],
    },
  },
  'form-wizard': {
    description: {
      en: 'A long multi-step form page with a stepper, grouped fields, and footer actions.',
      zh: '很长的分步表单页：步骤条、分组字段和底部操作按钮。',
    },
    keywords: {
      en: ['form', 'wizard', 'steps', 'stepper', 'multi-step', 'signup', 'application', 'long form'],
      zh: ['表单', '向导', '步骤', '分步', '注册', '申请'],
    },
  },
  'form-wizard-inline': {
    description: {
      en: 'A compact wizard inside one card, with next and back inside the step content.',
      zh: '一张卡片里的紧凑向导，上一步下一步就在内容区。',
    },
    keywords: {
      en: ['form', 'wizard', 'inline', 'card', 'steps', 'compact', 'small form'],
      zh: ['表单', '向导', '内联', '卡片', '步骤', '紧凑'],
    },
  },
  'form-two-column': {
    description: {
      en: 'A two-column form with an illustration on one side and grouped fields on the other.',
      zh: '双列表单：一边插图，一边分组字段。',
    },
    keywords: {
      en: ['form', 'two column', 'signup', 'layout', 'fields', 'illustration', 'register'],
      zh: ['表单', '双列', '注册', '布局', '字段', '插图'],
    },
  },
  'form-wizard-vertical': {
    description: {
      en: 'A vertical stepper wizard where each step keeps its own section on the page.',
      zh: '纵向步骤条向导，每一步在页面上各占一段。',
    },
    keywords: {
      en: ['form', 'wizard', 'vertical', 'stepper', 'steps', 'long form', 'checkout'],
      zh: ['表单', '向导', '纵向', '步骤条', '长表单'],
    },
  },
  'centered-hero': {
    description: {
      en: 'A centered hero with a heading, two buttons, and one wide image below.',
      zh: '居中主视觉：标题、两个按钮，下面一张大图。',
    },
    keywords: {
      en: ['hero', 'landing', 'marketing', 'header', 'centered', 'call to action', 'cta', 'home'],
      zh: ['主视觉', '落地页', '营销', '头图', '居中', '行动号召', '首页'],
    },
  },
  'classic-gallery': {
    description: {
      en: 'A classic photo gallery with category tabs, a hero link, and an image grid.',
      zh: '经典相册：分类标签页、主图入口和图片网格。',
    },
    keywords: {
      en: ['gallery', 'photos', 'grid', 'images', 'tabs', 'portfolio', 'album'],
      zh: ['画廊', '相册', '网格', '图片', '标签页', '作品集'],
    },
  },
  'gallery-hero': {
    description: {
      en: 'A hero section that leads straight into a grid of photos.',
      zh: '主视觉区下面直接接图片网格。',
    },
    keywords: {
      en: ['gallery', 'hero', 'photos', 'images', 'grid', 'portfolio'],
      zh: ['画廊', '主视觉', '图片', '网格', '作品集'],
    },
  },
  'mixed-gallery': {
    description: {
      en: 'A mixed gallery that alternates wide images and small cards.',
      zh: '混排画廊：大图和卡片交替排列。',
    },
    keywords: {
      en: ['gallery', 'mixed', 'masonry', 'images', 'cards', 'portfolio', 'editorial'],
      zh: ['画廊', '混合', '瀑布流', '图片', '卡片', '作品集'],
    },
  },
  'product-gallery': {
    description: {
      en: 'A product gallery that leads with one large image and lists the rest in a grid.',
      zh: '商品画廊：最上面一张大图，其余在网格里。',
    },
    keywords: {
      en: ['gallery', 'product', 'images', 'thumbnails', 'shop', 'ecommerce', 'photos'],
      zh: ['画廊', '商品', '图片', '缩略图', '购物', '电商'],
    },
  },
  'side-gallery': {
    description: {
      en: 'A gallery with a side column of captions next to a photo grid.',
      zh: '侧边一列文字说明，旁边是图片网格。',
    },
    keywords: {
      en: ['gallery', 'side', 'images', 'editorial', 'grid', 'story', 'captions'],
      zh: ['画廊', '侧边', '图片', '图文', '网格', '故事'],
    },
  },
  'login-card': {
    description: {
      en: 'A sign-in card with email, password, SSO buttons, and a sign-up link.',
      zh: '登录卡片：邮箱、密码、第三方登录按钮和注册链接。',
    },
    keywords: {
      en: ['login', 'sign in', 'signin', 'auth', 'authentication', 'password', 'account', 'credentials'],
      zh: ['登录', '登陆', '认证', '密码', '账号', '登录页'],
    },
  },
  'login-split': {
    description: {
      en: 'A split-screen login with the form on one side and brand imagery on the other.',
      zh: '分屏登录：一边表单，一边品牌图。',
    },
    keywords: {
      en: ['login', 'split', 'sign in', 'auth', 'branding', 'illustration', 'two column'],
      zh: ['登录', '分屏', '认证', '品牌', '插图', '登录页'],
    },
  },
  'login-sso': {
    description: {
      en: 'An SSO login with provider buttons, an email fallback, and a marketing side panel.',
      zh: '单点登录：第三方登录按钮、邮箱登录兜底和侧边介绍。',
    },
    keywords: {
      en: ['login', 'sso', 'single sign on', 'oauth', 'saml', 'providers', 'sign in'],
      zh: ['登录', '单点登录', 'SSO', '第三方登录', 'OAuth', '登录页'],
    },
  },
  'settings-dialog': {
    description: {
      en: 'An account settings dialog with profile fields, toggles, and a save row.',
      zh: '账号设置对话框：个人资料字段、开关和保存按钮。',
    },
    keywords: {
      en: ['settings', 'preferences', 'dialog', 'modal', 'account', 'profile', 'options'],
      zh: ['设置', '偏好', '对话框', '弹窗', '账号', '个人资料'],
    },
  },
  'settings': {
    description: {
      en: 'A settings page with a category sidebar and tabbed form panels.',
      zh: '设置页：左侧分类列表，右侧标签页表单。',
    },
    keywords: {
      en: ['settings', 'preferences', 'configuration', 'page', 'account', 'options', 'profile'],
      zh: ['设置', '偏好', '配置', '页面', '账号', '选项'],
    },
  },
  'settings-sidebar': {
    description: {
      en: 'A settings layout with a category sidebar and one scrolling panel of sections.',
      zh: '设置布局：左侧分类栏，右侧一长列分节内容。',
    },
    keywords: {
      en: ['settings', 'sidebar', 'preferences', 'panels', 'configuration', 'account'],
      zh: ['设置', '侧边栏', '偏好', '面板', '配置'],
    },
  },
  'blank': {
    description: {
      en: 'An empty page with a shell and a single line of text, for starting from nothing.',
      zh: '空白页：只有框架和一行字，从零开始用。',
    },
    keywords: {
      en: ['blank', 'empty', 'starter', 'scaffold', 'bare', 'minimal'],
      zh: ['空白', '空页', '起点', '脚手架', '极简'],
    },
  },
  'shell-nav': {
    description: {
      en: 'An app shell with a top nav, a side nav tree, and a command palette.',
      zh: '应用框架：顶部导航、侧边导航树和命令面板。',
    },
    keywords: {
      en: ['shell', 'app shell', 'navigation', 'nav', 'sidebar', 'topbar', 'layout', 'app'],
      zh: ['框架', '应用框架', '导航', '侧边栏', '顶栏', '布局'],
    },
  },
  'shell-side-nav': {
    description: {
      en: 'An app shell whose navigation is a side tree with sections and icons.',
      zh: '应用框架：导航放在左侧，带分组和图标。',
    },
    keywords: {
      en: ['shell', 'side nav', 'sidebar', 'navigation', 'layout', 'app', 'tree'],
      zh: ['框架', '侧边导航', '侧边栏', '导航', '布局'],
    },
  },
  'shell-top-nav': {
    description: {
      en: 'An app shell with a top nav and drop-down mega menus.',
      zh: '应用框架：顶部导航加下拉大菜单。',
    },
    keywords: {
      en: ['shell', 'top nav', 'navbar', 'menu', 'mega menu', 'layout', 'app'],
      zh: ['框架', '顶部导航', '导航栏', '菜单', '布局'],
    },
  },
  'table-collapsible': {
    description: {
      en: 'A table whose row groups fold open and closed.',
      zh: '表格：行分组可以展开和折叠。',
    },
    keywords: {
      en: ['table', 'collapsible', 'expandable', 'rows', 'groups', 'data', 'accordion'],
      zh: ['表格', '折叠', '展开', '行', '分组', '数据'],
    },
  },
  'table-comparison': {
    description: {
      en: 'A comparison table with plan columns, switches, and per-row pricing.',
      zh: '对比表格：套餐列、开关和逐行价格。',
    },
    keywords: {
      en: ['table', 'comparison', 'compare', 'plans', 'pricing', 'features', 'matrix'],
      zh: ['表格', '对比', '比较', '套餐', '定价', '功能'],
    },
  },
  'table-filter': {
    description: {
      en: 'A filterable table with a filter bar, a selected row, and a detail panel.',
      zh: '可筛选表格：筛选栏、选中行和详情面板。',
    },
    keywords: {
      en: ['table', 'filter', 'filters', 'search', 'detail panel', 'list', 'records'],
      zh: ['表格', '筛选', '过滤', '搜索', '详情面板', '列表'],
    },
  },
  'table-grouped': {
    description: {
      en: 'A grouped table with a sort control and a group picker.',
      zh: '分组表格：排序控件和分组选择器。',
    },
    keywords: {
      en: ['table', 'grouped', 'group by', 'sort', 'rows', 'data'],
      zh: ['表格', '分组', '排序', '行', '数据'],
    },
  },
  'table-inbox': {
    description: {
      en: 'An inbox table with tabs and a reading pane for the selected message.',
      zh: '收件箱表格：标签页，选中一行在侧边阅读。',
    },
    keywords: {
      en: ['inbox', 'table', 'email', 'mail', 'messages', 'list', 'reading pane'],
      zh: ['收件箱', '表格', '邮件', '消息', '列表', '阅读面板'],
    },
  },
  'table-page': {
    description: {
      en: 'A data table page with search, an empty state, and pagination.',
      zh: '数据表格页：搜索、空状态和分页。',
    },
    keywords: {
      en: ['table', 'data table', 'list', 'search', 'pagination', 'records', 'crud', 'admin'],
      zh: ['表格', '数据表', '列表', '搜索', '分页', '记录', '后台'],
    },
  },
  'table-tree': {
    description: {
      en: 'A tree table with breadcrumbs, nested rows, and a detail panel.',
      zh: '树形表格：面包屑、嵌套行和详情面板。',
    },
    keywords: {
      en: ['table', 'tree', 'tree table', 'nested', 'hierarchy', 'folders', 'groups'],
      zh: ['表格', '树形', '树表', '嵌套', '层级', '文件夹'],
    },
  },
  'canvas-editor': {
    description: {
      en: 'A canvas editor with a toolbar, a layers tree, and a resizable artboard.',
      zh: '画布编辑器：工具栏、图层树和可调整大小的画板。',
    },
    keywords: {
      en: ['editor', 'canvas', 'design', 'toolbar', 'layers', 'artboard', 'draw'],
      zh: ['编辑器', '画布', '设计', '工具栏', '图层', '画板'],
    },
  },
  'file-explorer': {
    description: {
      en: 'A file explorer with a toolbar, a folder tree, and a file list.',
      zh: '文件浏览器：工具栏、文件夹树和文件列表。',
    },
    keywords: {
      en: ['file explorer', 'files', 'folders', 'directory', 'tree', 'browser', 'storage'],
      zh: ['文件浏览器', '文件', '文件夹', '目录', '树形', '浏览'],
    },
  },
  'ide': {
    description: {
      en: 'An IDE layout with a file tree, tabbed code stacks, and an inspector panel.',
      zh: 'IDE 布局：文件树、代码标签页和检查器面板。',
    },
    keywords: {
      en: ['ide', 'code editor', 'developer', 'code', 'tabs', 'inspector', 'workspace'],
      zh: ['IDE', '代码编辑器', '开发者', '代码', '标签页', '检查器'],
    },
  },
  'kanban-board': {
    description: {
      en: 'A kanban board with columns of cards, per-column counts, and drag handles.',
      zh: '看板：多列卡片、每列计数和拖拽把手。',
    },
    keywords: {
      en: ['kanban', 'board', 'cards', 'columns', 'tasks', 'project', 'drag', 'sprint'],
      zh: ['看板', '板', '卡片', '列', '任务', '项目', '拖拽', '迭代'],
    },
  },
  'editor': {
    description: {
      en: 'A document editor with panels, a toolbar, and formatting controls.',
      zh: '文档编辑器：面板、工具栏和排版控件。',
    },
    keywords: {
      en: ['editor', 'document', 'writing', 'toolbar', 'rich text', 'compose', 'word processor'],
      zh: ['编辑器', '文档', '写作', '工具栏', '富文本', '撰写'],
    },
  },
}
