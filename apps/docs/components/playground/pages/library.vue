<script setup lang="ts">
import {
  Card,
  Center,
  Divider,
  DropdownMenu,
  Grid,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  Section,
  StackItem,
  Text,
  TextInput,
  ToggleButton,
  ToggleButtonGroup,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, ref } from 'vue'

interface LibraryItem {
  id: string
  name: string
  description: string
  category: string
  type: 'Component' | 'Pattern' | 'Utility'
  imageUrl?: string
}

const CATEGORIES = ['All', 'Layout', 'Forms', 'Navigation', 'Feedback', 'Data']

const ITEMS: LibraryItem[] = [
  { id: '1', name: 'Stack', description: 'Vertical and horizontal stack layouts with configurable gap and alignment.', category: 'Layout', type: 'Component', imageUrl: '/template-assets/colorful-home-horizontal-1.png' },
  { id: '2', name: 'Grid', description: 'Responsive grid container with auto-fit columns and gap control.', category: 'Layout', type: 'Component', imageUrl: '/template-assets/illustrative-horizontal-3.png' },
  { id: '3', name: 'Card', description: 'Surface container with optional padding, border, and shadow variants.', category: 'Layout', type: 'Component', imageUrl: '/template-assets/light-working-horizontal-2.png' },
  { id: '4', name: 'Center', description: 'Centers its child both horizontally and vertically.', category: 'Layout', type: 'Utility', imageUrl: '/template-assets/moody-scene-horizontal-1.png' },
  { id: '5', name: 'Section', description: 'Semantic page section with optional heading and divider.', category: 'Layout', type: 'Pattern', imageUrl: '/template-assets/colorful-lifestyle-horizontal-2.png' },
  { id: '6', name: 'Collapsible', description: 'Expandable region with animated height transition.', category: 'Layout', type: 'Component', imageUrl: '/template-assets/light-scene-horizontal-1.png' },
  { id: '7', name: 'TextInput', description: 'Single-line text field with label, placeholder, and validation states.', category: 'Forms', type: 'Component', imageUrl: '/template-assets/moody-working-horizontal-1.png' },
  { id: '8', name: 'TextArea', description: 'Multi-line text field with auto-resize and character count.', category: 'Forms', type: 'Component', imageUrl: '/template-assets/colorful-working-horizontal-3.png' },
  { id: '9', name: 'CheckboxInput', description: 'Checkbox with label, indeterminate state, and group support.', category: 'Forms', type: 'Component', imageUrl: '/template-assets/illustrative-horizontal-1.png' },
  { id: '10', name: 'RadioList', description: 'Group of radio buttons with accessible fieldset wrapper.', category: 'Forms', type: 'Component', imageUrl: '/template-assets/light-home-horizontal-1.png' },
  { id: '11', name: 'Switch', description: 'Toggle switch for binary on/off settings.', category: 'Forms', type: 'Component', imageUrl: '/template-assets/moody-home-horizontal-2.png' },
  { id: '12', name: 'Selector', description: 'Dropdown or inline option selector with single and multi-select modes.', category: 'Forms', type: 'Component', imageUrl: '/template-assets/colorful-product-1.png' },
  { id: '13', name: 'TabList', description: 'Horizontal tab navigation with underline indicator and keyboard support.', category: 'Navigation', type: 'Component', imageUrl: '/template-assets/illustrative-horizontal-5.png' },
  { id: '14', name: 'TopNav', description: 'Application top bar with logo, nav links, and action slots.', category: 'Navigation', type: 'Pattern', imageUrl: '/template-assets/light-working-horizontal-1.png' },
  { id: '15', name: 'SideNav', description: 'Vertical sidebar navigation with collapsible groups and active states.', category: 'Navigation', type: 'Pattern', imageUrl: '/template-assets/moody-lifestyle-horizontal-1.png' },
  { id: '16', name: 'Breadcrumbs', description: 'Path trail navigation with separator and truncation support.', category: 'Navigation', type: 'Component', imageUrl: '/template-assets/colorful-home-horizontal-2.png' },
  { id: '17', name: 'Pagination', description: 'Page navigation with prev/next controls and page count display.', category: 'Navigation', type: 'Component', imageUrl: '/template-assets/colorful-working-horizontal-1.png' },
  { id: '18', name: 'MobileNav', description: 'Bottom tab bar for mobile viewports with icon and label slots.', category: 'Navigation', type: 'Pattern', imageUrl: '/template-assets/light-working-horizontal-3.png' },
  { id: '19', name: 'Badge', description: 'Compact label for status, count, or category with semantic color variants.', category: 'Feedback', type: 'Component', imageUrl: '/template-assets/moody-working-horizontal-2.png' },
  { id: '20', name: 'Banner', description: 'Full-width alert bar for info, success, warning, and error messages.', category: 'Feedback', type: 'Component', imageUrl: '/template-assets/illustrative-horizontal-2.png' },
  { id: '21', name: 'Spinner', description: 'Animated loading indicator with size and color variants.', category: 'Feedback', type: 'Component', imageUrl: '/template-assets/colorful-lifestyle-horizontal-1.png' },
  { id: '22', name: 'ProgressBar', description: 'Horizontal bar indicating task completion percentage.', category: 'Feedback', type: 'Component', imageUrl: '/template-assets/light-lifestyle-horizontal-1.png' },
  { id: '23', name: 'StatusDot', description: 'Small dot indicator for presence, health, or pipeline status.', category: 'Feedback', type: 'Component', imageUrl: '/template-assets/moody-home-horizontal-1.png' },
  { id: '24', name: 'Tooltip', description: 'Contextual label that appears on hover with configurable placement.', category: 'Feedback', type: 'Component', imageUrl: '/template-assets/colorful-working-horizontal-2.png' },
  { id: '25', name: 'Table', description: 'Feature-rich data table with sorting, selection, and column resizing.', category: 'Data', type: 'Component', imageUrl: '/template-assets/illustrative-horizontal-4.png' },
  { id: '26', name: 'Avatar', description: 'User profile image with fallback initials and status dot support.', category: 'Data', type: 'Component', imageUrl: '/template-assets/light-working-horizontal-4.png' },
  { id: '27', name: 'Skeleton', description: 'Placeholder shimmer for loading states matching content shapes.', category: 'Data', type: 'Utility', imageUrl: '/template-assets/moody-lifestyle-horizontal-2.png' },
  { id: '28', name: 'HoverCard', description: 'Rich popover that appears on hover with arbitrary content.', category: 'Data', type: 'Component', imageUrl: '/template-assets/moody-scene-horizontal-2.png' },
  { id: '29', name: 'PowerSearch', description: 'Command-palette style search with grouped results and keyboard nav.', category: 'Data', type: 'Pattern', imageUrl: '/template-assets/colorful-product-2.png' },
  { id: '30', name: 'Typeahead', description: 'Autocomplete input with async suggestion loading and selection.', category: 'Data', type: 'Component', imageUrl: '/template-assets/moody-working-horizontal-3.png' },
]

const SearchIcon = defineComponent({
  render: () => h('span', { 'class': 'i-carbon-search', 'aria-hidden': 'true' }),
})

const activeTab = ref('All')
const search = ref('')
const sortOrder = ref('A-Z')

const filtered = computed(() => {
  let items = activeTab.value === 'All' ? ITEMS : ITEMS.filter(i => i.category === activeTab.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  }
  const sorted = [...items]
  if (sortOrder.value === 'A-Z')
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  else if (sortOrder.value === 'Z-A')
    sorted.sort((a, b) => b.name.localeCompare(a.name))
  else if (sortOrder.value === 'Newest')
    sorted.sort((a, b) => Number(b.id) - Number(a.id))
  return sorted
})

const groupedSections = computed(() => {
  if (activeTab.value !== 'All')
    return null
  const order = CATEGORIES.filter(c => c !== 'All')
  const map = new Map<string, LibraryItem[]>()
  for (const item of filtered.value) {
    let group = map.get(item.category)
    if (!group) {
      group = []
      map.set(item.category, group)
    }
    group.push(item)
  }
  return order
    .filter(cat => map.has(cat))
    .map(cat => ({ category: cat, items: map.get(cat) ?? [] }))
})

const displaySections = computed(() =>
  groupedSections.value ?? [{ category: activeTab.value, items: filtered.value }],
)
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader has-divider :padding="6">
        <Heading :level="1">
          Library
        </Heading>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="6">
      <VStack :gap="6">
        <VStack :gap="4">
          <TextInput
            v-model="search"
            label="Search"
            is-label-hidden
            placeholder="Search..."
            :start-icon="SearchIcon"
            size="lg"
          />
          <HStack align="center" :gap="4">
            <StackItem size="fill">
              <ToggleButtonGroup
                v-model="activeTab"
                label="Filter by category"
                size="lg"
              >
                <HStack :gap="1" wrap="wrap">
                  <ToggleButton
                    v-for="cat in CATEGORIES"
                    :key="cat"
                    :label="cat"
                    :value="cat"
                    size="lg"
                  />
                </HStack>
              </ToggleButtonGroup>
            </StackItem>
            <DropdownMenu
              :button="{ label: sortOrder, size: 'lg' }"
              :items="[
                { label: 'A-Z', onClick: () => { sortOrder = 'A-Z' } },
                { label: 'Z-A', onClick: () => { sortOrder = 'Z-A' } },
                { label: 'Newest', onClick: () => { sortOrder = 'Newest' } },
              ]"
            />
          </HStack>
        </VStack>

        <Center v-if="filtered.length === 0">
          <Text type="supporting" color="secondary">
            No results found.
          </Text>
        </Center>
        <VStack v-else :gap="6">
          <template v-for="section in displaySections" :key="section.category">
            <Divider />
            <VStack :gap="6">
              <Heading :level="2">
                {{ section.category }}
              </Heading>
              <Grid :columns="{ minWidth: 320 }" :gap="4">
                <Card v-for="item in section.items" :key="item.id" :padding="0">
                  <div class="thumbnail-wrap">
                    <img class="thumbnail-img" :src="item.imageUrl" :alt="item.name">
                  </div>
                  <Section variant="transparent" :padding="4">
                    <VStack :gap="1">
                      <Heading :level="3">
                        {{ item.name }}
                      </Heading>
                      <Text type="body" size="sm" color="secondary">
                        {{ item.description }}
                      </Text>
                    </VStack>
                  </Section>
                </Card>
              </Grid>
            </VStack>
          </template>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.thumbnail-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: clip;
  flex-shrink: 0;
}

.thumbnail-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
