import type { AstryxLocale } from '../types.js'

export interface PowerSearchOperatorMessages {
  contains: string
  notContains: string
  startsWith: string
  notStartsWith: string
  endsWith: string
  notEndsWith: string
  is: string
  isNot: string
  equals: string
  notEquals: string
  greaterThan: string
  lessThan: string
  greaterThanOrEqual: string
  lessThanOrEqual: string
  before: string
  after: string
  between: string
  isTrue: string
  isFalse: string
  isAnyOf: string
  isNoneOf: string
}

export interface PowerSearchMessages {
  label: string
  placeholder: string
  clear: string
  results: string
  empty: string
  removeFilter: (label: string) => string
  resultCount: (count: number) => string
  itemsCount: (count: number) => string
  entitiesCount: (count: number) => string
  filtersCount: (count: number) => string
  more: (count: number) => string
  dateRange: string
  operators: PowerSearchOperatorMessages
  editor: {
    field: string
    operator: string
    addFilter: string
    removeFilter: string
    group: string
    delete: string
    cancel: string
    apply: string
    editing: string
  }
  value: {
    value: string
    values: string
    time: string
    date: string
    relativeDate: string
    startDate: string
    endDate: string
    entities: string
    searchPlaceholder: string
    enterValuePlaceholder: string
    addValuesPlaceholder: string
    enterNumberPlaceholder: string
    selectPlaceholder: string
    selectValuesPlaceholder: string
  }
}

const operatorsEn: PowerSearchOperatorMessages = {
  contains: 'contains',
  notContains: 'does not contain',
  startsWith: 'starts with',
  notStartsWith: 'does not start with',
  endsWith: 'ends with',
  notEndsWith: 'does not end with',
  is: 'is',
  isNot: 'is not',
  equals: 'equals',
  notEquals: 'does not equal',
  greaterThan: 'is greater than',
  lessThan: 'is less than',
  greaterThanOrEqual: 'is greater than or equal to',
  lessThanOrEqual: 'is less than or equal to',
  before: 'is before',
  after: 'is after',
  between: 'is between',
  isTrue: 'is true',
  isFalse: 'is false',
  isAnyOf: 'is any of',
  isNoneOf: 'is none of',
}

const operatorsZh: PowerSearchOperatorMessages = {
  contains: '包含',
  notContains: '不包含',
  startsWith: '开头是',
  notStartsWith: '开头不是',
  endsWith: '结尾是',
  notEndsWith: '结尾不是',
  is: '是',
  isNot: '不是',
  equals: '等于',
  notEquals: '不等于',
  greaterThan: '大于',
  lessThan: '小于',
  greaterThanOrEqual: '大于或等于',
  lessThanOrEqual: '小于或等于',
  before: '早于',
  after: '晚于',
  between: '介于',
  isTrue: '为真',
  isFalse: '为假',
  isAnyOf: '是其中任一',
  isNoneOf: '不是其中任何一个',
}

export const powerSearchMessages: Record<AstryxLocale, PowerSearchMessages> = {
  'en': {
    label: 'Search',
    placeholder: 'Search…',
    clear: 'Clear all',
    results: 'Search results',
    empty: 'No results',
    removeFilter: label => `Remove ${label}`,
    resultCount: count => `${new Intl.NumberFormat('en').format(count)} ${count === 1 ? 'result' : 'results'}`,
    itemsCount: count => `${new Intl.NumberFormat('en').format(count)} ${count === 1 ? 'item' : 'items'}`,
    entitiesCount: count => `${new Intl.NumberFormat('en').format(count)} ${count === 1 ? 'entity' : 'entities'}`,
    filtersCount: count => `${new Intl.NumberFormat('en').format(count)} ${count === 1 ? 'filter' : 'filters'}`,
    more: count => `${new Intl.NumberFormat('en').format(count)} more`,
    dateRange: 'date range',
    operators: operatorsEn,
    editor: {
      field: 'Field',
      operator: 'Operator',
      addFilter: '+ Add filter',
      removeFilter: 'Remove filter',
      group: 'Group',
      delete: 'Delete',
      cancel: 'Cancel',
      apply: 'Apply',
      editing: 'Edit filter',
    },
    value: {
      value: 'Value',
      values: 'Values',
      time: 'Time',
      date: 'Date',
      relativeDate: 'Relative date',
      startDate: 'Start date',
      endDate: 'End date',
      entities: 'Entities',
      searchPlaceholder: 'Search…',
      enterValuePlaceholder: 'Enter value…',
      addValuesPlaceholder: 'Add values…',
      enterNumberPlaceholder: 'Enter number…',
      selectPlaceholder: 'Select…',
      selectValuesPlaceholder: 'Select values…',
    },
  },
  'zh-CN': {
    label: '搜索',
    placeholder: '搜索……',
    clear: '全部清除',
    results: '搜索结果',
    empty: '没有结果',
    removeFilter: label => `移除${label}`,
    resultCount: count => `${new Intl.NumberFormat('zh-CN').format(count)} 个结果`,
    itemsCount: count => `${new Intl.NumberFormat('zh-CN').format(count)} 个项目`,
    entitiesCount: count => `${new Intl.NumberFormat('zh-CN').format(count)} 个实体`,
    filtersCount: count => `${new Intl.NumberFormat('zh-CN').format(count)} 个筛选条件`,
    more: count => `另外 ${new Intl.NumberFormat('zh-CN').format(count)} 个`,
    dateRange: '日期范围',
    operators: operatorsZh,
    editor: {
      field: '字段',
      operator: '运算符',
      addFilter: '＋ 添加筛选条件',
      removeFilter: '移除筛选条件',
      group: '分组',
      delete: '删除',
      cancel: '取消',
      apply: '应用',
      editing: '编辑筛选条件',
    },
    value: {
      value: '值',
      values: '值',
      time: '时间',
      date: '日期',
      relativeDate: '相对日期',
      startDate: '开始日期',
      endDate: '结束日期',
      entities: '实体',
      searchPlaceholder: '搜索……',
      enterValuePlaceholder: '输入值……',
      addValuesPlaceholder: '添加值……',
      enterNumberPlaceholder: '输入数字……',
      selectPlaceholder: '选择……',
      selectValuesPlaceholder: '选择值……',
    },
  },
}
