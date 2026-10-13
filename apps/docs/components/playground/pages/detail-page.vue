<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapsible,
  Dialog,
  DialogHeader,
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
import { computed, ref } from 'vue'

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
]

const SUBTOTAL = PRODUCTS.reduce((sum, p) => sum + p.price * p.qty, 0)
const DISCOUNT = 15.0
const TAX = Math.round((SUBTOTAL - DISCOUNT) * 0.0825 * 100) / 100
const TOTAL = SUBTOTAL - DISCOUNT + TAX
const fmt = (n: number) => `$${n.toFixed(2)}`

const ACTIVITY = [
  { type: 'event', user: 'Jane Doe', text: 'placed order #1001', time: 'Feb 23 at 9:12 AM' },
  { type: 'comment', user: 'Alex Rivera', text: 'Customer requested gift wrapping for the mug & plate set.', time: 'Feb 23 at 10:45 AM' },
  { type: 'event', user: 'Alex Rivera', text: 'marked order as ready for fulfillment', time: 'Feb 23 at 2:15 PM' },
]

const activeTab = ref('details')
const isNarrow = useMediaQuery('(max-width: 1024px)')
const showSidePanel = ref(true)
const isPanelDialogOpen = ref(false)

const isPanelShown = computed(() => isNarrow.value ? isPanelDialogOpen.value : showSidePanel.value)

function togglePanel() {
  if (isNarrow.value)
    isPanelDialogOpen.value = !isPanelDialogOpen.value
  else
    showSidePanel.value = !showSidePanel.value
}

</script>

<template>
  <Layout height="fill" :content-width="1000" default-has-dividers>
    <template #header>
      <LayoutHeader has-divider :padding="4" :padding-block-end="0">
        <VStack :gap="3">
          <HStack :gap="4" :align="'start'">
            <StackItem size="fill">
              <VStack :gap="0">
                <Link href="#" color="secondary">
                  <HStack :gap="1" :align="'center'">
                    <Icon icon="i-heroicons-arrow-left" size="sm" color="inherit" />
                    All orders
                  </HStack>
                </Link>
                <Heading :level="1" :max-lines="1">#1001</Heading>
                <HStack :gap="1" :align="'center'" wrap="wrap">
                  <Text type="body" :max-lines="1">{{ PRODUCTS.length }} ordered items</Text>
                  <Text type="supporting" color="secondary">・</Text>
                  <Avatar name="Jane Doe" size="sm" />
                  <Text type="body">Jane Doe</Text>
                  <Text type="supporting" color="secondary">・</Text>
                  <Badge variant="warning" label="Unfulfilled" />
                </HStack>
              </VStack>
            </StackItem>
            <HStack v-if="!isNarrow" :gap="2">
              <Button label="Restock" variant="secondary" />
              <Button label="Edit" variant="secondary" />
            </HStack>
          </HStack>

          <HStack :align="'center'">
            <StackItem size="fill">
              <TabList v-model:value="activeTab" size="lg" is-full-bleed>
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
              :label="isPanelShown ? 'Hide panel' : 'Show panel'"
              variant="ghost"
              size="md"
              is-icon-only
              @click="togglePanel"
            >
              <template #icon><Icon icon="i-heroicons-view-columns" size="sm" /></template>
            </Button>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent role="main">
      <VStack :gap="4">
        <Section>
          <VStack :gap="4">
            <HStack :align="'center'" :gap="2" wrap="wrap">
              <StackItem size="fill">
                <HStack :gap="2" :align="'center'">
                  <Heading :level="2">Items</Heading>
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
                    <Text v-for="(line, j) in product.details.split('\n')" :key="j" type="supporting" color="secondary">{{ line }}</Text>
                  </VStack>
                </template>
                <template #start>
                  <Thumbnail :src="product.image" :alt="product.name" :label="product.name" />
                </template>
                <template #end>
                  <VStack :gap="0" :justify="'end'">
                    <Text type="body" weight="bold">{{ fmt(product.price * product.qty) }}</Text>
                    <Text type="supporting" color="secondary">{{ fmt(product.price) }} × {{ product.qty }}</Text>
                  </VStack>
                </template>
              </ListItem>
            </List>
          </VStack>
        </Section>

        <Section>
          <VStack :gap="3">
            <Heading :level="2">Invoice</Heading>
            <MetadataList>
              <MetadataListItem label="Subtotal">
                {{ fmt(SUBTOTAL) }}
              </MetadataListItem>
              <MetadataListItem label="Discount">
                -{{ fmt(DISCOUNT) }}
              </MetadataListItem>
              <MetadataListItem label="Tax">
                {{ fmt(TAX) }}
              </MetadataListItem>
              <MetadataListItem label="Total">
                {{ fmt(TOTAL) }}
              </MetadataListItem>
            </MetadataList>
          </VStack>
        </Section>

        <Section>
          <VStack :gap="4">
            <Heading :level="2">Timeline</Heading>
            <VStack :gap="3">
              <Card v-for="(item, i) in ACTIVITY" :key="i" variant="muted" :padding="3">
                <Text type="body" weight="bold">{{ item.user }}</Text>
                <Text type="body">{{ item.text }}</Text>
                <Text type="supporting" color="secondary">{{ item.time }}</Text>
              </Card>
            </VStack>
          </VStack>
        </Section>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow && showSidePanel" #end>
      <LayoutPanel :width="320" :padding="4" role="complementary">
        <VStack :gap="4">
          <Heading :level="3">Customer</Heading>
          <Text type="body">Jane Doe</Text>
          <Text type="supporting" color="secondary">jane@example.com</Text>
          <ProgressBar :value="72" :max="100" label="Fulfillment progress" />
          <Collapsible value="notes">
            <template #trigger><Heading :level="4">Notes</Heading></template>
            <Text type="body" color="secondary">Gift wrap requested. Leave at front desk if unavailable.</Text>
          </Collapsible>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>

  <Dialog variant="fullscreen" :is-open="isNarrow && isPanelDialogOpen" @open-change="isPanelDialogOpen = $event">
    <Layout>
      <template #header>
        <DialogHeader title="Order details" @open-change="isPanelDialogOpen = $event" />
      </template>
      <LayoutContent :padding="4">
        <Text type="body">Jane Doe · jane@example.com</Text>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>

<style scoped>
.items-list { margin-inline: -8px; }
</style>
