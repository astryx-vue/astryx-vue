import type { TemplateMeta } from './types.ts'

/** Theme sampler, AI chat, and content pages (catalogs, articles, detail pages). */
export const CONTENT_TEMPLATES: Record<string, TemplateMeta> = {
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
}
