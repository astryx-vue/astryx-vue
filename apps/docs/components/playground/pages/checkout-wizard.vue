<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import {
  Badge,
  Banner,
  Button,
  Card,
  CheckboxInput,
  Collapsible,
  Divider,
  FieldStatus,
  FormLayout,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  NumberInput,
  RadioList,
  RadioListItem,
  Selector,
  Stack,
  StackItem,
  Step,
  Stepper,
  Text,
  TextArea,
  TextInput,
  Thumbnail,
  VStack,
} from '@astryx-vue/core'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

// ── 数据 ──────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Cart', icon: 'i-carbon-shopping-cart' },
  { label: 'Shipping', icon: 'i-carbon-location' },
  { label: 'Delivery', icon: 'i-carbon-delivery-truck' },
  { label: 'Payment', icon: 'i-carbon-purchase' },
]

const CART_ITEMS = [
  { id: 'mug', name: 'Speckled Stoneware Mug', variant: 'Hand-thrown · 12 oz', price: 78, qty: 2, src: '/template-assets/light-product-1.png', isLimited: false },
  { id: 'plate', name: 'Stoneware Dinner Plate', variant: 'Reactive glaze · 10 in', price: 72, qty: 1, src: '/template-assets/light-product-4.png', isLimited: false },
  { id: 'bowl', name: 'Cereal Bowl', variant: 'Speckled clay · 6 in', price: 80, qty: 1, src: '/template-assets/light-product-5.png', isLimited: true },
]

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
]

const US_STATES = ['California', 'Illinois', 'Massachusetts', 'New York', 'Oregon', 'Texas', 'Washington']

const DELIVERY_OPTIONS = [
  { value: 'standard', label: 'Standard', window: '3–7 business days', price: 4.95 },
  { value: 'expedited', label: 'Expedited', window: '1–2 business days', price: 9.95 },
  { value: 'overnight', label: 'Overnight', window: 'Next business day by 5pm', price: 24.95 },
]

const PROMOS: Record<string, { label: string, rate: number }> = {
  WELCOME10: { label: 'WELCOME10 · 10% off', rate: 0.1 },
  CLAY20: { label: 'CLAY20 · 20% off', rate: 0.2 },
}

const TAX_RATE = 0.08
const FREE_SHIPPING_THRESHOLD = 300
const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]{2,}$/

const POSTAL_CODE_RULES: Record<string, { label: string, placeholder: string, pattern: RegExp, error: string }> = {
  us: { label: 'ZIP code', placeholder: '10001', pattern: /^\d{5}(?:-\d{4})?$/, error: 'Enter a 5-digit ZIP code, with an optional 4-digit suffix.' },
  ca: { label: 'Postal code', placeholder: 'K1A 0B1', pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i, error: 'Enter a Canadian postal code, for example K1A 0B1.' },
  uk: { label: 'Postcode', placeholder: 'SW1A 1AA', pattern: /^(?:GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/i, error: 'Enter a UK postcode, for example SW1A 1AA.' },
}

function money(n: number) {
  return `$${n.toFixed(2)}`
}

// ── 状态 ──────────────────────────────────────────────────────────────────────

const NARROW_HOST_WIDTH = 900
const hostRef = ref<ComponentPublicInstance | null>(null)
const isNarrow = ref(false)
let hostObserver: ResizeObserver | undefined

// 窄版按预览容器的宽度判断，而不是浏览器窗口宽度：嵌在窄预览里的页面窗口再宽也要走窄版。
watch(hostRef, (instance) => {
  hostObserver?.disconnect()
  const host = instance?.$el as HTMLElement | undefined
  if (!host)
    return
  if (host.clientWidth > 0)
    isNarrow.value = host.clientWidth <= NARROW_HOST_WIDTH
  hostObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width ?? host.clientWidth
    if (width > 0)
      isNarrow.value = width <= NARROW_HOST_WIDTH
  })
  hostObserver.observe(host)
})
onBeforeUnmount(() => hostObserver?.disconnect())

const step = ref(0)
const attempted = ref<ReadonlySet<number>>(new Set())
const isComplete = ref(false)

const quantities = ref<Record<string, number>>(Object.fromEntries(CART_ITEMS.map(item => [item.id, item.qty])))
const promoInput = ref('')
const promoWasChecked = ref(false)
const appliedPromo = ref<string | null>(null)

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const address = ref('')
const apartment = ref('')
const city = ref('')
const state = ref('')
const postalCode = ref('')
const country = ref('us')

const delivery = ref('standard')
const deliveryNote = ref('')
const isGift = ref(false)

const cardNumber = ref('')
const cardName = ref('')
const expiry = ref('')
const cvc = ref('')
const billingMatches = ref(true)

const items = computed(() =>
  CART_ITEMS
    .map(item => ({ ...item, qty: quantities.value[item.id] ?? item.qty }))
    .filter(item => item.qty > 0),
)

const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.price * item.qty, 0))
const promo = computed(() => (appliedPromo.value ? PROMOS[appliedPromo.value] : undefined))
const discount = computed(() => (promo.value ? subtotal.value * promo.value.rate : 0))
const deliveryOption = computed(() => DELIVERY_OPTIONS.find(o => o.value === delivery.value) ?? DELIVERY_OPTIONS[0])
const shipping = computed(() =>
  subtotal.value - discount.value >= FREE_SHIPPING_THRESHOLD && delivery.value === 'standard'
    ? 0
    : deliveryOption.value.price,
)
const tax = computed(() => (subtotal.value - discount.value) * TAX_RATE)
const total = computed(() => subtotal.value - discount.value + shipping.value + tax.value)
const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))

const postalRule = computed(() => POSTAL_CODE_RULES[country.value] ?? POSTAL_CODE_RULES.us)

const errorsByStep = computed<Array<Record<string, string>>>(() => {
  const cart: Record<string, string> = {}
  if (items.value.length === 0)
    cart.items = 'Your cart is empty.'

  const shippingStep: Record<string, string> = {}
  if (!EMAIL_PATTERN.test(email.value))
    shippingStep.email = 'Enter an email address for order updates.'
  if (!firstName.value.trim())
    shippingStep.firstName = 'Required'
  if (!lastName.value.trim())
    shippingStep.lastName = 'Required'
  if (!address.value.trim())
    shippingStep.address = 'Required'
  if (!city.value.trim())
    shippingStep.city = 'Required'
  if (country.value === 'us' && !state.value)
    shippingStep.state = 'Required'
  if (!postalRule.value.pattern.test(postalCode.value.trim()))
    shippingStep.postalCode = postalRule.value.error

  const deliveryStep: Record<string, string> = {}
  if (delivery.value === 'overnight' && country.value !== 'us')
    deliveryStep.delivery = 'Overnight delivery is only available in the US.'

  const payment: Record<string, string> = {}
  if (cardNumber.value.replace(/\s/g, '').length < 15)
    payment.cardNumber = 'Enter the full card number.'
  if (!cardName.value.trim())
    payment.cardName = 'Enter the name printed on the card.'
  if (!/^\d{2}\s?\/\s?\d{2}$/.test(expiry.value.trim()))
    payment.expiry = 'Use MM/YY.'
  if (!/^\d{3,4}$/.test(cvc.value.trim()))
    payment.cvc = '3 or 4 digits.'

  return [cart, shippingStep, deliveryStep, payment]
})

function shownErrors(index: number): Record<string, string> {
  return attempted.value.has(index) ? errorsByStep.value[index] : {}
}

const currentErrors = computed(() => shownErrors(step.value))
const isLastStep = computed(() => step.value === STEPS.length - 1)

function markAttempted(indices: number[]) {
  const next = new Set(attempted.value)
  for (const index of indices) next.add(index)
  attempted.value = next
}

function goNext() {
  markAttempted([step.value])
  if (Object.keys(errorsByStep.value[step.value]).length > 0)
    return
  if (isLastStep.value) {
    isComplete.value = true
    return
  }
  step.value += 1
}

/** 往前跳时先检查中间的步骤，遇到第一个有问题的就停在那里。 */
function goTo(index: number) {
  if (index <= step.value) {
    step.value = index
    return
  }
  const checked: number[] = []
  let firstInvalid: number | null = null
  for (let candidate = step.value; candidate < index; candidate += 1) {
    checked.push(candidate)
    if (Object.keys(errorsByStep.value[candidate]).length > 0) {
      firstInvalid = candidate
      break
    }
  }
  markAttempted(checked)
  step.value = firstInvalid ?? index
}

function onPromoInput(value: string) {
  promoInput.value = value
  promoWasChecked.value = false
  appliedPromo.value = null
}

function applyPromo() {
  const code = promoInput.value.trim().toUpperCase()
  promoWasChecked.value = code.length > 0
  appliedPromo.value = PROMOS[code] ? code : null
}

const promoStatus = computed<{ type: 'success' | 'warning', message: string } | undefined>(() => {
  if (appliedPromo.value)
    return { type: 'success', message: `${PROMOS[appliedPromo.value].label} applied.` }
  if (promoInput.value.trim() && promoWasChecked.value)
    return { type: 'warning', message: 'That promo code is not valid.' }
  if (promoInput.value.trim())
    return { type: 'warning', message: 'Press Apply to check this code.' }
  return undefined
})

function blockedMessage(count: number) {
  return count === 1 ? 'One problem above needs fixing first.' : `${count} problems above need fixing first.`
}

function setQuantity(id: string, value: number | null) {
  quantities.value = { ...quantities.value, [id]: value ?? 0 }
}

function isFreeDelivery(optionValue: string) {
  return optionValue === 'standard' && subtotal.value - discount.value >= FREE_SHIPPING_THRESHOLD
}
</script>

<template>
  <Layout height="fill" :padding="6" :content-width="1000">
    <LayoutContent>
      <VStack ref="hostRef" :gap="6">
        <HStack :gap="3" align="center">
          <StackItem size="fill">
            <Heading :level="1">
              Checkout
            </Heading>
          </StackItem>
          <HStack :gap="1.5" align="center">
            <Icon icon="i-carbon-locked" size="sm" color="secondary" />
            <Text type="supporting" color="secondary">
              Secure checkout
            </Text>
          </HStack>
        </HStack>

        <Stack v-align="start" :direction="isNarrow ? 'vertical' : 'horizontal'" :gap="6">
          <StackItem size="fill">
            <VStack :gap="6">
              <Banner
                v-if="isComplete"
                status="success"
                title="Order confirmed"
                :description="`This local example completed an order for ${money(total)}. No payment was sent.`"
              />
              <VStack v-if="isComplete" :gap="4">
                <Heading :level="2">
                  Thanks for your order
                </Heading>
                <Text type="body" color="secondary">
                  The completion is stored in this page's component state so the template ends in a real, reviewable outcome.
                </Text>
              </VStack>

              <Stepper
                v-if="!isComplete"
                :active-step="step"
                orientation="horizontal"
                density="balanced"
                label="Checkout progress"
                @step-click="goTo"
              >
                <Step
                  v-for="({ label, icon }, i) in STEPS"
                  :key="label"
                  :step="i"
                  :label="label"
                  :status="Object.keys(shownErrors(i)).length ? 'error' : undefined"
                >
                  <template #icon>
                    <Icon :icon="Object.keys(shownErrors(i)).length ? 'error' : icon" size="sm" />
                  </template>
                </Step>
              </Stepper>

              <VStack v-if="!isComplete && step === 0" :gap="5">
                <Heading :level="2">
                  Review your cart
                </Heading>
                <VStack :gap="4">
                  <VStack v-for="item in items" :key="item.id" :gap="3">
                    <HStack :gap="4" align="start" wrap="wrap">
                      <Thumbnail :src="item.src" :alt="item.name" />
                      <StackItem size="fill">
                        <VStack :gap="1">
                          <HStack :gap="2" align="start" justify="between">
                            <HStack :gap="2" align="center" wrap="wrap">
                              <Text type="body" weight="medium">
                                {{ item.name }}
                              </Text>
                              <Badge v-if="item.isLimited" variant="green" label="Limited" />
                            </HStack>
                            <Text type="body" weight="bold">
                              {{ money(item.price * item.qty) }}
                            </Text>
                          </HStack>
                          <Text type="supporting" color="secondary">
                            {{ item.variant }} · {{ money(item.price) }} each
                          </Text>
                          <HStack :gap="2" align="center">
                            <span class="quantity-field">
                              <NumberInput
                                :model-value="item.qty"
                                :label="`Quantity of ${item.name}`"
                                is-label-hidden
                                :min="0"
                                :max="10"
                                is-integer-only
                                has-number-steppers
                                @update:model-value="setQuantity(item.id, $event)"
                              />
                            </span>
                            <Button label="Remove" variant="ghost" @click="setQuantity(item.id, 0)" />
                          </HStack>
                        </VStack>
                      </StackItem>
                    </HStack>
                    <Divider />
                  </VStack>
                </VStack>
                <FieldStatus
                  v-if="currentErrors.items"
                  type="error"
                  variant="detached"
                  :message="currentErrors.items"
                />
                <HStack :gap="2" align="end">
                  <StackItem size="fill">
                    <TextInput
                      :model-value="promoInput"
                      label="Promo code"
                      placeholder="WELCOME10"
                      :status="promoStatus"
                      @update:model-value="onPromoInput($event)"
                    />
                  </StackItem>
                  <Button label="Apply" variant="secondary" @click="applyPromo" />
                </HStack>
              </VStack>

              <VStack v-if="!isComplete && step === 1" :gap="5">
                <VStack :gap="1">
                  <Heading :level="2">
                    Where should it go?
                  </Heading>
                  <Text type="supporting" color="secondary">
                    Delivery options and tax are calculated from this address.
                  </Text>
                </VStack>
                <FormLayout default-optionality="required">
                  <TextInput
                    v-model="email"
                    label="Email"
                    placeholder="you@example.com"
                    description="Order confirmation and tracking go here."
                    :status="currentErrors.email ? { type: 'error', message: currentErrors.email } : undefined"
                  />
                  <FormLayout :direction="isNarrow ? 'vertical' : 'horizontal'" default-optionality="required">
                    <TextInput
                      v-model="firstName"
                      label="First name"
                      :status="currentErrors.firstName ? { type: 'error', message: currentErrors.firstName } : undefined"
                    />
                    <TextInput
                      v-model="lastName"
                      label="Last name"
                      :status="currentErrors.lastName ? { type: 'error', message: currentErrors.lastName } : undefined"
                    />
                  </FormLayout>
                  <Selector v-model="country" label="Country" :options="COUNTRIES" />
                  <TextInput
                    v-model="address"
                    label="Street address"
                    placeholder="123 Main Street"
                    :status="currentErrors.address ? { type: 'error', message: currentErrors.address } : undefined"
                  />
                  <TextInput v-model="apartment" label="Apartment, suite, etc." is-optional />
                  <FormLayout :direction="isNarrow ? 'vertical' : 'horizontal'" default-optionality="required">
                    <TextInput
                      v-model="city"
                      label="City"
                      :status="currentErrors.city ? { type: 'error', message: currentErrors.city } : undefined"
                    />
                    <Selector
                      v-if="country === 'us'"
                      v-model="state"
                      label="State"
                      placeholder="Select state"
                      :options="US_STATES"
                      searchable
                      :status="currentErrors.state ? 'error' : undefined"
                      :status-message="currentErrors.state"
                    />
                    <TextInput
                      v-model="postalCode"
                      :label="postalRule.label"
                      :placeholder="postalRule.placeholder"
                      :status="currentErrors.postalCode ? { type: 'error', message: currentErrors.postalCode } : undefined"
                    />
                  </FormLayout>
                </FormLayout>
              </VStack>

              <VStack v-if="!isComplete && step === 2" :gap="5">
                <VStack :gap="1">
                  <Heading :level="2">
                    How fast do you need it?
                  </Heading>
                  <Text type="supporting" color="secondary">
                    Estimates run from the day the order ships, usually 1–3 business days after you place it.
                  </Text>
                </VStack>
                <FormLayout default-optionality="required">
                  <RadioList
                    v-model="delivery"
                    label="Delivery method"
                    :status="currentErrors.delivery ? { type: 'error', message: currentErrors.delivery } : undefined"
                  >
                    <RadioListItem
                      v-for="option in DELIVERY_OPTIONS"
                      :key="option.value"
                      :value="option.value"
                      :label="option.label"
                      :description="option.window"
                    >
                      <template #end>
                        <Text type="body" weight="medium">
                          {{ isFreeDelivery(option.value) ? 'Free' : money(option.price) }}
                        </Text>
                      </template>
                    </RadioListItem>
                  </RadioList>
                  <Divider />
                  <CheckboxInput v-model="isGift" label="This is a gift" />
                  <TextArea
                    v-model="deliveryNote"
                    :label="isGift ? 'Gift message' : 'Delivery instructions'"
                    is-optional
                    :rows="3"
                    :max-length="240"
                    :placeholder="isGift ? 'Happy birthday — hope these get plenty of use.' : 'Leave with the neighbour at number 14.'"
                    :description="isGift ? 'Printed on a card. Prices are left off the packing slip.' : 'Passed to the carrier where they support it.'"
                  />
                </FormLayout>
              </VStack>

              <VStack v-if="!isComplete && step === 3" :gap="5">
                <VStack :gap="1">
                  <Heading :level="2">
                    Payment
                  </Heading>
                  <Text type="supporting" color="secondary">
                    This template validates payment details and completes locally. No card is charged.
                  </Text>
                </VStack>
                <FormLayout default-optionality="required">
                  <TextInput
                    v-model="cardNumber"
                    label="Card number"
                    placeholder="4242 4242 4242 4242"
                    :status="currentErrors.cardNumber ? { type: 'error', message: currentErrors.cardNumber } : undefined"
                  />
                  <TextInput
                    v-model="cardName"
                    label="Name on card"
                    :status="currentErrors.cardName ? { type: 'error', message: currentErrors.cardName } : undefined"
                  />
                  <HStack :gap="4" wrap="wrap">
                    <TextInput
                      v-model="expiry"
                      label="Expiry"
                      :width="140"
                      placeholder="MM/YY"
                      :status="currentErrors.expiry ? { type: 'error', message: currentErrors.expiry } : undefined"
                    />
                    <TextInput
                      v-model="cvc"
                      label="CVC"
                      :width="140"
                      placeholder="123"
                      label-tooltip="Three digits on the back of the card, or four on the front for American Express."
                      :status="currentErrors.cvc ? { type: 'error', message: currentErrors.cvc } : undefined"
                    />
                  </HStack>
                  <Divider />
                  <CheckboxInput v-model="billingMatches" label="Billing address matches the shipping address" />
                  <Banner
                    v-if="!billingMatches"
                    status="info"
                    title="Connect a billing-address step"
                    description="This local example does not collect a separate billing address or send payment. Add that flow with your payment provider."
                  />
                </FormLayout>
              </VStack>

              <VStack v-if="!isComplete" :gap="3" h-align="start">
                <FieldStatus
                  v-if="Object.keys(currentErrors).length > 0"
                  type="error"
                  variant="detached"
                  :message="blockedMessage(Object.keys(currentErrors).length)"
                />
                <HStack :gap="3" align="center" width="100%">
                  <Button
                    :label="step === 0 ? 'Continue shopping' : 'Back'"
                    variant="secondary"
                    @click="step = Math.max(0, step - 1)"
                  />
                  <StackItem size="fill">
                    <Button
                      :label="isLastStep ? `Pay ${money(total)}` : 'Continue'"
                      variant="primary"
                      width="100%"
                      @click="goNext"
                    />
                  </StackItem>
                </HStack>
              </VStack>
            </VStack>
          </StackItem>

          <StackItem :class="isNarrow ? 'summary-column summary-column--narrow' : 'summary-column'">
            <Card :padding="5">
              <component
                :is="isNarrow ? Collapsible : VStack"
                v-bind="isNarrow ? { trigger: `Order summary · ${money(total)}`, defaultIsOpen: false } : { gap: 4 }"
              >
                <HStack v-if="!isNarrow" :gap="2" align="center" justify="between" class="summary-title">
                  <Text type="label">
                    Order summary
                  </Text>
                  <Badge variant="neutral" :label="`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`" />
                </HStack>
                <VStack :gap="4" :padding-block-start="isNarrow ? 3 : undefined">
                  <VStack :gap="3">
                    <HStack v-for="item in items" :key="item.id" :gap="3" align="start">
                      <Thumbnail :src="item.src" :alt="item.name" />
                      <StackItem size="fill">
                        <VStack :gap="0.5">
                          <HStack :gap="2" align="start" justify="between">
                            <Text type="body" weight="medium">
                              {{ item.name }}
                            </Text>
                            <Text type="body" weight="bold">
                              {{ money(item.price * item.qty) }}
                            </Text>
                          </HStack>
                          <Text type="supporting" color="secondary">
                            {{ item.variant }} · Qty {{ item.qty }}
                          </Text>
                        </VStack>
                      </StackItem>
                    </HStack>
                  </VStack>
                  <Divider />
                  <VStack :gap="2">
                    <HStack justify="between" align="center">
                      <Text type="body" color="secondary">
                        Subtotal
                      </Text>
                      <Text type="body">
                        {{ money(subtotal) }}
                      </Text>
                    </HStack>
                    <HStack v-if="promo" justify="between" align="center">
                      <Text type="body" color="secondary">
                        {{ promo.label }}
                      </Text>
                      <Text type="body">
                        −{{ money(discount) }}
                      </Text>
                    </HStack>
                    <HStack justify="between" align="center">
                      <Text type="body" color="secondary">
                        {{ deliveryOption.label }} delivery
                      </Text>
                      <Text type="body">
                        {{ shipping === 0 ? 'Free' : money(shipping) }}
                      </Text>
                    </HStack>
                    <HStack justify="between" align="center">
                      <Text type="body" color="secondary">
                        Estimated tax
                      </Text>
                      <Text type="body">
                        {{ money(tax) }}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack justify="between" align="center">
                      <Text type="large" weight="bold">
                        Total
                      </Text>
                      <Text type="large" weight="bold">
                        {{ money(total) }}
                      </Text>
                    </HStack>
                  </VStack>
                  <Banner
                    v-if="subtotal - discount < FREE_SHIPPING_THRESHOLD"
                    status="info"
                    :title="`${money(FREE_SHIPPING_THRESHOLD - (subtotal - discount))} away from free standard shipping`"
                  />
                </VStack>
              </component>
            </Card>
          </StackItem>
        </Stack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
/* 摘要列固定 360 宽，表单滚过时贴在页面内边距处；窄版时排到表单前面、占满一行。 */
.summary-column {
  position: sticky;
  top: var(--astryx-spacing-6);
  flex-shrink: 0;
  align-self: flex-start;
  width: 360px;
}
.summary-column--narrow {
  position: static;
  order: -1;
  align-self: stretch;
  width: auto;
}
.quantity-field {
  display: block;
  flex: none;
  width: 96px;
}
</style>
