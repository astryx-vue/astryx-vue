import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

export interface ChatMessages {
  log: string
  newMessages: string
  scrollToBottom: string
  messageFrom: (sender: string) => string
  messageStatus: (status: string) => string
  statusSending: string
  statusSent: string
  statusDelivered: string
  statusRead: string
  statusFailed: string
  senderUser: string
  senderAssistant: string
  senderSystem: string
  toolError: (message: string) => string
  toolGroup: (count: number) => string
  toolPending: string
  toolRunning: string
  /** 工具调用成功完成时，读屏念的状态。 */
  toolComplete: string
  /** 工具调用失败且没有错误详情时，读屏念的状态。 */
  toolFailed: string
  thinking: string
  typingOne: (name: string) => string
  typingTwo: (first: string, second: string) => string
  typingMany: (name: string, others: number) => string
  /**
   * 两人及以上在输入时的状态。`names` 已经用 `Intl.ListFormat` 按当前语言连好，
   * 文案里不要再自己加「和」。
   */
  typingNames: (names: string) => string
  /** 三人及以上时，第一个名字后面那段「另外 N 人」，再交给 `Intl.ListFormat` 连起来。 */
  typingOthers: (count: number) => string
  unreadBelow: (label: string) => string
  unreadLabel: string
  placeholder: string
  drawerLabel: string
  inputLabel: string
  noSpeechDetected: string
  expandPastedText: string
  drawerExpand: (label: string) => string
  drawerCollapse: (label: string) => string
  startDictation: string
  stopDictation: string
  send: string
  stop: string
  suggestions: string
  searching: string
  noResults: string
}

export const chatMessages: Record<AstryxLocale, ChatMessages> = {
  'en': {
    log: 'Messages',
    newMessages: 'New messages',
    scrollToBottom: 'Scroll to bottom',
    messageFrom: sender => `Message from ${sender}`,
    messageStatus: status => `Message ${status}`,
    statusSending: 'Sending',
    statusSent: 'Sent',
    statusDelivered: 'Delivered',
    statusRead: 'Read',
    statusFailed: 'Failed',
    senderUser: 'user',
    senderAssistant: 'assistant',
    senderSystem: 'system',
    toolError: message => `Error: ${message}`,
    toolGroup: count => `${count} tool calls`,
    toolPending: 'Pending',
    toolRunning: 'Running',
    toolComplete: 'Complete',
    toolFailed: 'Failed',
    thinking: 'Thinking',
    typingOne: name => `${name} is typing…`,
    typingTwo: (first, second) => `${first} and ${second} are typing…`,
    typingMany: (name, others) => `${name} and ${others} others are typing…`,
    typingNames: names => `${names} are typing…`,
    typingOthers: count => `${formatCount(count, 'en')} ${englishPlural(count, 'other', 'others')}`,
    unreadBelow: label => `${label} messages below`,
    unreadLabel: 'New',
    placeholder: 'Type a message…',
    drawerLabel: 'Items',
    inputLabel: 'Message input',
    noSpeechDetected: 'No speech was detected.',
    expandPastedText: 'Expand',
    drawerExpand: label => `Expand ${label}`,
    drawerCollapse: label => `Collapse ${label}`,
    startDictation: 'Start dictation',
    stopDictation: 'Stop dictation',
    send: 'Send',
    stop: 'Stop',
    suggestions: 'Suggestions',
    searching: 'Searching…',
    noResults: 'No results',
  },
  'zh-CN': {
    log: '消息列表',
    newMessages: '有新消息',
    scrollToBottom: '滚动到底部',
    messageFrom: sender => `来自${sender}的消息`,
    messageStatus: status => `消息${status}`,
    statusSending: '发送中',
    statusSent: '已发送',
    statusDelivered: '已送达',
    statusRead: '已读',
    statusFailed: '发送失败',
    senderUser: '用户',
    senderAssistant: '助手',
    senderSystem: '系统',
    toolError: message => `错误：${message}`,
    toolGroup: count => `${count} 个工具调用`,
    toolPending: '等待中',
    toolRunning: '进行中',
    toolComplete: '已完成',
    toolFailed: '失败',
    thinking: '思考中',
    typingOne: name => `${name} 正在输入…`,
    typingTwo: (first, second) => `${first} 和 ${second} 正在输入…`,
    typingMany: (name, others) => `${name} 和其他 ${others} 人正在输入…`,
    typingNames: names => `${names}正在输入…`,
    typingOthers: count => `另外 ${formatCount(count, 'zh-CN')} 人`,
    unreadBelow: label => `${label}以下是未读消息`,
    unreadLabel: '新消息',
    placeholder: '输入消息……',
    drawerLabel: '项目',
    inputLabel: '消息输入框',
    noSpeechDetected: '未检测到语音。',
    expandPastedText: '展开',
    drawerExpand: label => `展开 ${label}`,
    drawerCollapse: label => `折叠 ${label}`,
    startDictation: '开始语音输入',
    stopDictation: '停止语音输入',
    send: '发送',
    stop: '停止',
    suggestions: '建议',
    searching: '正在搜索…',
    noResults: '没有结果',
  },
}
