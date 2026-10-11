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
  thinking: string
  typingOne: (name: string) => string
  typingTwo: (first: string, second: string) => string
  typingMany: (name: string, others: number) => string
  unreadBelow: (label: string) => string
  unreadLabel: string
}

export const chatMessagesEn: ChatMessages = {
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
  thinking: 'Thinking',
  typingOne: name => `${name} is typing…`,
  typingTwo: (first, second) => `${first} and ${second} are typing…`,
  typingMany: (name, others) => `${name} and ${others} others are typing…`,
  unreadBelow: label => `${label} messages below`,
  unreadLabel: 'New',
}

export const chatMessagesZh: ChatMessages = {
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
  thinking: '思考中',
  typingOne: name => `${name} 正在输入…`,
  typingTwo: (first, second) => `${first} 和 ${second} 正在输入…`,
  typingMany: (name, others) => `${name} 和其他 ${others} 人正在输入…`,
  unreadBelow: label => `${label}以下是未读消息`,
  unreadLabel: '新消息',
}
