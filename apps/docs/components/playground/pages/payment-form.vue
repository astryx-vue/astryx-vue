<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import {
  Badge,
  Banner,
  Button,
  Card,
  Center,
  CheckboxInput,
  Collapsible,
  Divider,
  Grid,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Link,
  NumberInput,
  RadioList,
  RadioListItem,
  Section,
  Selector,
  Stack,
  StackItem,
  Text,
  TextArea,
  TextInput,
  Thumbnail,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];
const YEARS = Array.from({length: 12}, (_, i) => String(2025 + i));

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

// Product photos from the local template-assets set (committed to the
// docsite; the CLI swaps these for an inline placeholder on scaffold).
const ITEM_IMAGES: Record<string, {src: string}> = {
  '1': {
    src: '/template-assets/light-product-1.png',
  },
  '2': {
    src: '/template-assets/light-product-4.png',
  },
  '3': {
    src: '/template-assets/light-product-5.png',
  },
};

const ORDER_ITEMS = [
  {
    id: '1',
    name: 'Speckled Stoneware Mug',
    variant: 'Hand-thrown · 12 oz',
    price: 78,
    qty: 1,
    limited: false,
  },
  {
    id: '2',
    name: 'Stoneware Dinner Plate',
    variant: 'Reactive glaze · 10 in',
    price: 72,
    qty: 1,
    limited: false,
  },
  {
    id: '3',
    name: 'Cereal Bowl',
    variant: 'Speckled clay · 6 in',
    price: 80,
    qty: 1,
    limited: true,
  },
];

const SUBTOTAL = 230;
// SHIPPING is now computed from deliveryMethod state
const TAX = 18.4;
// TOTAL is computed dynamically based on delivery selection
const fmt = (n: number) => `$${n.toFixed(2)}`;

// ── Styles ────────────────────────────────────────────────────────────────────
// Plain inline styles using Astryx design-token CSS variables (declared at
// :root by `@astryxdesign/core/astryx.css`). No StyleX compiler required.

const fullWidth: CSSProperties = {width: '100%'};
// Form column flex-basis so the two checkout columns share width evenly.
const formColBasis: CSSProperties = {flexBasis: 0};
// Space the Order Summary content below its collapsible trigger title.
const summaryContent: CSSProperties = {paddingBlockStart: 'var(--spacing-2)'};
// Order-summary column: sticky beside the form on desktop.
const summarySticky: CSSProperties = {
  flexBasis: 0,
  position: 'sticky',
  top: 'var(--spacing-4)',
  alignSelf: 'flex-start',
};
// On mobile the summary moves above the form.
const summaryMobileOrder: CSSProperties = {order: -1};
// Express-checkout brand buttons (fixed brand colors).
const paypalButton: CSSProperties = {
  backgroundColor: '#FFC439',
  borderColor: '#FFC439',
};
// Official Google Pay dark button: black background with the unaltered
// dark-variant mark (white "Google Pay" text + full-color G), per the
// Google Pay brand guidelines.
const gpayButton: CSSProperties = {
  backgroundColor: '#000',
  borderColor: '#000',
};
// Brand logos inside the express-checkout buttons.
const brandLogo: CSSProperties = {height: 'var(--spacing-5)', width: 'auto'};
// Accepted card-network marks (Visa/Mastercard/Amex), shared style.
const cardLogo: CSSProperties = {
  height: 'var(--spacing-7)',
  width: 'auto',
  borderRadius: 'var(--radius-element)',
  borderWidth: 'var(--border-width)',
  borderStyle: 'solid',
  borderColor: 'var(--color-border)',
  backgroundColor: 'var(--color-background-surface)',
};



const isMobile = useMediaQuery('(max-width: 767px)')
const firstName = ref('')
const lastName = ref('')
const address = ref('')
const city = ref('')
const zip = ref('')
const state = ref('')
const phone = ref('')
const saveInfo = ref(false)
const email = ref('')
const emailOffers = ref(false)
const deliveryMethod = ref('standard')
const paymentMethod = ref('card')
const cardNumber = ref('')
const expiry = ref('')
const expYear = ref('')
const billingMatchesShipping = ref(true)
const billingAddress = ref('')
const billingCity = ref('')
const billingZip = ref('')
const billingState = ref('')
const addGiftMessage = ref(false)
const giftTo = ref('')
const giftFrom = ref('')
const giftMessage = ref('')
const cvc = ref('')
const cardName = ref('')
const promo = ref('')
const quantities = ref<Record<string, number>>({ '1': 1, '2': 1, '3': 1 })
const submitted = ref(false)

const shippingCost = computed(() => deliveryMethod.value === 'expedited' ? 9.95 : 4.95)
const orderTotal = computed(() => SUBTOTAL + shippingCost.value + TAX)

const errors = computed(() => submitted.value ? {
  firstName: !firstName.value.trim() ? 'Required' : undefined,
  lastName: !lastName.value.trim() ? 'Required' : undefined,
  address: !address.value.trim() ? 'Required' : undefined,
  city: !city.value.trim() ? 'Required' : undefined,
  zip: !zip.value.trim() ? 'Required' : undefined,
  state: !state.value ? 'Required' : undefined,
  email: !email.value.trim() ? 'Required' : undefined,
  phone: !phone.value.trim() ? 'Required' : undefined,
  expiry: !expiry.value ? 'Required' : undefined,
  expYear: !expYear.value ? 'Required' : undefined,
  cvc: !cvc.value.trim() ? 'Required' : undefined,
  cardNumber: paymentMethod.value === 'card' && !cardNumber.value.trim() ? 'Required' : undefined,
  cardName: paymentMethod.value === 'card' && !cardName.value.trim() ? 'Required' : undefined,
  billingAddress: !billingMatchesShipping.value && !billingAddress.value.trim() ? 'Required' : undefined,
  billingCity: !billingMatchesShipping.value && !billingCity.value.trim() ? 'Required' : undefined,
  billingZip: !billingMatchesShipping.value && !billingZip.value.trim() ? 'Required' : undefined,
  billingState: !billingMatchesShipping.value && !billingState.value ? 'Required' : undefined,
} : {})
</script>

<template>
  <Layout height="fill">
    <template #default>
      <LayoutContent :padding="0">
        <Center axis="horizontal">
          <Section variant="transparent" :max-width="1100" width="100%" :padding="6">
            <VStack :gap="5">
              <VStack :gap="6">
                <VStack :gap="2">
                  <Text type="display-1" as="h1">Payment Request</Text>
                  <Text type="body" color="secondary">Review your order and complete your purchase. All transactions are secured with 256-bit SSL encryption.</Text>
                </VStack>
                <Divider />
              </VStack>
              <Stack :direction="isMobile ? 'vertical' : 'horizontal'" :gap="8" v-align="start">
                <StackItem size="fill" :style="isMobile ? undefined : formColBasis">
                  <VStack :gap="8">
                    <VStack :gap="3">
                      <Text type="large" weight="bold">Contact Information</Text>
                      <TextInput v-model="email" size="lg" label="Email" placeholder="you@example.com" :status="errors.email ? { type: 'error', message: errors.email } : undefined" />
                      <CheckboxInput v-model="emailOffers" label="Email me with news and offers" />
                    </VStack>
                    <VStack :gap="3">
                      <Text type="large" weight="bold">Shipping Information</Text>
                      <Grid :columns="2" :gap="3">
                        <TextInput v-model="firstName" size="lg" label="First Name" placeholder="John" :status="errors.firstName ? { type: 'error', message: errors.firstName } : undefined" />
                        <TextInput v-model="lastName" size="lg" label="Last Name" placeholder="Doe" :status="errors.lastName ? { type: 'error', message: errors.lastName } : undefined" />
                      </Grid>
                      <TextInput v-model="address" size="lg" label="Address" placeholder="123 Main Street" :status="errors.address ? { type: 'error', message: errors.address } : undefined" />
                      <Grid :columns="2" :gap="3">
                        <TextInput v-model="city" size="lg" label="City" placeholder="New York" :status="errors.city ? { type: 'error', message: errors.city } : undefined" />
                        <TextInput v-model="zip" size="lg" label="ZIP Code" placeholder="10001" :status="errors.zip ? { type: 'error', message: errors.zip } : undefined" />
                      </Grid>
                      <Selector v-model="state" size="lg" label="State" placeholder="Select state" :options="US_STATES" :status="errors.state ? { type: 'error', message: errors.state } : undefined" />
                      <TextInput v-model="phone" size="lg" label="Phone Number" placeholder="+1 (555) 123-4567" :status="errors.phone ? { type: 'error', message: errors.phone } : undefined" />
                      <CheckboxInput v-model="saveInfo" label="Save my information for a faster checkout" />
                    </VStack>
                    <VStack :gap="3">
                      <Text type="large" weight="bold">Delivery</Text>
                      <RadioList v-model="deliveryMethod" label="Delivery method">
                        <RadioListItem value="standard" label="Standard (3–7 business days)">
                          <template #end-content><Text type="body" weight="medium">$4.95</Text></template>
                        </RadioListItem>
                        <RadioListItem value="expedited" label="Expedited (1–2 business days)">
                          <template #end-content><Text type="body" weight="medium">$9.95</Text></template>
                        </RadioListItem>
                      </RadioList>
                    </VStack>
                    <VStack :gap="3">
                      <Text type="large" weight="bold">Payment Method</Text>
                      <TextInput v-model="cardNumber" size="lg" label="Card Number" placeholder="1234 5678 9012 3456" :status="errors.cardNumber ? { type: 'error', message: errors.cardNumber } : undefined" />
                      <Grid :columns="3" :gap="3">
                        <Selector v-model="expiry" size="lg" label="Expiry Month" placeholder="MM" :options="MONTHS" :status="errors.expiry ? { type: 'error', message: errors.expiry } : undefined" />
                        <Selector v-model="expYear" size="lg" label="Expiry Year" placeholder="YY" :options="YEARS" :status="errors.expYear ? { type: 'error', message: errors.expYear } : undefined" />
                        <TextInput v-model="cvc" size="lg" label="CVC" placeholder="123" :status="errors.cvc ? { type: 'error', message: errors.cvc } : undefined" />
                      </Grid>
                      <TextInput v-model="cardName" size="lg" label="Name on Card" placeholder="John Doe" :status="errors.cardName ? { type: 'error', message: errors.cardName } : undefined" />
                      <CheckboxInput v-model="billingMatchesShipping" label="Use shipping address as billing address" />
                    </VStack>
                    <Button label="Place Order" variant="primary" size="lg" :style="fullWidth" @click="submitted = true" />
                  </VStack>
                </StackItem>
                <StackItem size="fill" :style="isMobile ? summaryMobileOrder : summarySticky">
                  <Card :padding="5">
                    <Collapsible trigger="Order Summary" :default-is-open="true">
                      <VStack :gap="4" :style="summaryContent">
                        <VStack v-for="item in ORDER_ITEMS" :key="item.id" :gap="3">
                          <HStack :gap="3" v-align="start">
                            <Thumbnail :src="ITEM_IMAGES[item.id].src" :alt="item.name" />
                            <StackItem size="fill">
                              <VStack :gap="1">
                                <HStack :gap="2" h-align="between" v-align="start">
                                  <HStack :gap="2" v-align="center">
                                    <Text type="body" weight="medium">{{ item.name }}</Text>
                                    <Badge v-if="item.limited" variant="green" label="LIMITED EDITION" />
                                  </HStack>
                                  <Text type="body" weight="bold">{{ fmt(item.price) }}</Text>
                                </HStack>
                                <Text type="supporting" color="secondary">{{ item.variant }}</Text>
                                <NumberInput v-model="quantities[item.id]" label="Qty" is-label-hidden :min="1" :max="10" is-integer-only />
                              </VStack>
                            </StackItem>
                          </HStack>
                          <Divider />
                        </VStack>
                        <HStack h-align="between"><Text color="secondary">Subtotal</Text><Text>{{ fmt(SUBTOTAL) }}</Text></HStack>
                        <HStack h-align="between"><Text color="secondary">Shipping</Text><Text>{{ fmt(shippingCost) }}</Text></HStack>
                        <HStack h-align="between"><Text color="secondary">Tax</Text><Text>{{ fmt(TAX) }}</Text></HStack>
                        <Divider />
                        <HStack h-align="between"><Text type="large" weight="bold">Total</Text><Text type="large" weight="bold">{{ fmt(orderTotal) }}</Text></HStack>
                        <Banner status="info" title="Free shipping on orders over $300">
                          <template #icon><Icon icon="i-heroicons-truck" size="sm" /></template>
                        </Banner>
                      </VStack>
                    </Collapsible>
                  </Card>
                </StackItem>
              </Stack>
            </VStack>
          </Section>
        </Center>
      </LayoutContent>
    </template>
  </Layout>
</template>
