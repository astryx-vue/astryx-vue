import type { TemplateMeta } from './types.ts'

/** Dashboard pages. */
export const DASHBOARD_TEMPLATES: Record<string, TemplateMeta> = {
  'dashboard': {
    description: {
      en: 'An analytics dashboard with a title row, KPI cards, and chart cards.',
      zh: '分析仪表盘：标题行、KPI 卡片和图表卡片。',
    },
    keywords: {
      en: ['dashboard', 'analytics', 'admin dashboard', 'metrics', 'kpi', 'charts', 'chart', 'overview', 'stats', 'reports'],
      zh: ['仪表盘', '分析', '后台', '指标', '图表', '概览', '统计', '报表', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
  'dashboard-comparison': {
    description: {
      en: 'A dashboard that compares two periods, with a date range and side-by-side KPI cards.',
      zh: '对比两个周期的数据仪表盘：日期范围加左右并列的指标卡片。',
    },
    keywords: {
      en: ['dashboard', 'comparison', 'compare', 'period', 'trend', 'metrics', 'data', 'analytics'],
      zh: ['仪表盘', '对比', '比较', '周期', '趋势', '指标', '数据', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
  'dashboard-scorecard': {
    description: {
      en: 'An executive summary dashboard built from scorecard numbers and short breakdowns.',
      zh: '高管摘要仪表盘：一堆记分卡数字和简短拆解。',
    },
    keywords: {
      en: ['dashboard', 'scorecard', 'executive', 'summary', 'kpi', 'numbers', 'report', 'business review'],
      zh: ['仪表盘', '记分卡', '高管', '摘要', '指标', '报表', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
  'dashboard-cohort-funnel': {
    description: {
      en: 'A funnel and cohort dashboard with bar charts and retention breakdowns.',
      zh: '漏斗和群组仪表盘：柱状图加留存拆解。',
    },
    keywords: {
      en: ['dashboard', 'funnel', 'cohort', 'retention', 'conversion', 'bar chart', 'charts', 'growth'],
      zh: ['仪表盘', '漏斗', '群组', '留存', '转化', '柱状图', '增长', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
  'dashboard-composition': {
    description: {
      en: 'A portfolio dashboard with an area chart, composition cards, and a project list.',
      zh: '项目组合仪表盘：面积图、构成卡片和项目列表。',
    },
    keywords: {
      en: ['dashboard', 'portfolio', 'projects', 'composition', 'area chart', 'breakdown', 'charts'],
      zh: ['仪表盘', '组合', '项目', '构成', '面积图', '占比', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
  'dashboard-progress': {
    description: {
      en: 'A project status dashboard with a gantt chart, a donut chart, and progress cards.',
      zh: '项目状态仪表盘：甘特图、环形图和进度卡片。',
    },
    keywords: {
      en: ['dashboard', 'progress', 'project status', 'gantt', 'timeline', 'donut', 'roadmap', 'charts'],
      zh: ['仪表盘', '进度', '项目状态', '甘特图', '时间线', '环形图', '路线图', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
  'dashboard-alert-rail': {
    description: {
      en: 'A service monitoring dashboard with status dots, an alert rail, and sparklines.',
      zh: '服务监控仪表盘：状态点、告警栏和迷你趋势图。',
    },
    keywords: {
      en: ['dashboard', 'monitoring', 'alert', 'alerts', 'status', 'uptime', 'service', 'sparkline', 'ops', 'charts'],
      zh: ['仪表盘', '监控', '告警', '状态', '服务', '运维', '迷你图', '数据看板', '数据面板', '数据大屏', '驾驶舱'],
    },
  },
}
