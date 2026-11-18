<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  AppShell,
  AspectRatio,
  Badge,
  Banner,
  Button,
  Card,
  Center,
  CheckboxInput,
  ChatComposer,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSystemMessage,
  DialogHeader,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Item,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  Link,
  MoreMenu,
  NumberInput,
  pixel,
  proportional,
  RadioList,
  RadioListItem,
  ScrollableArea,
  Section,
  SelectableCard,
  Selector,
  StackItem,
  Table,
  Text,
  TextInput,
  TopNav,
  TopNavHeading,
  TopNavItem,
  useAppShellMobile,
  useChatNewMessages,
  useChatStreamScroll,
  useImperativeAlertDialog,
  useImperativeDialog,
  useToast,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'

type ShowcaseBadgeVariant = 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'

interface ProductSpec {
  name: string
  description: string
  badge: string
  badgeVariant: ShowcaseBadgeVariant
}

interface TagSpec { label: string, variant: ShowcaseBadgeVariant }

interface InventoryRow extends Record<string, unknown> {
  id: string
  name: string
  meta: string
  available: number
  location: string
  /** 可选分类，主题页的库存数据可以不带。 */
  category?: string
  tags: TagSpec[]
  imageKey?: string
  thumbnailFallback: string
  selected: boolean
}

const PRODUCT_IMAGE_KEYS = ['watch', 'headphones', 'backpack']

const DEFAULT_IMAGES: Record<string, string> = {
  watch: '/template-assets/Neutral-Watch.png',
  headphones: '/template-assets/Neutral-Headphones.png',
  backpack: '/template-assets/Neutral-Backpack.png',
  wallet: '/template-assets/Neutral-Wallet.png',
  tumbler: '/template-assets/Neutral-Tumbler.png',
  throw_: '/template-assets/Neutral-Blanket.png',
}

const DEFAULT_PRODUCTS: ProductSpec[] = [
  { name: 'Minimalist Watch', description: 'Clean design meets everyday durability.', badge: 'New', badgeVariant: 'blue' },
  { name: 'Wireless Headphones', description: 'Immersive sound, all-day comfort.', badge: 'Popular', badgeVariant: 'green' },
  { name: 'Canvas Backpack', description: 'Water-resistant canvas with a quiet, modern profile.', badge: 'Limited', badgeVariant: 'yellow' },
]

const DEFAULT_INVENTORY: InventoryRow[] = [
  { id: 'a', name: 'Minimalist Watch', meta: 'Stainless steel, sapphire crystal', available: 42, location: 'Aisle 3', category: 'Wearables', tags: [{ label: 'New', variant: 'blue' }], imageKey: 'watch', thumbnailFallback: 'M', selected: false },
  { id: 'b', name: 'Wireless Headphones', meta: 'ANC, 30hr battery', available: 128, location: 'Aisle 1', category: 'Audio', tags: [{ label: 'Popular', variant: 'green' }], imageKey: 'headphones', thumbnailFallback: 'W', selected: true },
  { id: 'c', name: 'Canvas Backpack', meta: 'Water-resistant, 25L', available: 63, location: 'Aisle 2', category: 'Bags', tags: [{ label: 'Limited', variant: 'yellow' }], imageKey: 'backpack', thumbnailFallback: 'C', selected: false },
  { id: 'd', name: 'Leather Wallet', meta: 'Full-grain, RFID blocking', available: 15, location: 'Aisle 4', category: 'Wearables', tags: [{ label: 'Leather', variant: 'yellow' }], imageKey: 'wallet', thumbnailFallback: 'L', selected: true },
  { id: 'e', name: 'Travel Tumbler', meta: 'Vacuum insulated, 16oz', available: 87, location: 'Aisle 5', category: 'Drinkware', tags: [{ label: 'Drinkware', variant: 'green' }], imageKey: 'tumbler', thumbnailFallback: 'T', selected: false },
  { id: 'f', name: 'Linen Throw', meta: 'Heavyweight, oat', available: 24, location: 'Aisle 6', category: 'Home', tags: [{ label: 'Home', variant: 'orange' }], imageKey: 'throw_', thumbnailFallback: 'L', selected: true },
]

// 主题页用同一个模板，换成各主题自己的商品和图片；演练场里不传，用上面的默认值。
// embedded 对应原版的 ThemeShowcaseStore：外壳归宿主页面，这里不套 AppShell，标题降为二级。
const props = defineProps<{
  images?: Record<string, string>
  products?: ProductSpec[]
  inventoryRows?: InventoryRow[]
  embedded?: boolean
}>()

/** 演练场里是整页 AppShell；嵌进主题页时只是一列，导航和内容直接上下排。 */
const ShowcaseShell = defineComponent({
  setup(_, { slots }) {
    return () => props.embedded
      ? h(VStack, { 'gap': 0, 'data-theme-preview': 'true', 'style': { backgroundColor: 'var(--astryx-color-background-body)' } }, () => [slots.topNav?.(), slots.default?.()])
      : h(AppShell, { 'height': 'auto', 'variant': 'surface', 'contentPadding': 0, 'data-theme-preview': 'true' }, { topNav: slots.topNav, default: slots.default })
  },
})

const images = props.images ?? DEFAULT_IMAGES
const products = props.products ?? DEFAULT_PRODUCTS
const inventory = props.inventoryRows ?? DEFAULT_INVENTORY

const SUGGESTED_QUESTIONS = ['Reschedule delivery', 'Update shipping address', 'Start a return']

const ACTIVITY = [
  { id: '1', kind: 'order', label: 'Order #1043', detail: 'Placed · 1:59 pm', amount: 248 },
  { id: '2', kind: 'refund', label: 'Order #1041', detail: 'Refunded · 12:40 pm', amount: -89 },
  { id: '3', kind: 'order', label: 'Order #1040', detail: 'Placed · 10:30 am', amount: 156 },
  { id: '4', kind: 'order', label: 'Order #1038', detail: 'Placed · 9:11 am', amount: 412 },
  { id: '5', kind: 'order', label: 'Order #1037', detail: 'Placed · 8:42 am', amount: 95 },
]

const LOW_STOCK_THRESHOLD = 25

const SearchIcon = () => h(Icon, { name: 'heroicons:magnifying-glass', size: 'sm' })
const CreditCardIcon = () => h(Icon, { name: 'heroicons:credit-card', size: 'sm' })
const FolderIcon = () => h(Icon, { name: 'heroicons:folder', size: 'sm' })
const MapPinIcon = () => h(Icon, { name: 'heroicons:map-pin', size: 'sm' })
const TagIcon = () => h(Icon, { name: 'heroicons:tag', size: 'sm' })

const { isMobile } = useAppShellMobile()

// 演示用：真实项目里把这些提示换成执行对应操作的调用。
const showToast = useToast()
const confirm = useImperativeAlertDialog()
const ConfirmHost = confirm.Host
function demo(body: string, uniqueID: string) {
  showToast({ body, uniqueID })
}
function confirmDelete() {
  confirm.show({
    title: 'Delete this item?',
    description: 'This demo won\'t delete anything.',
    actionLabel: 'Delete',
    onAction: () => {
      confirm.hide()
      demo('Demo: the item would be deleted here', 'row-delete')
    },
  })
}

// 登录：打开真的对话框，主题的页头、关闭按钮、输入框和页脚按钮能一起检查。
// 每次打开换一个 key，表单重新挂载，重开后是空的。
const signIn = useImperativeDialog({ purpose: 'form', width: 400 })
const SignInHost = signIn.Host
let signInOpens = 0
const SignInForm = defineComponent({
  setup() {
    const signInEmail = ref('')
    const signInPassword = ref('')
    return () => h(Layout, null, {
      header: () => h(DialogHeader, { title: 'Sign in', onOpenChange: () => signIn.hide() }),
      default: () => h(LayoutContent, null, () => h(VStack, { gap: 4 }, () => [
        h(TextInput, { 'label': 'Email', 'placeholder': 'you@studio.com', 'modelValue': signInEmail.value, 'onUpdate:modelValue': (v: string) => { signInEmail.value = v } }),
        h(TextInput, { 'label': 'Password', 'type': 'password', 'modelValue': signInPassword.value, 'onUpdate:modelValue': (v: string) => { signInPassword.value = v } }),
      ])),
      footer: () => h(LayoutFooter, null, () => h(HStack, { gap: 2, hAlign: 'end' }, () => [
        h(Button, { label: 'Cancel', variant: 'secondary', onClick: () => signIn.hide() }),
        h(Button, { label: 'Sign in', variant: 'primary', onClick: () => signIn.hide() }),
      ])),
    })
  },
})
function openSignIn() {
  signIn.show(() => h(SignInForm, { key: ++signInOpens }), { 'aria-label': 'Sign in' } as never)
}

// 商品卡：每张卡各自记数量和「已加入」状态。
const quantities = reactive<Record<string, number | null>>(Object.fromEntries(products.map(p => [p.name, 1])))
const added = reactive<Record<string, boolean>>({})

// 结账卡
const email = ref('')
const shipping = ref('economy')
const payment = ref('card')
const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')
const country = ref<string | undefined>('us')
const saveInformation = ref(true)
const showPaymentPreview = ref(false)

// 聊天卡
const draft = ref('')
const sentMessages = ref<Array<{ id: number, text: string }>>([])
// 对话区默认贴着底部：首次可滚动时跳到底，内容增长时继续跟随（对应原版 ChatCard 的 useChatStreamScroll）。
const chatContent = ref<{ element?: HTMLElement | null } | null>(null)
const chatScrollEl = computed(() => chatContent.value?.element ?? null)
const { lock, isLocked, scrollIfLocked, scrollToBottom } = useChatStreamScroll({ scrollRef: chatScrollEl })
const { contentRef } = useChatNewMessages({ isLocked, onResize: scrollIfLocked })
onMounted(() => {
  contentRef(chatScrollEl.value?.querySelector<HTMLElement>('.astryx-chat-message-list') ?? null)
  // 字体和主题内容加载期间容器会被重排，浏览器把滚动位置清零；贴底要在这几次重排之后再补几次。
  for (const delay of [0, 300, 800])
    setTimeout(() => scrollToBottom({ behavior: 'instant' }), delay)
  document.fonts?.ready.then(() => scrollToBottom({ behavior: 'instant' }))
})
function submitMessage() {
  const message = draft.value.trim()
  if (!message)
    return
  lock()
  sentMessages.value.push({ id: (sentMessages.value.at(-1)?.id ?? 0) + 1, text: message })
  draft.value = ''
}

function formatAmount(amount: number) {
  const sign = amount < 0 ? '−' : '+'
  return `${sign}$${Math.abs(amount).toLocaleString()}`
}

// 库存卡
const query = ref('')
const category = ref<string | null>(null)
const location = ref<string | null>(null)
const tag = ref<string | null>(null)
const selectedIds = ref(new Set(inventory.filter(row => row.selected).map(row => row.id)))
const lowStockCount = inventory.filter(row => row.available < LOW_STOCK_THRESHOLD).length
const categories = [...new Set(inventory.flatMap(row => (row.category ? [row.category] : [])))]
const locations = [...new Set(inventory.map(row => row.location))]
const tagOptions = [...new Set(inventory.flatMap(row => row.tags.map(value => value.label)))]
const rows = computed(() => inventory.filter(row =>
  (!query.value || `${row.name} ${row.meta}`.toLowerCase().includes(query.value.toLowerCase()))
  && (!category.value || row.category === category.value)
  && (!location.value || row.location === location.value)
  && (!tag.value || row.tags.some(value => value.label === tag.value)),
))

function selectRow(id: string, selected: boolean) {
  const next = new Set(selectedIds.value)
  if (selected)
    next.add(id)
  else
    next.delete(id)
  selectedIds.value = next
}

const inventoryColumns = computed((): TableColumn<InventoryRow>[] => [
  {
    key: 'select',
    header: 'Select',
    headerHidden: true,
    width: pixel(64),
    renderCell: row => h(CheckboxInput, {
      'label': `Select ${row.name}`,
      'isLabelHidden': true,
      'modelValue': selectedIds.value.has(row.id),
      'onUpdate:modelValue': (v: boolean | 'indeterminate') => selectRow(row.id, v === true),
    }),
  },
  {
    key: 'item',
    header: 'Item',
    width: proportional(3, { minWidth: 80 }),
    renderCell: (row) => {
      const thumbnailSrc = row.imageKey ? images[row.imageKey] : undefined
      return h(HStack, { gap: 3, vAlign: 'center' }, () => [
        h(StackItem, null, () => h(VStack, { width: 40 }, () => thumbnailSrc
          ? h(AspectRatio, { ratio: 1, fit: 'cover' }, () => h('img', { src: thumbnailSrc, alt: '' }))
          : h(Center, { 'width': 40, 'height': 40, 'aria-hidden': 'true' }, () => h(Text, { type: 'supporting', weight: 'bold' }, () => row.thumbnailFallback)))),
        h(StackItem, { size: 'fill' }, () => h(VStack, { gap: 0 }, () => [
          h(Text, { type: 'body', weight: 'bold' }, () => row.name),
          h(Text, { type: 'supporting', color: 'secondary' }, () => row.meta),
        ])),
      ])
    },
  },
  {
    key: 'available',
    header: 'Available',
    width: pixel(100),
    renderCell: row => h(Text, { type: 'body' }, () => String(row.available)),
  },
  {
    key: 'location',
    header: 'Location',
    width: pixel(100),
    renderCell: row => h(Text, { type: 'body' }, () => row.location),
  },
  {
    key: 'tags',
    header: 'Tags',
    width: proportional(2, { minWidth: 80 }),
    align: 'end',
    renderCell: row => h(HStack, { gap: 1, wrap: 'wrap', hAlign: 'end' }, () =>
      row.tags.map(value => h(Badge, { key: value.label, label: value.label, variant: value.variant })),
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    headerHidden: true,
    width: pixel(64),
    align: 'end',
    renderCell: () => h(MoreMenu, {
      label: 'Row actions',
      size: 'sm',
      items: [
        { label: 'Edit', onClick: () => demo('Demo: edit would happen here', 'row-edit') },
        { label: 'Duplicate', onClick: () => demo('Demo: duplicate would happen here', 'row-duplicate') },
        { label: 'Move to…', onClick: () => demo('Demo: moving the item would happen here', 'row-move-to') },
        { type: 'divider' },
        { label: 'Delete', onClick: confirmDelete },
      ],
    }),
  },
])
</script>

<template>
  <ShowcaseShell>
    <template #topNav>
      <TopNav label="Theme preview navigation">
        <template #heading>
          <TopNavHeading heading="Studio" />
        </template>
        <template v-if="!isMobile" #center>
          <TopNavItem label="Shop" href="#" is-selected />
          <TopNavItem label="New In" href="#" />
          <TopNavItem label="Stories" href="#" />
          <TopNavItem label="Help" href="#" />
        </template>
        <template #end>
          <HStack :gap="2" vAlign="center">
            <HStack :gap="0.5">
              <Button label="Search" tooltip="Search" variant="ghost" is-icon-only href="#">
                <template #icon><Icon name="heroicons:magnifying-glass" size="md" /></template>
              </Button>
              <Button label="Account" tooltip="Account" variant="ghost" is-icon-only href="#">
                <template #icon><Icon name="heroicons:user" size="md" /></template>
              </Button>
              <Button label="Cart" tooltip="Cart" variant="ghost" is-icon-only href="#">
                <template #icon><Icon name="heroicons:shopping-bag" size="md" /></template>
              </Button>
            </HStack>
            <Button label="Sign in" variant="primary" @click="openSignIn" />
            <SignInHost />
          </HStack>
        </template>
      </TopNav>
    </template>

    <Layout height="auto" :padding="0">
      <LayoutContent :padding="0" :is-scrollable="false">
        <VStack :gap="0">
          <!-- 门店预览：标题、介绍和三张商品卡。 -->
          <Section :padding="6" variant="transparent">
            <Center>
              <VStack :gap="10" width="100%" :max-width="880">
                <Center>
                  <VStack :gap="4" h-align="center" :max-width="560">
                    <Heading :level="1" :accessibility-level="embedded ? 2 : 1" type="display-2" color="accent" justify="center">
                      <Text type="inherit" display="block">Little joys,</Text>
                      <Text type="inherit" display="block">everywhere you go</Text>
                    </Heading>
                    <Text type="body" color="secondary" justify="center">
                      We believe the smallest details are the ones that matter most.
                      Turn an ordinary day into something worth remembering.
                    </Text>
                  </VStack>
                </Center>
                <Grid :columns="{ minWidth: 200, max: 3 }" :gap="4">
                  <Card v-for="(product, index) in products" :key="product.name" :padding="0" height="100%">
                    <VStack :gap="0" height="100%">
                      <AspectRatio :ratio="1" fit="cover">
                        <img :src="images[PRODUCT_IMAGE_KEYS[index]!]" :alt="product.name">
                      </AspectRatio>
                      <StackItem size="fill">
                        <VStack :padding="4" :gap="2" h-align="center" height="100%">
                          <Badge :label="product.badge" :variant="product.badgeVariant" />
                          <Heading :level="2" justify="center">{{ product.name }}</Heading>
                          <StackItem size="fill">
                            <Text type="supporting" color="secondary" justify="center" display="block">{{ product.description }}</Text>
                          </StackItem>
                          <HStack :gap="2" vAlign="center" h-align="center" wrap="wrap" width="100%">
                            <NumberInput
                              v-model="quantities[product.name]"
                              label="Quantity"
                              is-label-hidden
                              :min="1"
                              :max="99"
                              size="sm"
                              :width="72"
                              @update:model-value="added[product.name] = false"
                            />
                            <Button
                              :label="added[product.name] ? 'Added to cart' : 'Add to cart'"
                              variant="secondary"
                              size="sm"
                              @click="added[product.name] = true"
                            />
                          </HStack>
                        </VStack>
                      </StackItem>
                    </VStack>
                  </Card>
                </Grid>
              </VStack>
            </Center>
          </Section>

          <Section :padding="6" variant="transparent">
            <VStack :gap="8">
              <HStack :gap="4" wrap="wrap">
                <!-- 结账卡 -->
                <StackItem size="fill" class="checkout-column">
                  <Card height="100%" :padding="isMobile ? 4 : 5">
                    <VStack :gap="4">
                      <Heading :level="2">Checkout</Heading>
                      <VStack :gap="3">
                        <TextInput v-model="email" label="Email" placeholder="you@studio.com" size="lg" />
                        <RadioList v-model="shipping" label="Shipping method" description="Delivery time may vary based on location and availability.">
                          <RadioListItem value="economy" label="Economy Shipping" description="Delivered in 5–7 business days">
                            <template #end><Text type="body" weight="bold">$12.00</Text></template>
                          </RadioListItem>
                          <RadioListItem value="standard" label="Standard Shipping" description="Delivered in 3–5 business days">
                            <template #end><Text type="body" weight="bold">$16.00</Text></template>
                          </RadioListItem>
                          <RadioListItem value="express" label="Express Shipping" description="Delivered in 1–2 business days">
                            <template #end><Text type="body" weight="bold">$24.00</Text></template>
                          </RadioListItem>
                        </RadioList>
                        <VStack :gap="2">
                          <Text type="supporting" weight="bold">Payment method</Text>
                          <Grid :columns="isMobile ? { minWidth: 80, max: 1 } : { minWidth: 80, max: 3 }" :gap="2">
                            <SelectableCard label="Pay with card" :is-selected="payment === 'card'" :padding="3" @change="payment = 'card'">
                              <VStack :gap="1" h-align="center">
                                <Icon name="heroicons:credit-card" size="md" />
                                <Text type="supporting" weight="bold" justify="center">Card</Text>
                              </VStack>
                            </SelectableCard>
                            <SelectableCard label="Pay with Apple Pay" :is-selected="payment === 'apple'" :padding="3" @change="payment = 'apple'">
                              <VStack :gap="1" h-align="center">
                                <Icon name="heroicons:device-phone-mobile" size="md" />
                                <Text type="supporting" weight="bold" justify="center">Apple Pay</Text>
                              </VStack>
                            </SelectableCard>
                            <SelectableCard label="Pay with Google Pay" :is-selected="payment === 'google'" :padding="3" @change="payment = 'google'">
                              <VStack :gap="1" h-align="center">
                                <Icon name="heroicons:wallet" size="md" />
                                <Text type="supporting" weight="bold" justify="center">Google Pay</Text>
                              </VStack>
                            </SelectableCard>
                          </Grid>
                        </VStack>
                        <TextInput v-model="cardNumber" label="Card number" placeholder="1234 1234 1234 1234" size="lg" :start-icon="isMobile ? undefined : CreditCardIcon" />
                        <Grid :columns="isMobile ? { minWidth: 90, max: 1 } : { minWidth: 90, max: 2 }" :gap="2">
                          <TextInput v-model="expiry" label="Expiry" placeholder="MM / YY" size="lg" />
                          <TextInput v-model="cvc" label="CVC" placeholder="123" size="lg" />
                        </Grid>
                        <Selector
                          v-model="country"
                          label="Country"
                          size="lg"
                          :options="[
                            { value: 'us', label: 'United States' },
                            { value: 'ca', label: 'Canada' },
                            { value: 'uk', label: 'United Kingdom' },
                            { value: 'de', label: 'Germany' },
                            { value: 'jp', label: 'Japan' },
                            { value: 'au', label: 'Australia' },
                          ]"
                        />
                      </VStack>
                      <CheckboxInput v-model="saveInformation" label="Securely save my information for 1-click checkout" description="Pay faster on Studio and everywhere Link is accepted." />
                      <Banner v-if="showPaymentPreview" status="info" title="Payment preview only" description="No payment is submitted or saved." />
                      <Button variant="primary" size="lg" label="Pay now" @click="showPaymentPreview = true">
                        <template #icon><Icon name="heroicons:lock-closed" size="sm" /></template>
                      </Button>
                    </VStack>
                  </Card>
                </StackItem>

                <!-- 聊天卡 -->
                <StackItem size="fill" class="chat-column">
                  <Card :padding="0" height="100%">
                    <Layout height="fill" :padding="4">
                      <template #header>
                        <LayoutHeader has-divider>
                          <HStack h-align="between" vAlign="center" :gap="3">
                            <Heading :level="2">Studio AI</Heading>
                            <HStack :gap="1" vAlign="center">
                              <Button variant="ghost" size="sm" is-icon-only label="Export conversation" tooltip="Export conversation" @click="demo('Demo: the conversation would export here', 'export-chat')">
                                <template #icon><Icon name="heroicons:arrow-down-tray" size="sm" /></template>
                              </Button>
                              <Button variant="ghost" size="sm" is-icon-only label="Close chat" tooltip="Close chat" @click="demo('Demo: the chat would close here', 'close-chat')">
                                <template #icon><Icon name="heroicons:x-mark" size="sm" /></template>
                              </Button>
                            </HStack>
                          </HStack>
                        </LayoutHeader>
                      </template>
                      <LayoutContent ref="chatContent" class="chat-viewport" :padding="0" label="Studio AI conversation">
                        <ChatMessageList>
                          <ChatSystemMessage>Today</ChatSystemMessage>
                          <ChatMessage sender="user">
                            <ChatMessageBubble variant="filled">Where’s my order?</ChatMessageBubble>
                          </ChatMessage>
                          <ChatMessage sender="assistant">
                            <VStack :gap="3">
                              <Text type="body">
                                Your order #1043 — the Minimalist Watch and Linen Throw — shipped this morning from the Aisle 3 warehouse and is currently in transit with UPS. It’s on track to arrive at your address by end of day tomorrow.
                              </Text>
                              <Text type="body">
                                Let me know if you’d like to reschedule the delivery, redirect it to a pickup point, or start a return once it arrives.
                              </Text>
                            </VStack>
                          </ChatMessage>
                          <ChatMessage sender="user">
                            <ChatMessageBubble variant="filled">Can you show me the full details?</ChatMessageBubble>
                          </ChatMessage>
                          <ChatMessage sender="assistant">
                            <VStack :gap="3">
                              <Text type="body">Here’s everything I have on order #1043:</Text>
                              <Card :padding="3">
                                <VStack :gap="1">
                                  <Item label="Items" description="Minimalist Watch · Linen Throw">
                                    <template #endContent><Text type="body" weight="bold">$248</Text></template>
                                  </Item>
                                  <Item label="Shipping" description="UPS Ground">
                                    <template #endContent><Text type="body" weight="bold">$12</Text></template>
                                  </Item>
                                  <Item label="Estimated arrival" description="Tomorrow by 8pm">
                                    <template #endContent><Badge variant="green" label="On time" /></template>
                                  </Item>
                                  <Item label="Tracking" description="UPS 1Z 999 AA1 0123 4567 84">
                                    <template #endContent><Link href="#">Track</Link></template>
                                  </Item>
                                </VStack>
                              </Card>
                            </VStack>
                          </ChatMessage>
                          <ChatMessage v-for="message in sentMessages" :key="message.id" sender="user">
                            <ChatMessageBubble variant="filled">{{ message.text }}</ChatMessageBubble>
                          </ChatMessage>
                        </ChatMessageList>
                      </LayoutContent>
                      <template #footer>
                        <LayoutFooter>
                          <VStack :gap="2">
                            <HStack :gap="1" h-align="center" wrap="wrap">
                              <Button v-for="question in SUGGESTED_QUESTIONS" :key="question" variant="secondary" size="sm" :label="question" @click="draft = question" />
                            </HStack>
                            <ChatComposer v-model="draft" placeholder="Ask Studio AI…" @submit="submitMessage">
                              <template #footerActions>
                                <Button variant="ghost" size="md" is-icon-only label="Attach" tooltip="Attach" @click="demo('Demo: a file picker would open here', 'attach')">
                                  <template #icon><Icon name="heroicons:plus" size="sm" /></template>
                                </Button>
                              </template>
                              <template #sendActions>
                                <Button variant="ghost" size="md" is-icon-only label="Voice input" tooltip="Voice input" @click="demo('Demo: voice input would start here', 'voice')">
                                  <template #icon><Icon name="heroicons:microphone" size="sm" /></template>
                                </Button>
                              </template>
                            </ChatComposer>
                          </VStack>
                        </LayoutFooter>
                      </template>
                    </Layout>
                  </Card>
                </StackItem>
              </HStack>

              <HStack :gap="isMobile ? 4 : 0" :wrap="isMobile ? 'wrap' : 'nowrap'">
                <!-- 库存卡 -->
                <StackItem size="fill">
                  <Card :padding="0">
                    <VStack :gap="0">
                      <HStack h-align="between" vAlign="center" :padding="6">
                        <Heading :level="2">Inventory</Heading>
                        <Button label="Add item" variant="primary" size="sm" @click="demo('Demo: a new item form would open here', 'add-item')">
                          <template #icon><Icon name="heroicons:plus" size="sm" /></template>
                        </Button>
                      </HStack>
                      <Divider variant="subtle" />
                      <!-- core 的 ScrollableArea 没有 padding 属性，内边距放在里面那层 HStack 上。 -->
                      <ScrollableArea label="Inventory filters" axis="inline">
                        <HStack :gap="3" vAlign="center" h-align="between" :padding-block="4" :padding-inline="6">
                          <HStack :gap="2" vAlign="center">
                            <TextInput v-model="query" label="Search inventory" is-label-hidden placeholder="Type and hit enter…" :start-icon="SearchIcon" :width="240" />
                            <HStack :gap="2" wrap="wrap" vAlign="center">
                              <Selector v-model="category" label="Categories" is-label-hidden placeholder="Categories" size="sm" :start-icon="FolderIcon" has-clear :options="categories" :disabled="categories.length === 0" />
                              <Selector v-model="location" label="Locations" is-label-hidden placeholder="Locations" size="sm" :start-icon="MapPinIcon" has-clear :options="locations" />
                              <Selector v-model="tag" label="Tags" is-label-hidden placeholder="Tags" size="sm" :start-icon="TagIcon" has-clear :options="tagOptions" />
                            </HStack>
                          </HStack>
                          <HStack :gap="1" vAlign="center">
                            <!-- 原版直接放 size=18 的 lucide 图标：高 18px，但在 16px 的图标槽里被 flex 压成 16px 宽。 -->
                            <Button variant="ghost" size="sm" is-icon-only label="List view" tooltip="List view" @click="demo('Demo: the list view would show here', 'list-view')">
                              <template #icon><Icon name="heroicons:list-bullet" class="icon-18" /></template>
                            </Button>
                            <Button variant="ghost" size="sm" is-icon-only label="Grid view" tooltip="Grid view" @click="demo('Demo: the grid view would show here', 'grid-view')">
                              <template #icon><Icon name="heroicons:squares-2x2" class="icon-18" /></template>
                            </Button>
                          </HStack>
                        </HStack>
                      </ScrollableArea>
                      <VStack v-if="lowStockCount > 0" :padding-inline="6" :padding-block-end="4">
                        <Banner status="warning" :title="`${lowStockCount} items are running low`" />
                      </VStack>
                      <VStack :padding-inline="6" :padding-block-end="2">
                        <Table :data="rows" :columns="inventoryColumns" density="spacious" dividers="rows" has-hover />
                        <ConfirmHost />
                      </VStack>
                    </VStack>
                  </Card>
                </StackItem>

                <!-- 营收与动态卡 -->
                <StackItem>
                  <VStack :width="isMobile ? '100%' : 280" :padding-inline-start="isMobile ? 0 : 4" height="100%">
                    <Card height="100%" :padding="5">
                      <VStack :gap="4" height="100%">
                        <Heading :level="2">Revenue</Heading>
                        <Grid :columns="isMobile ? { minWidth: 80, max: 1 } : { minWidth: 80, max: 2 }" :gap="3">
                          <VStack :gap="0">
                            <Text type="large" weight="bold" has-tabular-numbers>18K</Text>
                            <Text type="supporting" color="secondary">Monthly revenue</Text>
                          </VStack>
                          <VStack :gap="0">
                            <Text type="large" weight="bold" has-tabular-numbers>+12%</Text>
                            <Text type="supporting" color="secondary">Order growth</Text>
                          </VStack>
                        </Grid>
                        <Divider variant="subtle" />
                        <HStack h-align="between" vAlign="center">
                          <Heading :level="3">Activity</Heading>
                          <Link href="#">See all</Link>
                        </HStack>
                        <StackItem size="fill">
                          <ScrollableArea label="Recent order activity" height="100%">
                            <VStack :gap="1">
                              <Item v-for="item in ACTIVITY" :key="item.id" :label="item.label" :description="item.detail" href="#">
                                <template #startContent>
                                  <Center :width="32" :height="32">
                                    <Icon :name="item.kind === 'refund' ? 'heroicons:banknotes' : 'heroicons:shopping-bag'" size="sm" color="secondary" />
                                  </Center>
                                </template>
                                <template #endContent>
                                  <Text type="body" weight="bold" :color="item.amount < 0 ? 'secondary' : 'primary'">{{ formatAmount(item.amount) }}</Text>
                                </template>
                              </Item>
                            </VStack>
                          </ScrollableArea>
                        </StackItem>
                      </VStack>
                    </Card>
                  </VStack>
                </StackItem>
              </HStack>
            </VStack>
          </Section>
        </VStack>
      </LayoutContent>
    </Layout>
  </ShowcaseShell>
</template>

<style scoped>
/* 原版 StackItem 没有可换行的 flex-basis，这两列的基准宽度按原版 styles 写在这里。 */
.checkout-column { flex: 1 1 300px; }
.chat-column { flex: 2 1 520px; }
/* LayoutContent 没有高度上限，消息区限制在 720px 内。 */
.chat-viewport { max-height: 720px; }
.icon-18 { width: 16px; height: 18px; max-height: none; }
</style>
