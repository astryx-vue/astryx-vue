<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import type { ThemeId, ThemeStock } from './themeCatalog'
import { Badge } from '@astryx-vue/core/Badge'
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
import { Heading } from '@astryx-vue/core/Heading'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { proportional, Table } from '@astryx-vue/core/Table'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { useData } from 'vitepress'
import { computed, h, reactive, shallowRef } from 'vue'
import { badgeVariant, themeEntry } from './themeCatalog'

const props = defineProps<{
  theme: ThemeId
}>()

provideAstryxLocale('en')

const { isDark } = useData()
const colorMode = computed(() => props.theme === 'gothic' || isDark.value ? 'dark' : 'light')
const entry = computed(() => themeEntry(props.theme))

const shipping = shallowRef('economy')
const payment = shallowRef('card')
const email = shallowRef('you@studio.com')
const cardNumber = shallowRef('1234 1234 1234 1234')
const expiry = shallowRef('MM / YY')
const cvc = shallowRef('123')
const saveCard = shallowRef(true)
const quantities = reactive<Record<string, number>>({})

const activity = [
  { id: '1043', title: 'Order #1043', meta: 'Placed · 1:59 pm', amount: '+$248', tone: 'up' },
  { id: '1041', title: 'Order #1041', meta: 'Refunded · 12:40 pm', amount: '−$89', tone: 'down' },
  { id: '1040', title: 'Order #1040', meta: 'Placed · 10:30 am', amount: '+$156', tone: 'up' },
  { id: '1038', title: 'Order #1038', meta: 'Placed · 9:11 am', amount: '+$412', tone: 'up' },
  { id: '1037', title: 'Order #1037', meta: 'Placed · 8:42 am', amount: '+$95', tone: 'up' },
] as const

function quantity(name: string): number {
  return quantities[name] ?? 1
}

function setQuantity(name: string, value: number | null) {
  quantities[name] = value ?? 1
}

const columns = computed<TableColumn<ThemeStock>[]>(() => [
  {
    key: 'item',
    header: 'Item',
    width: proportional(2),
    renderCell: row => h('div', { class: 'theme-stage__stock' }, [
      row.image
        ? h('img', { src: row.image, alt: '', class: 'theme-stage__thumb' })
        : h('span', { class: 'theme-stage__thumb theme-stage__thumb--empty' }),
      h('div', [
        h('div', { class: 'theme-stage__stock-name' }, row.item),
        h('div', { class: 'theme-stage__stock-detail' }, `${row.detail} · ${row.location}`),
      ]),
    ]),
  },
  { key: 'available', header: 'Available', width: proportional(1) },
  {
    key: 'tags',
    header: 'Tags',
    width: proportional(1),
    renderCell: row => h(Badge, { variant: badgeVariant(row.tags) }, () => row.tags),
  },
])
</script>

<template>
  <div
    class="theme-stage astryx-demo"
    :data-astryx-theme="theme"
    :data-astryx-color-mode="colorMode"
  >
    <div class="theme-stage__bar">
      <Heading :level="3">
        Studio
      </Heading>
      <HStack :gap="3" align="center" class="theme-stage__nav">
        <Text type="label">
          Shop
        </Text>
        <Text type="label" color="secondary">
          New In
        </Text>
        <Text type="label" color="secondary">
          Stories
        </Text>
        <Text type="label" color="secondary">
          Help
        </Text>
      </HStack>
      <Button label="Sign in" size="sm" />
    </div>

    <VStack :gap="2" align="center" class="theme-stage__hero">
      <Text type="display-2" as="p" display="block">
        Little joys,<br>everywhere you go
      </Text>
      <Text type="supporting" color="secondary" as="p" display="block">
        We believe the smallest details are the ones that matter most. Turn an ordinary day into something worth remembering.
      </Text>
    </VStack>

    <div class="theme-stage__products">
      <Card v-for="product in entry.products" :key="product.name">
        <VStack :gap="3" align="start">
          <img v-if="product.image" class="theme-stage__photo" :src="product.image" :alt="product.name">
          <div v-else class="theme-stage__photo theme-stage__photo--empty" role="img" :aria-label="product.name" />
          <Badge :variant="badgeVariant(product.badge)">
            {{ product.badge }}
          </Badge>
          <Heading :level="3">
            {{ product.name }}
          </Heading>
          <Text type="supporting" color="secondary">
            {{ product.copy }}
          </Text>
          <div class="theme-stage__buy">
            <NumberInput
              class="theme-stage__qty"
              :model-value="quantity(product.name)"
              :min="1"
              size="sm"
              label="Quantity"
              @update:model-value="setQuantity(product.name, $event)"
            />
            <Button label="Add to cart" />
          </div>
        </VStack>
      </Card>
    </div>

    <div class="theme-stage__split">
      <Card>
        <VStack :gap="4">
          <Heading :level="3">
            Checkout
          </Heading>
          <TextInput v-model="email" label="Email" type="email" />
          <RadioList v-model="shipping" label="Shipping method" description="Delivery time may vary based on location and availability.">
            <RadioListItem label="Economy Shipping" description="Delivered in 5–7 business days" value="economy">
              <template #end>
                <Text type="label">
                  $12.00
                </Text>
              </template>
            </RadioListItem>
            <RadioListItem label="Standard Shipping" description="Delivered in 3–5 business days" value="standard">
              <template #end>
                <Text type="label">
                  $16.00
                </Text>
              </template>
            </RadioListItem>
            <RadioListItem label="Express Shipping" description="Delivered in 1–2 business days" value="express">
              <template #end>
                <Text type="label">
                  $24.00
                </Text>
              </template>
            </RadioListItem>
          </RadioList>
          <SegmentedControl v-model="payment" label="Payment method">
            <SegmentedControlItem label="Card" value="card" />
            <SegmentedControlItem label="Apple Pay" value="apple" />
            <SegmentedControlItem label="Google Pay" value="google" />
          </SegmentedControl>
          <TextInput v-model="cardNumber" label="Card number" />
          <div class="theme-stage__card-row">
            <TextInput v-model="expiry" label="Expiry" />
            <TextInput v-model="cvc" label="CVC" />
          </div>
          <Switch
            v-model="saveCard"
            label="Securely save my information for 1-click checkout"
            description="Pay faster on Studio and everywhere Link is accepted."
          />
          <Button label="Pay now" />
        </VStack>
      </Card>

      <Card>
        <VStack :gap="3">
          <HStack justify="between" align="center">
            <Heading :level="3">
              Studio AI
            </Heading>
            <Text type="supporting" color="secondary">
              Today
            </Text>
          </HStack>
          <ChatMessageList>
            <ChatMessage sender="user">
              <ChatMessageBubble>
                Where’s my order?
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="assistant">
              <ChatMessageBubble variant="ghost">
                Your order #1043 — the Minimalist Watch and Linen Throw — shipped this morning from the Aisle 3 warehouse and is currently in transit with UPS. It’s on track to arrive at your address by end of day tomorrow. Let me know if you’d like to reschedule the delivery, redirect it to a pickup point, or start a return once it arrives.
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="user">
              <ChatMessageBubble>
                Can you show me the full details?
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="assistant">
              <ChatMessageBubble variant="ghost">
                Here’s everything I have on order #1043: Minimalist Watch · Linen Throw, $248. Shipping is UPS Ground, $12, estimated tomorrow by 8pm. Tracking UPS 1Z 999 AA1 0123 4567 84.
              </ChatMessageBubble>
            </ChatMessage>
          </ChatMessageList>
          <HStack :gap="2" class="theme-stage__actions">
            <Button label="Reschedule delivery" variant="secondary" size="sm" />
            <Button label="Update shipping address" variant="secondary" size="sm" />
            <Button label="Start a return" variant="secondary" size="sm" />
          </HStack>
        </VStack>
      </Card>
    </div>

    <div class="theme-stage__bottom">
      <Card>
        <VStack :gap="3">
          <HStack justify="between" align="center">
            <Heading :level="3">
              Inventory
            </Heading>
            <Button label="Add item" size="sm" />
          </HStack>
          <Banner status="warning" title="2 items are running low" />
          <div class="theme-stage__table">
            <Table :data="entry.stock" :columns="columns" id-key="id" has-hover />
          </div>
        </VStack>
      </Card>

      <Card>
        <VStack :gap="4">
          <div class="theme-stage__metrics">
            <VStack :gap="1">
              <Heading :level="4">
                Revenue
              </Heading>
              <Text type="display-3">
                18K
              </Text>
              <Text type="supporting" color="secondary">
                Monthly revenue
              </Text>
            </VStack>
            <VStack :gap="1">
              <Text type="display-3">
                +12%
              </Text>
              <Text type="supporting" color="secondary">
                Order growth
              </Text>
            </VStack>
          </div>
          <HStack justify="between" align="center">
            <Heading :level="4">
              Activity
            </Heading>
            <Text type="supporting" color="secondary">
              See all
            </Text>
          </HStack>
          <VStack :gap="3">
            <HStack v-for="item in activity" :key="item.id" justify="between" align="center">
              <VStack :gap="0">
                <Text type="label">
                  {{ item.title }}
                </Text>
                <Text type="supporting" color="secondary">
                  {{ item.meta }}
                </Text>
              </VStack>
              <Text type="label" :class="item.tone === 'down' ? 'is-down' : 'is-up'">
                {{ item.amount }}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.theme-stage {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: var(--astryx-radius-page, 1.5rem);
  background: var(--astryx-color-background-body);
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-body);
}

.theme-stage__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.theme-stage__nav {
  flex: 1;
  justify-content: center;
}

.theme-stage__hero {
  max-width: 36rem;
  margin: 8px auto 4px;
  text-align: center;
}

.theme-stage__hero :deep(.astryx-text) {
  text-wrap: balance;
}

.theme-stage__products,
.theme-stage__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.theme-stage__metrics {
  grid-template-columns: 1fr 1fr;
}

.theme-stage__split,
.theme-stage__bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 12px;
}

.theme-stage__photo {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  margin: 0;
  border-radius: var(--astryx-radius-container, 0.75rem);
  object-fit: cover;
}

.theme-stage__photo--empty {
  background:
    linear-gradient(160deg, var(--astryx-color-accent-muted), transparent 70%),
    var(--astryx-color-background-muted);
}

.theme-stage__buy {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.theme-stage__qty {
  width: 6.5rem;
  flex: none;
}

.theme-stage__buy :deep(.astryx-button) {
  flex: 1 1 8.5rem;
}

.theme-stage__card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.theme-stage__actions {
  flex-wrap: wrap;
}

.theme-stage__table {
  overflow-x: auto;
}

.is-up {
  color: var(--astryx-color-success);
}

.is-down {
  color: var(--astryx-color-error);
}

@media (max-width: 800px) {
  .theme-stage__products,
  .theme-stage__split,
  .theme-stage__bottom,
  .theme-stage__metrics,
  .theme-stage__card-row {
    grid-template-columns: 1fr;
  }

  .theme-stage__nav {
    justify-content: flex-start;
  }
}
</style>

<style>
.theme-stage__stock {
  display: flex;
  gap: 8px;
  align-items: center;
}

.theme-stage__thumb {
  width: 40px;
  height: 40px;
  margin: 0;
  border-radius: 8px;
  object-fit: cover;
  flex: none;
}

.theme-stage__thumb--empty {
  background: var(--astryx-color-background-muted);
}

.theme-stage__stock-name {
  font-weight: 600;
}

.theme-stage__stock-detail {
  color: var(--astryx-color-text-secondary);
  font-size: 0.85em;
}
</style>
