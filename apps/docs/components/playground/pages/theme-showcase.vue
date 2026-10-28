<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
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
  Divider,
  Grid,
  GridSpan,
  Heading,
  HStack,
  Icon,
  Item,
  Link,
  OverflowList,
  MoreMenu,
  NumberInput,
  pixel,
  proportional,
  RadioList,
  RadioListItem,
  Section,
  SelectableCard,
  Selector,
  Table,
  Text,
  TextInput,
  TopNav,
  TopNavHeading,
  TopNavItem,
  useAppShellMobile,
  VStack,
} from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

/* ChatComposer 从 @astryx-vue/core 引入。 */

type ShowcaseBadgeVariant = 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'

interface ProductSpec {
  name: string
  description: string
  badge: string
  badgeVariant: ShowcaseBadgeVariant
}

const FILTER_ITEMS = [
  { id: 'categories', label: 'Categories', icon: 'i-heroicons-folder', options: ['Wearables', 'Audio', 'Bags', 'Drinkware', 'Home'] },
  { id: 'locations', label: 'Locations', icon: 'i-heroicons-map-pin', options: ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5', 'Aisle 6'] },
  { id: 'tags', label: 'Tags', icon: 'i-heroicons-tag', options: ['New', 'Popular', 'Limited', 'Leather', 'Drinkware', 'Home'] },
]

const FILTER_BY_ID: Record<string, (typeof FILTER_ITEMS)[number]> = Object.fromEntries(FILTER_ITEMS.map(item => [item.id, item]))

interface TagSpec { label: string, variant: ShowcaseBadgeVariant }

interface InventoryRow extends Record<string, unknown> {
  id: string
  name: string
  meta: string
  available: number
  location: string
  tags: TagSpec[]
  imageKey?: string
  thumbnailFallback: string
  selected: boolean
}

const PRODUCT_IMAGE_KEYS = ['watch', 'headphones', 'backpack']

const images: Record<string, string> = {
  watch: '/template-assets/Neutral-Watch.png',
  headphones: '/template-assets/Neutral-Headphones.png',
  backpack: '/template-assets/Neutral-Backpack.png',
  wallet: '/template-assets/Neutral-Wallet.png',
  tumbler: '/template-assets/Neutral-Tumbler.png',
  throw_: '/template-assets/Neutral-Blanket.png',
}

const products: ProductSpec[] = [
  { name: 'Minimalist Watch', description: 'Clean design meets everyday durability.', badge: 'New', badgeVariant: 'blue' },
  { name: 'Wireless Headphones', description: 'Immersive sound, all-day comfort.', badge: 'Popular', badgeVariant: 'green' },
  { name: 'Canvas Backpack', description: 'Water-resistant canvas with a quiet, modern profile.', badge: 'Limited', badgeVariant: 'yellow' },
]

const inventory = ref<InventoryRow[]>([
  { id: 'a', name: 'Minimalist Watch', meta: 'Stainless steel, sapphire crystal', available: 42, location: 'Aisle 3', tags: [{ label: 'New', variant: 'blue' }], imageKey: 'watch', thumbnailFallback: 'M', selected: false },
  { id: 'b', name: 'Wireless Headphones', meta: 'ANC, 30hr battery', available: 128, location: 'Aisle 1', tags: [{ label: 'Popular', variant: 'green' }], imageKey: 'headphones', thumbnailFallback: 'W', selected: true },
  { id: 'c', name: 'Canvas Backpack', meta: 'Water-resistant, 25L', available: 63, location: 'Aisle 2', tags: [{ label: 'Limited', variant: 'yellow' }], imageKey: 'backpack', thumbnailFallback: 'C', selected: false },
  { id: 'd', name: 'Leather Wallet', meta: 'Full-grain, RFID blocking', available: 15, location: 'Aisle 4', tags: [{ label: 'Leather', variant: 'yellow' }], imageKey: 'wallet', thumbnailFallback: 'L', selected: true },
  { id: 'e', name: 'Travel Tumbler', meta: 'Vacuum insulated, 16oz', available: 87, location: 'Aisle 5', tags: [{ label: 'Drinkware', variant: 'green' }], imageKey: 'tumbler', thumbnailFallback: 'T', selected: false },
  { id: 'f', name: 'Linen Throw', meta: 'Heavyweight, oat', available: 24, location: 'Aisle 6', tags: [{ label: 'Home', variant: 'orange' }], imageKey: 'throw_', thumbnailFallback: 'L', selected: true },
])

const SUGGESTED_QUESTIONS = ['Reschedule delivery', 'Update shipping address', 'Start a return']

const ACTIVITY = [
  { id: '1', label: 'Order #1043', detail: 'Placed · 1:59 pm', amount: 248 },
  { id: '2', label: 'Order #1041', detail: 'Refunded · 12:40 pm', amount: -89 },
  { id: '3', label: 'Order #1040', detail: 'Placed · 10:30 am', amount: 156 },
  { id: '4', label: 'Order #1038', detail: 'Placed · 9:11 am', amount: 412 },
  { id: '5', label: 'Order #1037', detail: 'Placed · 8:42 am', amount: 95 },
]

const ActivityIcons: Record<string, string> = { '1': 'heroicons:shopping-bag', '2': 'heroicons:banknotes', '3': 'heroicons:shopping-bag', '4': 'heroicons:shopping-bag', '5': 'heroicons:shopping-bag' }
const SearchIcon = () => h(Icon, { name: 'heroicons:magnifying-glass', size: 'sm' })
const CreditCardIcon = () => h(Icon, { name: 'heroicons:credit-card', size: 'sm' })

const { isMobile } = useAppShellMobile()
const gridColumns = computed(() => (isMobile ? 1 : { minWidth: 200, repeat: 'fit' as const }))
const productColumns = computed(() => (isMobile ? 1 : { minWidth: 200, max: 3 }))

const shippingMethod = ref('economy')
const email = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')
const country = ref('us')
const saveInfo = ref(true)
const quantity = ref(1)
const chatDraft = ref('')
const search = ref('')
const paymentCard = ref(true)
const paymentApple = ref(false)
const paymentGoogle = ref(false)

const lowStockCount = computed(() => inventory.value.filter(row => row.available < 25).length)

function formatAmount(amount: number) {
  const sign = amount < 0 ? '−' : '+'
  return `${sign}$${Math.abs(amount).toLocaleString()}`
}

function selectPayment(which: 'card' | 'apple' | 'google') {
  paymentCard.value = which === 'card'
  paymentApple.value = which === 'apple'
  paymentGoogle.value = which === 'google'
}

const inventoryColumns = computed((): TableColumn<InventoryRow>[] => [
  {
    key: 'select',
    header: 'Select',
    headerHidden: true,
    width: pixel(64),
    renderCell: row => h(CheckboxInput, {
      label: 'Select ' + row.name,
      isLabelHidden: true,
      modelValue: row.selected,
      'onUpdate:modelValue': (v: boolean | 'indeterminate') => { row.selected = v === true },
    }),
  },
  {
    key: 'item',
    header: 'Item',
    width: proportional(3, { minWidth: 80 }),
    renderCell: (row) => {
      const thumb = row.imageKey && images[row.imageKey]
        ? h('img', { src: images[row.imageKey!], alt: '', class: 'thumbnail' })
        : h('div', { class: 'thumbnail-fallback', 'aria-hidden': 'true' }, row.thumbnailFallback)
      return h(HStack, { gap: 3, vAlign: 'center' }, () => [
        thumb,
        h(VStack, { gap: 0, style: { minWidth: 0 } }, () => [
          h(Text, { type: 'body', weight: 'bold' }, () => row.name),
          h(Text, { type: 'supporting', color: 'secondary' }, () => row.meta),
        ]),
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
      row.tags.map(tag => h(Badge, { key: tag.label, label: tag.label, variant: tag.variant })),
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
      items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Move to…' }, { type: 'divider' }, { label: 'Delete' }],
    }),
  },
])
</script>

<template>
  <div class="page-root">
    <div data-theme-preview="true">
      <VStack :gap="0">
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
            <HStack :gap="2" :align="'center'">
              <HStack :gap="0.5">
                <Button label="Search" tooltip="Search" variant="ghost" is-icon-only href="#">
                  <template #icon><span class="i-carbon-search" aria-hidden="true" /></template>
                </Button>
                <Button label="Account" tooltip="Account" variant="ghost" is-icon-only href="#">
                  <template #icon><span class="i-carbon-user" aria-hidden="true" /></template>
                </Button>
                <Button label="Cart" tooltip="Cart" variant="ghost" is-icon-only href="#">
                  <template #icon><span class="i-carbon-shopping-bag" aria-hidden="true" /></template>
                </Button>
              </HStack>
              <Button label="Sign in" variant="primary" href="#" />
            </HStack>
          </template>
        </TopNav>

        <Section :padding="6" variant="transparent">
          <VStack :gap="10" class="content content-fluid">
            <Center>
              <VStack :gap="4" :justify="'center'" class="hero-text">
                <Text type="display-2" color="accent">
                  Little joys,<br>everywhere you go
                </Text>
                <Text type="body" color="secondary">
                  We believe the smallest details are the ones that matter most.
                  Turn an ordinary day into something worth remembering.
                </Text>
              </VStack>
            </Center>
            <Grid :columns="productColumns" :gap="4">
              <Card v-for="(p, i) in products" :key="p.name" :padding="0" height="100%">
                <VStack :gap="0" class="card-stack">
                  <AspectRatio :ratio="1">
                    <img class="product-image" :src="images[PRODUCT_IMAGE_KEYS[i]]" :alt="p.name">
                  </AspectRatio>
                  <div class="card-body">
                    <VStack :gap="2" :justify="'center'" class="card-stack">
                      <HStack><Badge :label="p.badge" :variant="p.badgeVariant" /></HStack>
                      <Heading :level="2" class="center-text">{{ p.name }}</Heading>
                      <Text type="supporting" color="secondary" class="card-description center-text">{{ p.description }}</Text>
                      <HStack :gap="2" :align="'center'" :justify="'center'" wrap="wrap" class="cart-row">
                        <span class="quantity-field">
                          <NumberInput v-model="quantity" label="Quantity" is-label-hidden :min="1" :max="99" size="sm" />
                        </span>
                        <Button label="Add to cart" variant="secondary" size="sm" href="#" class="cart-button" />
                      </HStack>
                    </VStack>
                  </div>
                </VStack>
              </Card>
            </Grid>
          </VStack>
        </Section>
      </VStack>
    </div>

    <div class="showcase-surface">
      <VStack :gap="8">
        <HStack :gap="4" wrap="wrap">
          <div class="checkout-column">
            <Card :padding="isMobile ? 4 : 5" class="card-surface">
              <VStack :gap="4" class="checkout-stack">
                <Heading :level="2">Checkout</Heading>
                <VStack :gap="3" class="checkout-stack">
                  <TextInput v-model="email" label="Email" placeholder="you@studio.com" size="lg" />
                  <RadioList v-model="shippingMethod" label="Shipping method" description="Delivery time may vary based on location and availability.">
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
                  <VStack :gap="2" class="checkout-stack">
                    <Text type="supporting" weight="bold">Payment method</Text>
                    <Grid :columns="isMobile ? 1 : { minWidth: 80, max: 3 }" :gap="2">
                      <SelectableCard :is-selected="paymentCard" label="Pay with card" :padding="3" @change="selectPayment('card')">
                        <VStack :gap="1" :justify="'center'" class="payment-card-content">
                          <Icon name="heroicons:credit-card" size="md" />
                          <Text type="supporting" weight="bold">Card</Text>
                        </VStack>
                      </SelectableCard>
                      <SelectableCard :is-selected="paymentApple" label="Pay with Apple Pay" :padding="3" @change="selectPayment('apple')">
                        <VStack :gap="1" :justify="'center'" class="payment-card-content">
                          <Icon name="heroicons:device-phone-mobile" size="md" />
                          <Text type="supporting" weight="bold">Apple Pay</Text>
                        </VStack>
                      </SelectableCard>
                      <SelectableCard :is-selected="paymentGoogle" label="Pay with Google Pay" :padding="3" @change="selectPayment('google')">
                        <VStack :gap="1" :justify="'center'" class="payment-card-content">
                          <Icon name="heroicons:wallet" size="md" />
                          <Text type="supporting" weight="bold">Google Pay</Text>
                        </VStack>
                      </SelectableCard>
                    </Grid>
                  </VStack>
                  <TextInput v-model="cardNumber" label="Card number" placeholder="1234 1234 1234 1234" size="lg" :start-icon="isMobile ? undefined : CreditCardIcon" />
                  <Grid :columns="isMobile ? 1 : { minWidth: 90, max: 2 }" :gap="2">
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
                <CheckboxInput v-model="saveInfo" label="Securely save my information for 1-click checkout" description="Pay faster on Studio and everywhere Link is accepted." />
                <Button variant="primary" size="lg" label="Pay now">
                  <template #icon><span class="i-carbon-locked" aria-hidden="true" /></template>
                </Button>
              </VStack>
            </Card>
          </div>
          <div class="chat-column">
            <Card :padding="0" class="chat-card">
              <HStack :justify="'between'" :align="'center'" :gap="3" class="chat-header">
                <Heading :level="2">Studio AI</Heading>
                <HStack :gap="1" :align="'center'">
                  <Button variant="ghost" size="sm" is-icon-only label="Export conversation" tooltip="Export conversation">
                    <template #icon><span class="i-carbon-download" aria-hidden="true" /></template>
                  </Button>
                  <Button variant="ghost" size="sm" is-icon-only label="Close chat" tooltip="Close chat">
                    <template #icon><span class="i-carbon-close" aria-hidden="true" /></template>
                  </Button>
                </HStack>
              </HStack>
              <Divider variant="subtle" />
              <div class="chat-body">
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
                            <template #endContent>
                              <Text type="body" weight="bold">$248</Text>
                            </template>
                          </Item>
                          <Item label="Shipping" description="UPS Ground">
                            <template #endContent>
                              <Text type="body" weight="bold">$12</Text>
                            </template>
                          </Item>
                          <Item label="Estimated arrival" description="Tomorrow by 8pm">
                            <template #endContent>
                              <Badge variant="green" label="On time" />
                            </template>
                          </Item>
                          <Item label="Tracking" description="UPS 1Z 999 AA1 0123 4567 84">
                            <template #endContent>
                              <Link href="#">Track →</Link>
                            </template>
                          </Item>
                        </VStack>
                      </Card>
                    </VStack>
                  </ChatMessage>
                </ChatMessageList>
              </div>
              <div class="chat-suggestions">
                <HStack :gap="1" :justify="'center'" wrap="wrap">
                  <Button v-for="question in SUGGESTED_QUESTIONS" :key="question" variant="secondary" size="sm" :label="question" />
                </HStack>
              </div>
              <div class="chat-composer">
                <!-- 原版用 ChatComposer：左下附件、右下麦克风，发送按钮是组件自带的。 -->
                <ChatComposer v-model="chatDraft" placeholder="Ask Studio AI…">
                  <template #footerActions>
                    <Button variant="ghost" size="md" is-icon-only label="Attach" tooltip="Attach">
                      <template #icon>
                        <Icon name="heroicons:plus" />
                      </template>
                    </Button>
                  </template>
                  <template #sendActions>
                    <Button variant="ghost" size="md" is-icon-only label="Voice input" tooltip="Voice input">
                      <template #icon>
                        <Icon name="carbon:microphone" />
                      </template>
                    </Button>
                  </template>
                </ChatComposer>
              </div>
            </Card>
          </div>
        </HStack>

        <Grid :columns="gridColumns" :gap="4">
          <GridSpan :columns="isMobile ? 1 : 3">
            <Card :padding="0" class="inventory-card">
              <HStack :justify="'between'" :align="'center'" class="inventory-header">
                <Heading :level="2">Inventory</Heading>
                <Button label="Add item" variant="primary" size="sm">
                  <template #icon><span class="i-carbon-add" aria-hidden="true" /></template>
                </Button>
              </HStack>
              <Divider variant="subtle" />
              <HStack :gap="3" :align="'center'" :justify="'between'" class="inventory-filter-row">
                <HStack :gap="2" :align="'center'" class="inventory-filter-left">
                  <TextInput v-model="search" label="Search inventory" is-label-hidden placeholder="Type and hit enter…" :start-icon="SearchIcon" />
                  <OverflowList :items="FILTER_ITEMS" :gap="2">
                    <template #item="{ item }">
                      <Selector
                        :label="item.label"
                        is-label-hidden
                        :placeholder="item.label"
                        size="sm"
                        :start-icon="FILTER_BY_ID[item.id ?? ''].icon"
                        :model-value="null"
                        :options="FILTER_BY_ID[item.id ?? ''].options"
                      />
                    </template>
                    <template #overflow>
                      <Button label="Filters" variant="ghost" size="sm">
                        <template #icon><Icon name="heroicons:tag" size="sm" /></template>
                      </Button>
                    </template>
                  </OverflowList>
                </HStack>
                <HStack :gap="1" :align="'center'">
                  <Button variant="ghost" size="sm" is-icon-only label="List view" tooltip="List view">
                    <template #icon><Icon name="heroicons:list-bullet" size="md" /></template>
                  </Button>
                  <Button variant="ghost" size="sm" is-icon-only label="Grid view" tooltip="Grid view">
                    <template #icon><Icon name="heroicons:squares-2x2" size="md" /></template>
                  </Button>
                </HStack>
              </HStack>
              <div v-if="lowStockCount > 0" class="inventory-banner-wrap">
                <Banner status="warning" :title="`${lowStockCount} items are running low`" />
              </div>
              <div class="inventory-table-wrap">
                <Table :data="inventory" :columns="inventoryColumns" density="spacious" dividers="rows" has-hover />
              </div>
            </Card>
          </GridSpan>
          <GridSpan :columns="1">
            <Card :padding="5" class="activity-card">
              <VStack :gap="4" class="activity-card-stack">
                <Heading :level="2">Revenue</Heading>
                <Grid :columns="isMobile ? 1 : 2" :gap="3">
                  <VStack :gap="0"><span class="kpi-value">18K</span><Text type="supporting" color="secondary">Monthly revenue</Text></VStack>
                  <VStack :gap="0"><span class="kpi-value">+12%</span><Text type="supporting" color="secondary">Order growth</Text></VStack>
                </Grid>
                <Divider variant="subtle" />
                <HStack :justify="'between'" :align="'center'">
                  <Heading :level="3">Activity</Heading>
                  <Link href="#">See all</Link>
                </HStack>
                <VStack :gap="1" class="activity-list-fade">
                  <Item v-for="item in ACTIVITY" :key="item.id" :label="item.label" :description="item.detail" href="#">
                    <template #startContent>
                      <div class="activity-icon" aria-hidden="true"><Icon :name="ActivityIcons[item.id]" size="sm" /></div>
                    </template>
                    <template #endContent>
                      <Text type="body" weight="bold" :color="item.amount < 0 ? 'secondary' : 'primary'">{{ formatAmount(item.amount) }}</Text>
                    </template>
                  </Item>
                </VStack>
              </VStack>
            </Card>
          </GridSpan>
        </Grid>
      </VStack>
    </div>
  </div>
</template>

<style scoped>
.page-root { min-height: 100%; background: var(--astryx-color-background-body); }
.showcase-surface { padding: var(--astryx-spacing-6); background: var(--astryx-color-background-surface); }
.content { max-width: 960px; margin-inline: auto; min-width: 0; }
.content-fluid { max-width: 880px; }
.hero-text { text-align: center; max-width: 560px; }
.center-text { text-align: center; }
.card-stack { height: 100%; }
.card-description { flex: 1; }
.cart-row { width: 100%; min-width: 0; }
.quantity-field { display: block; flex: none; width: 72px; }
.cart-button { flex: 1 1 auto; min-width: 0; }
.card-surface { background: var(--astryx-color-background-body); color: var(--astryx-color-text-primary); min-width: 0; border-color: transparent; }
.checkout-stack { min-width: 0; width: 100%; }
.payment-card-content { min-width: 0; width: 100%; text-align: center; word-break: break-word; }
.inventory-card { background: var(--astryx-color-background-surface); overflow: hidden; }
.inventory-header { padding-block: var(--astryx-spacing-6); padding-inline: var(--astryx-spacing-6); }
.inventory-filter-row { padding-block: var(--astryx-spacing-4); padding-inline: var(--astryx-spacing-6); width: 100%; overflow-x: auto; }
.inventory-filter-left { flex: 1; min-width: 0; }
.activity-icon { width: 32px; height: 32px; border-radius: var(--astryx-radius-full); background: var(--astryx-color-background-muted); color: var(--astryx-color-text-secondary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.inventory-banner-wrap { padding-inline: var(--astryx-spacing-6); padding-bottom: var(--astryx-spacing-4); }
/* 原版 Table 默认 `table-layout: fixed`，列宽严格按声明的比例分；core 目前是 auto，列宽按内容算。 */
.inventory-table-wrap :deep(.astryx-table) { table-layout: fixed; }
.inventory-table-wrap { padding-inline: var(--astryx-spacing-6); padding-block-end: var(--astryx-spacing-2); }
.chat-card { background: var(--astryx-color-background-surface); min-width: 0; overflow: hidden; display: flex; flex-direction: column; }
.chat-header { padding: var(--astryx-spacing-4); }
.chat-body { flex: 1; min-height: 0; overflow: hidden; }
.chat-suggestions { padding-inline: var(--astryx-spacing-4); padding-bottom: var(--astryx-spacing-2); }
.chat-composer { padding-inline: var(--astryx-spacing-4); padding-bottom: var(--astryx-spacing-4); }
.activity-card { background: var(--astryx-color-background-surface); min-width: 0; height: 100%; }
.activity-card-stack { height: 100%; }
.activity-list-fade { flex: 1; min-height: 0; overflow: hidden; mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent); margin-inline: calc(var(--astryx-spacing-2) * -1); }
.checkout-column { flex: 1 1 300px; min-width: 0; display: grid; }
.chat-column { flex: 2 1 520px; min-width: 0; display: grid; }
.product-image { width: 100%; height: 100%; object-fit: cover; }
.card-body { padding: var(--astryx-spacing-4); flex: 1; display: flex; flex-direction: column; }
.kpi-value { font-size: 24px; font-weight: 700; line-height: 1.1; color: var(--astryx-color-text-primary); font-family: var(--astryx-font-family-heading); }
:deep(.thumbnail) { width: 40px; height: 40px; border-radius: var(--astryx-radius-element); object-fit: cover; display: block; flex-shrink: 0; }
:deep(.thumbnail-fallback) { width: 40px; height: 40px; border-radius: var(--astryx-radius-element); background: var(--astryx-color-background-muted); color: var(--astryx-color-text-secondary); display: flex; align-items: center; justify-content: center; font-size: var(--astryx-font-size-sm); font-weight: 600; flex-shrink: 0; }
</style>
