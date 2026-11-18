<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapsible,
  Divider,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  Link,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  ProgressBar,
  Section,
  StackItem,
  Tab,
  TabList,
  TabMenu,
  Text,
  Thumbnail,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { defineComponent, h, ref } from 'vue'

const PRODUCT_IMAGES = [
  '/template-assets/light-product-1.png',
  '/template-assets/light-product-2.png',
  '/template-assets/light-product-3.png',
  '/template-assets/light-product-4.png',
  '/template-assets/light-product-5.png',
]

const PRODUCTS = [
  { name: 'Solstice Mug', details: 'Glaze: Snow\nFinish: Matte', price: 89.0, qty: 1, image: PRODUCT_IMAGES[0] },
  { name: 'Ember Bowl', details: 'Glaze: Sage\nSize: 6 in', price: 42.0, qty: 2, image: PRODUCT_IMAGES[1] },
  { name: 'Terra Cup', details: 'Glaze: Oat\nSize: 14 in', price: 65.0, qty: 1, image: PRODUCT_IMAGES[2] },
  { name: 'Dawn Plate Set', details: 'Glaze: Charcoal\nCapacity: 3 oz', price: 34.0, qty: 3, image: PRODUCT_IMAGES[3] },
  { name: 'Kiln Salad Bowl', details: 'Glaze: Snow\nHeight: 8 in', price: 78.0, qty: 1, image: PRODUCT_IMAGES[4] },
]

const SUBTOTAL = PRODUCTS.reduce((sum, p) => sum + p.price * p.qty, 0)
const DISCOUNT = 15.0
const SHIPPING = 0
const TAX = Math.round((SUBTOTAL - DISCOUNT) * 0.0825 * 100) / 100
const TOTAL = SUBTOTAL - DISCOUNT + SHIPPING + TAX
const fmt = (n: number) => `$${n.toFixed(2)}`

interface ActivityItem {
  type: 'event' | 'comment' | 'update'
  user: string
  text: string
  time: string
  reactions?: number
  changes?: string[]
}

const ACTIVITY: ActivityItem[] = [
  { type: 'event' as const, user: 'Jane Doe', text: 'placed order #1001', reactions: 2, time: 'Feb 23 at 9:12 AM' },
  { type: 'comment' as const, user: 'Alex Rivera', text: 'Customer requested gift wrapping for the mug & plate set. I\'ve added a note to the packing slip — warehouse team should wrap in recycled kraft paper.', reactions: 3, time: 'Feb 23 at 10:45 AM' },
  {
    type: 'update' as const,
    user: 'System',
    text: 'has several information changes',
    time: 'Feb 23 at 11:30 AM',
    changes: ['Payment verified via Visa ...7482', 'Fraud check passed — low risk'],
  },
  { type: 'event' as const, user: 'Alex Rivera', text: 'marked order as ready for fulfillment', reactions: 1, time: 'Feb 23 at 2:15 PM' },
]

const activeTab = ref('details')
// 窄屏时订单详情接在主栏后面；宽屏时放进右侧可隐藏的固定宽度面板。
const isNarrow = useMediaQuery('(max-width: 1024px)')
const showSidePanel = ref(true)

/** 订单详情的三段折叠内容。窄屏放在「Order details」标题下，各段标题再降一级。 */
const PanelContent = defineComponent({
  props: { sectionLevel: { type: Number as () => 2 | 3, default: 2 } },
  setup(props) {
    const trigger = (title: string) => () => h(Heading, { level: 4, accessibilityLevel: props.sectionLevel }, () => title)
    return () => h(VStack, { gap: 4 }, () => [
      h(Collapsible, null, {
        trigger: trigger('Notes'),
        default: () => h(Text, { type: 'body' }, () => [
          'Customer is a repeat buyer — 3rd order this quarter. Prefers snow and oat glazes. Requested gift wrapping for the mug set. Ships to a residential address in CA. ',
          h(Link, { href: '#', color: 'secondary' }, () => 'Show more'),
        ]),
      }),
      h(Collapsible, null, {
        trigger: trigger('Customer'),
        default: () => h(MetadataList, null, () => [
          ['Name', 'Jane Doe'],
          ['Address', '321 Smith Road, CA 38238'],
          ['Phone', '234-'],
          ['Email', 'janedoe@email.com'],
          ['Billing Address', 'Same as shipping address'],
        ].map(([label, value]) => h(MetadataListItem, { label }, () => value))),
      }),
      h(Collapsible, null, {
        trigger: trigger('Fraud Analysis'),
        default: () => h(VStack, { gap: 1 }, () => [
          h(ProgressBar, { label: 'Risk level', value: 15, variant: 'success', isLabelHidden: true }),
          h(Text, { type: 'body' }, () => 'Recommendation: Fulfill order'),
          h(Text, { type: 'body' }, () => 'There is a low chance that you will receive a chargeback on this order.'),
        ]),
      }),
    ])
  },
})
</script>

<template>
  <Layout height="fill" :content-width="1000" default-has-dividers>
    <template #header>
      <LayoutHeader has-divider :padding="4" :padding-block-end="0">
        <VStack :gap="3">
          <HStack :gap="4" align="start">
            <StackItem size="fill">
              <VStack :gap="0">
                <Link href="#" color="secondary">
                  <HStack :gap="1" align="center">
                    <Icon name="heroicons:arrow-left" size="sm" color="inherit" />
                    All orders
                  </HStack>
                </Link>
                <VStack :gap="0">
                  <Heading :level="1" :max-lines="1">
                    #1001
                  </Heading>
                  <HStack :gap="1" align="center" wrap="wrap">
                    <Text type="body" :max-lines="1">
                      {{ PRODUCTS.length }} ordered items
                    </Text>
                    <HStack :gap="1" align="center">
                      <Text type="supporting" color="secondary">
                        ・
                      </Text>
                      <Avatar name="Jane Doe" size="sm" />
                      <Text type="body" :max-lines="1">
                        Jane Doe
                      </Text>
                    </HStack>
                    <HStack :gap="1" align="center">
                      <Text type="supporting" color="secondary">
                        ・
                      </Text>
                      <Badge variant="warning" label="Unfulfilled" />
                    </HStack>
                    <HStack :gap="1" align="center">
                      <Text type="supporting" color="secondary">
                        ・
                      </Text>
                      <Icon name="heroicons:calendar" size="sm" color="secondary" />
                      <Text type="body" :max-lines="1">
                        02/23/2026
                      </Text>
                    </HStack>
                    <HStack :gap="1" align="center">
                      <Text type="supporting" color="secondary">
                        ・
                      </Text>
                      <Icon name="heroicons:flag" size="sm" color="secondary" />
                      <Text type="body" :max-lines="1">
                        Needs attention
                      </Text>
                    </HStack>
                    <HStack :gap="1" align="center">
                      <Text type="supporting" color="secondary">
                        ・
                      </Text>
                      <Link href="#" color="secondary">
                        See all
                      </Link>
                    </HStack>
                  </HStack>
                </VStack>
              </VStack>
            </StackItem>
            <HStack v-if="!isNarrow" :gap="2">
              <Button label="Restock" variant="secondary" />
              <Button label="Edit" variant="secondary" />
            </HStack>
          </HStack>

          <HStack v-if="isNarrow" :gap="2">
            <StackItem size="fill">
              <VStack h-align="stretch">
                <Button label="Restock" variant="secondary" />
              </VStack>
            </StackItem>
            <StackItem size="fill">
              <VStack h-align="stretch">
                <Button label="Edit" variant="secondary" />
              </VStack>
            </StackItem>
          </HStack>

          <HStack align="center">
            <StackItem size="fill">
              <TabList role="tablist" v-model:value="activeTab" size="lg" is-full-bleed>
                <Tab value="details">
                  Details
                </Tab>
                <Tab value="invoices">
                  Invoices
                </Tab>
                <Tab value="timeline">
                  Timeline
                </Tab>
                <TabMenu
                  label="More"
                  :options="[
                    { value: 'customer', label: 'Customer' },
                    { value: 'analysis', label: 'Analysis' },
                  ]"
                />
              </TabList>
            </StackItem>
            <Button
              v-if="!isNarrow"
              :label="showSidePanel ? 'Hide panel' : 'Show panel'"
              variant="ghost"
              size="md"
              is-icon-only
              @click="showSidePanel = !showSidePanel"
            >
              <template #icon>
                <Icon name="heroicons:view-columns" size="sm" />
              </template>
            </Button>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent role="main">
      <VStack :gap="4">
        <Section>
          <VStack :gap="4">
            <HStack align="center" :gap="2" wrap="wrap">
              <StackItem size="fill">
                <HStack :gap="2" align="center">
                  <Heading :level="2">
                    Items
                  </Heading>
                  <Badge variant="warning" label="Unfulfilled" />
                </HStack>
              </StackItem>
              <HStack :gap="2">
                <Button label="Fulfill item" variant="ghost" />
                <Button label="Create label" variant="secondary" />
              </HStack>
            </HStack>
            <List density="spacious" class="items-list">
              <ListItem
                v-for="(product, i) in PRODUCTS"
                :key="i"
                :label="product.name"
                @click="() => {}"
              >
                <template #description>
                  <VStack :gap="0">
                    <Text v-for="(line, j) in product.details.split('\n')" :key="j" type="supporting" color="secondary">
                      {{ line }}
                    </Text>
                  </VStack>
                </template>
                <template #startContent>
                  <Thumbnail :src="product.image" :alt="product.name" :label="product.name" />
                </template>
                <template #endContent>
                  <VStack :gap="0" h-align="end">
                    <Text type="body" weight="bold" :max-lines="1">
                      {{ fmt(product.price * product.qty) }}
                    </Text>
                    <Text type="supporting" color="secondary" :max-lines="1">
                      {{ fmt(product.price) }} × {{ product.qty }}
                    </Text>
                  </VStack>
                </template>
              </ListItem>
            </List>
          </VStack>
        </Section>

        <Section>
          <VStack :gap="4">
            <HStack align="center" :gap="2" wrap="wrap">
              <StackItem size="fill">
                <HStack :gap="2" align="center">
                  <Heading :level="2">
                    Invoice
                  </Heading>
                  <Badge variant="success" label="Paid" />
                </HStack>
              </StackItem>
              <HStack :gap="2">
                <Button label="Refund" variant="ghost" />
                <Button label="Send Invoice" variant="secondary" />
              </HStack>
            </HStack>
            <MetadataList>
              <MetadataListItem label="Subtotal">
                <HStack>
                  <StackItem size="fill">
                    <Text type="body">
                      {{ PRODUCTS.length }} items
                    </Text>
                  </StackItem>
                  <Text type="body">
                    {{ fmt(SUBTOTAL) }}
                  </Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Discount">
                <HStack>
                  <StackItem size="fill">
                    <Text type="body">
                      New customer code: NEW15
                    </Text>
                  </StackItem>
                  <Text type="body">
                    – {{ fmt(DISCOUNT) }}
                  </Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Shipping">
                <HStack>
                  <StackItem size="fill">
                    <Text type="body">
                      Free shipping (0.0lbs) USPS
                    </Text>
                  </StackItem>
                  <Text type="body">
                    {{ fmt(SHIPPING) }}
                  </Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Tax">
                <HStack>
                  <StackItem size="fill">
                    <Text type="body">
                      Sales tax (8.25%)
                    </Text>
                  </StackItem>
                  <Text type="body">
                    {{ fmt(TAX) }}
                  </Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Total">
                <HStack>
                  <StackItem size="fill" />
                  <Text type="body" weight="bold">
                    {{ fmt(TOTAL) }}
                  </Text>
                </HStack>
              </MetadataListItem>
            </MetadataList>
            <Divider />
            <MetadataList>
              <MetadataListItem label="Paid by customer">
                <HStack>
                  <StackItem size="fill">
                    <Text type="body">
                      Visa ...7482
                    </Text>
                  </StackItem>
                  <Text type="body">
                    {{ fmt(TOTAL) }}
                  </Text>
                </HStack>
              </MetadataListItem>
            </MetadataList>
          </VStack>
        </Section>

        <Section>
          <VStack :gap="4">
            <HStack align="center">
              <StackItem size="fill">
                <Heading :level="2">
                  Timeline
                </Heading>
              </StackItem>
              <Button label="Filters" variant="ghost" is-icon-only>
                <template #icon>
                  <Icon name="heroicons:funnel" />
                </template>
              </Button>
            </HStack>
            <VStack :gap="4">
              <VStack v-for="(item, i) in ACTIVITY" :key="i" :gap="2">
                <HStack :gap="3" align="start">
                  <Avatar :name="item.user" size="md" />
                  <StackItem size="fill">
                    <VStack :gap="2">
                      <Card variant="muted" :padding="3">
                        <VStack :gap="1">
                          <Text type="body" weight="bold">
                            {{ item.user }}
                          </Text>
                          <Text type="body">
                            {{ item.text }}
                          </Text>
                          <VStack v-if="item.changes" :gap="1">
                            <HStack v-for="(change, j) in item.changes" :key="j" :gap="2" align="center">
                              <Icon name="heroicons:pencil-square" size="sm" color="secondary" />
                              <Text type="supporting" color="secondary">
                                {{ change }}
                              </Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </Card>
                      <HStack :gap="3" vAlign="center">
                        <HStack :gap="1" align="center">
                          <Icon name="heroicons:hand-thumb-up" size="xsm" color="secondary" />
                          <Icon name="heroicons:heart" size="xsm" color="secondary" />
                          <Text type="supporting" color="secondary">
                            {{ item.reactions }}
                          </Text>
                        </HStack>
                        <Text type="supporting" color="secondary">
                          Like
                        </Text>
                        <Text type="supporting" color="secondary">
                          ・
                        </Text>
                        <Text type="supporting" color="secondary">
                          Reply
                        </Text>
                        <Text type="supporting" color="secondary">
                          ・
                        </Text>
                        <Text type="supporting" color="secondary">
                          {{ item.time }}
                        </Text>
                      </HStack>
                    </VStack>
                  </StackItem>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </Section>
        <!-- 窄屏：订单详情接在主栏后面，不挤在旁边。 -->
        <VStack v-if="isNarrow" :gap="4">
          <Heading :level="2">
            Order details
          </Heading>
          <PanelContent :section-level="3" />
        </VStack>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow && showSidePanel" #end>
      <LayoutPanel :width="320" :padding="4" role="complementary">
        <PanelContent />
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.items-list { margin-inline: -8px; }
</style>
