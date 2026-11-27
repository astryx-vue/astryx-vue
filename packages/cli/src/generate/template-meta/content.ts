import type { TemplateMeta } from './types.ts'

/** Theme sampler, AI chat, and content pages (catalogs, articles, detail pages). */
export const CONTENT_TEMPLATES: Record<string, TemplateMeta> = {
  'theme-showcase': {
    description: {
      en: 'A sampler page of sample product screens (a storefront with an account dialog, checkout, chat, activity, and inventory) rendered in the active theme.',
      zh: '一页样例产品界面（带账号对话框的商店、结账、聊天、动态和库存），用当前主题渲染。',
    },
    keywords: {
      en: ['theme', 'themes', 'styling', 'design system', 'preview'],
      zh: ['主题', '样式', '设计系统', '预览'],
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
      en: ['ai', 'landing', 'hero', 'prompt', 'composer', 'greeting', 'suggestions', 'start chat', 'marketing', 'home'],
      zh: ['AI', '落地页', '首页', '提示词', '输入框', '问候语', '建议', '营销'],
    },
  },
  'library': {
    description: {
      en: 'A card grid for browsing media and documents, with search, filters, sorting, and sections.',
      zh: '用卡片网格浏览素材和文档，带搜索、筛选、排序和分组。',
    },
    keywords: {
      en: ['library', 'cards', 'grid', 'gallery', 'media', 'browse', 'catalog', 'content', 'assets', 'files', 'collection', 'categories'],
      zh: ['素材库', '卡片', '网格', '媒体', '浏览', '目录', '内容', '文件', '合集', '分类'],
    },
  },
  'documentation': {
    description: {
      en: 'A documentation catalog: cards that lead into the sections of a docs site.',
      zh: '文档目录页：用卡片进入文档站的各个部分。',
    },
    keywords: {
      en: ['docs', 'documentation', 'catalog', 'help center', 'knowledge base', 'articles', 'guides', 'support', 'docs home', 'component catalog'],
      zh: ['文档', '帮助中心', '知识库', '文章', '指南', '支持', '文档首页', '组件目录'],
    },
  },
  'documentation-design': {
    description: {
      en: 'A documentation article page with a side outline, prose, code blocks, and a media dialog.',
      zh: '文档正文页：侧边目录、正文、代码块和图片弹窗。',
    },
    keywords: {
      en: ['documentation', 'docs', 'article', 'guide', 'sidebar', 'outline', 'content page', 'prose', 'component documentation', 'usage guidelines', 'best practices', 'examples', 'table of contents'],
      zh: ['文档', '文章', '指南', '侧边栏', '目录', '正文', '组件文档', '使用规范', '最佳实践', '示例'],
    },
  },
  'documentation-technical': {
    description: {
      en: 'A technical reference page with a side outline, API prose, lists, and code samples.',
      zh: '技术参考页：侧边目录、API 说明、列表和代码示例。',
    },
    keywords: {
      en: ['documentation', 'technical', 'reference', 'api docs', 'code samples', 'developer', 'manual', 'article', 'walkthrough', 'developer guide', 'table of contents'],
      zh: ['文档', '技术', '参考', 'API 文档', '代码示例', '开发者', '手册', '上手指南', '开发者指南', '目录'],
    },
  },
  'detail-page': {
    description: {
      en: 'An order detail page with a header, contact rows, line items, and totals.',
      zh: '订单详情页：头部信息、联系人信息、商品行和金额汇总。',
    },
    keywords: {
      en: ['order', 'detail', 'invoice', 'receipt', 'summary', 'purchase', 'transaction', 'billing', 'detail view', 'record view', 'fulfillment'],
      zh: ['订单', '详情', '发票', '收据', '汇总', '交易', '账单', '记录详情', '履约'],
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
      en: ['work item', 'task', 'issue', 'ticket', 'detail', 'project', 'assignee', 'activity', 'subtasks'],
      zh: ['工作项', '任务', '问题', '工单', '详情', '项目', '负责人', '子任务'],
    },
  },
  'course-detail': {
    description: {
      en: 'A long-form sales page for a single offering, in two columns: a preview poster, about block, collapsible syllabus, instructor card, reviews with scored aspects, and a FAQ, beside a sticky enroll rail with price, a self-paced or cohort start picker, and a weekly-pace slider that computes a finish date.',
      zh: '单个课程的长页面，分两栏：预览海报、课程介绍、可折叠大纲、讲师卡片、带分项评分的评价和常见问题；右侧是固定的报名栏，含价格、自学或班期选择，以及按每周学习时长推算完课日期的滑块。',
    },
    keywords: {
      en: ['course', 'class', 'lesson', 'curriculum', 'syllabus', 'e-learning', 'enroll', 'cohort', 'masterclass', 'bootcamp', 'training', 'education'],
      zh: ['课程', '课堂', '课时', '大纲', '在线学习', '报名', '班期', '大师课', '训练营', '培训', '教育'],
    },
  },
}
