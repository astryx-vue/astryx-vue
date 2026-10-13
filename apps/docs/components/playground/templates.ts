import type { PlaygroundLocale } from './protocol'

export interface PlaygroundTemplate {
  id: string
  group: 'chat' | 'form' | 'table' | 'shell'
  source: string
}

export function playgroundTemplates(locale: PlaygroundLocale): PlaygroundTemplate[] {
  const zh = locale === 'zh'
  return [
    { id: 'chat', group: 'chat', source: chatSource(zh) },
    { id: 'form', group: 'form', source: formSource(zh) },
    { id: 'inbox', group: 'table', source: inboxSource(zh) },
    { id: 'side-nav', group: 'shell', source: sideNavSource(zh) },
    { id: 'top-nav', group: 'shell', source: topNavSource(zh) },
  ]
}

function chatSource(zh: boolean): string {
  return dedent(`
    <script setup>
    import { ref } from 'vue'
    import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatSystemMessage, IconButton } from '@astryx-vue/core'

    const draft = ref('')
    const messages = ref([
      { id: 1, sender: 'assistant', text: ${js(zh ? '我看过 Button 了，圆角已经改成主题变量。' : 'I checked Button. The radius now uses the theme token.')} },
      { id: 2, sender: 'user', text: ${js(zh ? '再看一下 Card。' : 'Can you look at Card next?')} },
    ])
    const today = ${js(zh ? '今天' : 'Today')}
    const placeholder = ${js(zh ? '写一条消息' : 'Write a message')}
    const sendLabel = ${js(zh ? '发送' : 'Send')}

    function send() {
      const text = draft.value.trim()
      if (!text)
        return
      messages.value = [...messages.value, { id: Date.now(), sender: 'user', text }]
      draft.value = ''
    }
    </script>

    <template>
      <ChatLayout>
        <ChatMessageList>
          <ChatSystemMessage variant="divider">
            {{ today }}
          </ChatSystemMessage>
          <ChatMessage v-for="message in messages" :key="message.id" :sender="message.sender">
            <ChatMessageBubble>
              {{ message.text }}
            </ChatMessageBubble>
          </ChatMessage>
        </ChatMessageList>
        <template #composer>
          <form class="composer" @submit.prevent="send">
            <textarea v-model="draft" rows="2" :aria-label="placeholder" :placeholder="placeholder" />
            <IconButton type="submit" variant="primary" size="md" :label="sendLabel">
              <span class="i-carbon-arrow-up" />
            </IconButton>
          </form>
        </template>
      </ChatLayout>
    </template>

    <style scoped>
    .composer {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      width: 100%;
    }

    .composer textarea {
      flex: 1;
      min-height: 44px;
      border: 0;
      padding: 8px 0;
      resize: vertical;
      background: transparent;
      color: inherit;
      font: inherit;
    }
    </style>
  `)
}

function formSource(zh: boolean): string {
  return dedent(`
    <script setup>
    import { ref } from 'vue'
    import { Button, Card, FormLayout, Heading, Switch, Text, TextArea, TextInput, VStack } from '@astryx-vue/core'

    const name = ref('')
    const email = ref('')
    const message = ref('')
    const subscribed = ref(false)
    const sent = ref(false)
    const title = ${js(zh ? '联系我们' : 'Contact')}
    const nameLabel = ${js(zh ? '姓名' : 'Name')}
    const emailLabel = ${js(zh ? '邮箱' : 'Email')}
    const messageLabel = ${js(zh ? '留言' : 'Message')}
    const subscribeLabel = ${js(zh ? '订阅更新' : 'Subscribe to updates')}
    const sendLabel = ${js(zh ? '发送' : 'Send')}
    const sentLabel = ${js(zh ? '已发送。' : 'Sent.')}

    function submit() {
      sent.value = true
    }
    </script>

    <template>
      <div class="page">
        <VStack :gap="5">
          <Heading :level="1">
            {{ title }}
          </Heading>
          <Card>
            <form @submit.prevent="submit">
              <FormLayout>
                <TextInput v-model="name" :label="nameLabel" />
                <TextInput v-model="email" type="email" :label="emailLabel" />
                <TextArea v-model="message" :rows="4" :label="messageLabel" />
                <Switch v-model="subscribed" :label="subscribeLabel" />
                <Button type="submit" variant="primary" :label="sendLabel" />
              </FormLayout>
            </form>
          </Card>
          <Text v-if="sent" display="block">
            {{ sentLabel }}
          </Text>
        </VStack>
      </div>
    </template>

    <style scoped>
    .page {
      box-sizing: border-box;
      max-width: 40rem;
      margin: 0 auto;
      padding: var(--astryx-spacing-6);
    }
    </style>
  `)
}

function inboxSource(zh: boolean): string {
  return dedent(`
    <script setup>
    import { computed, ref } from 'vue'
    import { Badge, Button, Card, Heading, HStack, Table, TextInput, VStack, pixel, proportional } from '@astryx-vue/core'

    const query = ref('')
    const title = ${js(zh ? '收件箱' : 'Inbox')}
    const searchLabel = ${js(zh ? '搜索' : 'Search')}
    const composeLabel = ${js(zh ? '写邮件' : 'Compose')}
    const rows = [
      { id: '1', from: 'Ada', subject: ${js(zh ? '主题变量已经对上' : 'Theme tokens line up')}, status: ${js(zh ? '待处理' : 'Open')}, when: '09:12' },
      { id: '2', from: 'Lin', subject: ${js(zh ? '预览里的表格' : 'Table in the preview')}, status: ${js(zh ? '已读' : 'Read')}, when: '08:40' },
      { id: '3', from: 'Noor', subject: ${js(zh ? '周五前看一下表单' : 'Look at the form before Friday')}, status: ${js(zh ? '待处理' : 'Open')}, when: ${js(zh ? '昨天' : 'Yesterday')} },
      { id: '4', from: 'Mina', subject: ${js(zh ? '导航草稿' : 'Navigation draft')}, status: ${js(zh ? '已读' : 'Read')}, when: ${js(zh ? '周一' : 'Monday')} },
    ]
    const columns = [
      { key: 'from', header: ${js(zh ? '发件人' : 'From')}, width: proportional(1) },
      { key: 'subject', header: ${js(zh ? '主题' : 'Subject')}, width: proportional(2) },
      { key: 'status', header: ${js(zh ? '状态' : 'Status')}, width: proportional(1) },
      { key: 'when', header: ${js(zh ? '时间' : 'When')}, width: pixel(96) },
    ]
    const filtered = computed(() => {
      const needle = query.value.trim().toLowerCase()
      if (!needle)
        return rows
      return rows.filter(row =>
        row.from.toLowerCase().includes(needle)
        || row.subject.toLowerCase().includes(needle)
        || row.status.toLowerCase().includes(needle),
      )
    })
    const unread = computed(() => rows.filter(row => row.status === ${js(zh ? '待处理' : 'Open')}).length)
    </script>

    <template>
      <div class="page">
        <VStack :gap="4">
          <HStack :gap="3" align="center" justify="between">
            <HStack :gap="2" align="center">
              <Heading :level="1">
                {{ title }}
              </Heading>
              <Badge>{{ unread }}</Badge>
            </HStack>
            <Button type="button" variant="primary" :label="composeLabel" />
          </HStack>
          <TextInput v-model="query" :label="searchLabel" />
          <Card>
            <Table :data="filtered" :columns="columns" id-key="id" has-hover />
          </Card>
        </VStack>
      </div>
    </template>

    <style scoped>
    .page {
      box-sizing: border-box;
      padding: var(--astryx-spacing-6);
    }
    </style>
  `)
}

function sideNavSource(zh: boolean): string {
  return dedent(`
    <script setup>
    import { AppShell, Heading, SideNav, SideNavHeading, SideNavItem, SideNavSection, Text, VStack } from '@astryx-vue/core'

    const appName = ${js(zh ? '工作台' : 'Workspace')}
    const pageTitle = ${js(zh ? '概览' : 'Overview')}
    const body = ${js(zh ? '今天有 4 个进行中的项目，2 个在等回复。' : 'Four projects are in progress, and two are waiting on a reply.')}
    const main = ${js(zh ? '主要' : 'Main')}
    const organization = ${js(zh ? '组织' : 'Organization')}
    const overview = ${js(zh ? '概览' : 'Overview')}
    const analytics = ${js(zh ? '分析' : 'Analytics')}
    const projects = ${js(zh ? '项目' : 'Projects')}
    const team = ${js(zh ? '团队' : 'Team')}
    const settings = ${js(zh ? '设置' : 'Settings')}
    </script>

    <template>
      <AppShell :content-padding="6">
        <template #sideNav>
          <SideNav>
            <template #header>
              <SideNavHeading :heading="appName" heading-href="#overview">
                <template #icon>
                  <span class="i-carbon-cube nav-mark" />
                </template>
              </SideNavHeading>
            </template>
            <SideNavSection is-header-hidden :title="main">
              <SideNavItem href="#overview" icon-class="i-carbon-home" is-selected :label="overview" />
              <SideNavItem href="#analytics" icon-class="i-carbon-analytics" :label="analytics" />
              <SideNavItem href="#projects" icon-class="i-carbon-folder" :label="projects" />
            </SideNavSection>
            <SideNavSection :title="organization">
              <SideNavItem href="#team" icon-class="i-carbon-user" :label="team" />
              <SideNavItem href="#settings" icon-class="i-carbon-settings" :label="settings" />
            </SideNavSection>
          </SideNav>
        </template>
        <VStack :gap="4">
          <Heading :level="1">
            {{ pageTitle }}
          </Heading>
          <Text type="body" display="block">
            {{ body }}
          </Text>
        </VStack>
      </AppShell>
    </template>

    <style scoped>
    .nav-mark {
      display: block;
      width: 16px;
      height: 16px;
    }
    </style>
  `)
}

function topNavSource(zh: boolean): string {
  return dedent(`
    <script setup>
    import { Heading, Text, TopNav, TopNavHeading, TopNavItem, VStack } from '@astryx-vue/core'

    const appName = ${js(zh ? 'Acme' : 'Acme')}
    const home = ${js(zh ? '首页' : 'Home')}
    const products = ${js(zh ? '产品' : 'Products')}
    const about = ${js(zh ? '关于' : 'About')}
    const title = ${js(zh ? '首页' : 'Home')}
    const body = ${js(zh ? '春季系列已经上架。' : 'The spring collection is now available.')}
    </script>

    <template>
      <div class="page">
        <TopNav>
          <template #heading>
            <TopNavHeading :heading="appName" href="#home" />
          </template>
          <TopNavItem href="#home" is-selected :label="home" />
          <TopNavItem href="#products" :label="products" />
          <TopNavItem href="#about" :label="about" />
        </TopNav>
        <main class="main">
          <VStack :gap="3">
            <Heading :level="1">
              {{ title }}
            </Heading>
            <Text type="body" display="block">
              {{ body }}
            </Text>
          </VStack>
        </main>
      </div>
    </template>

    <style scoped>
    .page {
      min-height: 100%;
      background: var(--astryx-color-background-body);
      color: var(--astryx-color-text-primary);
    }

    .main {
      padding: var(--astryx-spacing-6);
    }
    </style>
  `)
}

function js(value: string): string {
  return JSON.stringify(value)
}

function dedent(text: string): string {
  const lines = text.replace(/^\n/, '').replace(/\n[ \t]*$/, '').split('\n')
  const indent = lines.filter(line => line.trim()).reduce((min, line) => {
    const width = /^[ \t]*/.exec(line)?.[0].length ?? 0
    return Math.min(min, width)
  }, Number.POSITIVE_INFINITY)
  return lines.map(line => line.slice(indent)).join('\n')
}
