<script setup lang="ts">
import {
  Button,
  Card,
  Center,
  Collapsible,
  CollapsibleGroup,
  Divider,
  DropdownMenu,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  NumberInput,
  ResizeHandle,
  Section,
  Selector,
  StackItem,
  Tab,
  TabList,
  Text,
  TextArea,
  TextInput,
  VStack,
  useResizable,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

type LayerKind = 'text' | 'image'

interface Layer {
  id: string
  name: string
  kind: LayerKind
  x: number
  y: number
  width: number
  height: number
  rotation: number
  paddingInline: number
  paddingBlock: number
  radius: number
  isLocked: boolean
  /** 文本图层是文案，图片图层是替代文本。 */
  content: string
  fill?: string
  color?: string
  family?: string
  weight?: string
  size?: number
  line?: number
  tracking?: number
  alignX?: 'start' | 'center' | 'end'
}

const FRAME = { width: 1080, height: 1920 }
const PHOTO = '/template-assets/moody-scene-vertical-1.png'

const FONT_OPTIONS = ['Anton', 'Archivo Black', 'Bebas Neue', 'Inter Tight'].map(value => ({ value, label: value }))
const WEIGHT_OPTIONS = ['Regular', 'Medium', 'Semibold', 'Bold'].map(value => ({ value, label: value }))

const LAYERS: Layer[] = [
  {
    id: 'headline',
    name: 'Headline',
    kind: 'text',
    x: 56,
    y: 136,
    width: 968,
    height: 300,
    rotation: 0,
    paddingInline: 0,
    paddingBlock: 0,
    radius: 0,
    isLocked: false,
    content: 'A weekend in Salzburg',
    fill: '#111111',
    family: 'Anton',
    weight: 'Regular',
    color: '#111111',
    size: 112,
    line: 100,
    tracking: -2,
    alignX: 'start',
  },
  {
    id: 'dateline',
    name: 'Dateline',
    kind: 'text',
    x: 56,
    y: 56,
    width: 968,
    height: 56,
    rotation: 0,
    paddingInline: 0,
    paddingBlock: 0,
    radius: 0,
    isLocked: false,
    content: 'March 14–16 · Austria',
    family: 'Inter Tight',
    weight: 'Medium',
    color: '#111111',
    size: 26,
    line: 120,
    tracking: 32,
    alignX: 'center',
  },
  {
    id: 'photo',
    name: 'Photo',
    kind: 'image',
    x: 0,
    y: 0,
    width: 1080,
    height: 1920,
    rotation: 0,
    paddingInline: 0,
    paddingBlock: 0,
    radius: 0,
    isLocked: true,
    content: 'The Salzach river and old town rooftops at dusk',
  },
]

/** 图层树的两组：文字和图片分开，折叠状态由 CollapsibleGroup 记。 */
const LAYER_GROUPS = [
  { id: 'text', label: 'Text', icon: 'heroicons:square-2-stack', kind: 'text' as LayerKind },
  { id: 'images', label: 'Images', icon: 'heroicons:photo', kind: 'image' as LayerKind },
]

const tabs = ref([
  { id: 'poster', name: 'Salzburg poster' },
  { id: 'brand', name: 'Brand sheet' },
  { id: 'draft', name: 'Untitled draft' },
])
const activeTab = ref('poster')
const layers = ref<Layer[]>(LAYERS)
const selectedId = ref('headline')
const panel = ref('layers')

const rail = useResizable({ defaultSize: 440, minSize: 280, maxSize: 560 })
const inspector = useResizable({ defaultSize: 240, minSize: 220, maxSize: 360 })

/** 图片垫在最下层，文字压在上面，层级顺序和图层列表无关。 */
const paintedLayers = computed(() => [...layers.value].sort((a, b) =>
  Number(b.kind === 'image') - Number(a.kind === 'image'),
))

const selected = computed(() => layers.value.find(layer => layer.id === selectedId.value) ?? null)

/** 画布按固定比例缩放，外面那层框按缩放后的尺寸占位，居中才不会歪。 */
const ZOOM = 0.4

const canvasScale = computed(() => ({
  transform: `scale(${ZOOM})`,
  transformOrigin: 'top left',
  width: `${FRAME.width}px`,
  height: `${FRAME.height}px`,
}))

const frameBox = computed(() => ({
  width: `${FRAME.width * ZOOM}px`,
  height: `${FRAME.height * ZOOM}px`,
}))

function layersOf(kind: LayerKind): Layer[] {
  return layers.value.filter(layer => layer.kind === kind)
}

function updateSelected(patch: Partial<Layer>): void {
  const current = selected.value
  if (current == null)
    return
  layers.value = layers.value.map(layer => (layer.id === current.id ? { ...layer, ...patch } : layer))
}

function updateNumber(key: keyof Layer, value: number | null): void {
  updateSelected({ [key]: value ?? 0 } as Partial<Layer>)
}

function closeTab(id: string): void {
  const index = tabs.value.findIndex(tab => tab.id === id)
  const next = tabs.value.filter(tab => tab.id !== id)
  tabs.value = next
  if (activeTab.value === id)
    activeTab.value = (next[index] ?? next[index - 1])?.id ?? ''
}

function openTab(): void {
  const id = `untitled-${tabs.value.length + 1}`
  tabs.value = [...tabs.value, { id, name: 'Untitled draft' }]
  activeTab.value = id
}

const menuItems = [
  { label: 'New poster', onClick: () => {} },
  { label: 'Open…', onClick: () => {} },
  { type: 'divider' as const },
  { label: 'Save', onClick: () => {} },
  { label: 'Save as…', onClick: () => {} },
  { type: 'divider' as const },
  { label: 'Close', onClick: () => {} },
]

const exportItems = ['PNG', 'JPG', 'SVG', 'PDF'].map(label => ({ label, onClick: () => {} }))

/** 画布里文本图层的排版：字体、字距、行高都跟着图层属性走。 */
function textStyle(layer: Layer): Record<string, string> {
  const family = layer.family === 'Anton' ? 'Anton, Impact, sans-serif' : `'${layer.family ?? 'Inter Tight'}', system-ui, sans-serif`
  return {
    color: layer.color ?? '#111111',
    fontFamily: family,
    fontWeight: String(layer.weight === 'Medium' ? 500 : layer.weight === 'Semibold' ? 600 : layer.weight === 'Bold' ? 700 : 400),
    fontSize: `${layer.size ?? 16}px`,
    letterSpacing: `${(layer.tracking ?? 0) / 1000}em`,
    lineHeight: `${(layer.line ?? 100) / 100}`,
    textAlign: layer.alignX ?? 'start',
    textTransform: 'uppercase',
  }
}

</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader :padding="0">
        <HStack :gap="0.5" align="center" class="editor-header">
          <DropdownMenu
            :items="menuItems"
            has-chevron
            :button="{ label: 'Menu', variant: 'ghost', size: 'sm', isIconOnly: true }"
          >
            <template #trigger="triggerProps">
              <IconButton v-bind="triggerProps" label="Menu" variant="ghost" size="sm">
                <Icon name="heroicons:bars-3" size="sm" />
              </IconButton>
            </template>
          </DropdownMenu>

          <HStack :gap="0" align="center" class="tab-strip">
            <div
              v-for="tab in tabs"
              :key="tab.id"
              class="doc-tab"
              :data-active="tab.id === activeTab || undefined"
            >
              <button type="button" class="doc-tab__button" @click="activeTab = tab.id">
                <Icon name="heroicons:document" size="sm" color="secondary" />
                <span class="doc-tab__name">{{ tab.name }}</span>
              </button>
              <IconButton
                v-if="tab.id === activeTab"
                :label="`Close ${tab.name}`"
                variant="ghost"
                size="sm"
                @click="closeTab(tab.id)"
              >
                <Icon name="heroicons:x-mark" size="sm" />
              </IconButton>
            </div>
            <IconButton label="New document" variant="ghost" size="sm" @click="openTab">
              <Icon name="heroicons:plus" size="sm" />
            </IconButton>
          </HStack>

          <StackItem size="fill" />

          <Text type="supporting" color="secondary" class="saved-note">
            Saved · 2 min ago
          </Text>
          <DropdownMenu has-chevron :items="exportItems" :button="{ label: 'Export', variant: 'secondary', size: 'sm' }">
            <template #trigger="triggerProps">
              <Button v-bind="triggerProps" label="Export" variant="secondary" size="sm">
                <template #icon>
                  <Icon name="heroicons:arrow-down-tray" size="sm" />
                </template>
              </Button>
            </template>
          </DropdownMenu>
        </HStack>
      </LayoutHeader>
    </template>

    <template #start>
      <ResizeHandle :resizable="rail.props" :is-always-visible="false" />
      <LayoutPanel :width="rail.size" :padding="0" :resizable="rail.props" label="Document panels">
        <VStack :gap="0" height="100%">
          <Section variant="transparent" :padding="3" :padding-block-end="0">
            <TabList v-model:value="panel" size="sm">
              <Tab value="layers" label="Layers" />
              <Tab value="library" label="Library" />
            </TabList>
          </Section>

          <CollapsibleGroup v-if="panel === 'layers'" type="multiple" :default-value="['text', 'images']" class="layer-groups">
            <Collapsible v-for="group in LAYER_GROUPS" :key="group.id" :value="group.id">
              <template #trigger>
                <HStack :gap="2" align="center">
                  <Icon :name="group.icon" size="sm" color="secondary" />
                  <Text type="label">
                    {{ group.label }}
                  </Text>
                </HStack>
              </template>
              <VStack :gap="0" class="layer-rows">
                <HStack
                  v-for="layer in layersOf(group.kind)"
                  :key="layer.id"
                  :gap="2"
                  align="center"
                  class="layer-row"
                  :data-selected="layer.id === selectedId || undefined"
                  @click="selectedId = layer.id"
                >
                  <Icon
                    :name="layer.kind === 'text' ? 'heroicons:document-text' : 'heroicons:photo'"
                    size="sm"
                    color="secondary"
                  />
                  <StackItem size="fill">
                    <Text :max-lines="1">
                      {{ layer.name }}
                    </Text>
                  </StackItem>
                  <Icon v-if="layer.isLocked" name="heroicons:lock-closed" size="sm" color="secondary" />
                </HStack>
              </VStack>
            </Collapsible>
          </CollapsibleGroup>

          <Section v-else variant="transparent" :padding="3">
            <Text color="secondary">
              Nothing saved to this library yet.
            </Text>
          </Section>
        </VStack>
      </LayoutPanel>
    </template>

    <LayoutContent :padding="0">
      <Center class="canvas-stage">
        <Card :padding="0" class="artboard-card" :style="frameBox">
          <div class="artboard" :style="canvasScale">
            <div
              v-for="layer in paintedLayers"
              :key="layer.id"
              class="layer"
              :class="{ selected: layer.id === selectedId }"
              :style="{
                left: `${layer.x}px`,
                top: `${layer.y}px`,
                width: `${layer.width}px`,
                height: `${layer.height}px`,
                transform: `rotate(${layer.rotation}deg)`,
              }"
              @click="selectedId = layer.id"
            >
              <img
                v-if="layer.kind === 'image'"
                class="image-layer"
                :src="PHOTO"
                :alt="layer.content"
              >
              <p v-else class="text-layer" :style="textStyle(layer)">
                {{ layer.content }}
              </p>
            </div>
          </div>
        </Card>
      </Center>
    </LayoutContent>

    <template #end>
      <ResizeHandle :resizable="inspector.props" is-reversed :is-always-visible="false" />
      <LayoutPanel has-divider :width="inspector.size" :padding="0" :resizable="inspector.props" label="Inspector">
        <VStack v-if="selected" :gap="0">
          <Section variant="transparent" :padding="3" class="insp-section">
            <VStack :gap="2">
              <Text weight="semibold">
                Layout
              </Text>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Padding
                </Text>
                <VStack :width="56">
                  <NumberInput
                    :model-value="selected.paddingInline"
                    label="Inline padding"
                    is-label-hidden
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('paddingInline', value)"
                  />
                </VStack>
                <VStack :width="56">
                  <NumberInput
                    :model-value="selected.paddingBlock"
                    label="Block padding"
                    is-label-hidden
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('paddingBlock', value)"
                  />
                </VStack>
                <Icon name="heroicons:rectangle-stack" size="sm" color="secondary" />
              </HStack>
            </VStack>
          </Section>

          <Divider />

          <Section variant="transparent" :padding="3" class="insp-section">
            <VStack :gap="2">
              <Text weight="semibold">
                Layer
              </Text>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Position
                </Text>
                <VStack :width="64">
                  <NumberInput
                    :model-value="selected.x"
                    label="X"
                   
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('x', value)"
                  />
                </VStack>
                <VStack :width="64">
                  <NumberInput
                    :model-value="selected.y"
                    label="Y"
                   
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('y', value)"
                  />
                </VStack>
              </HStack>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Size
                </Text>
                <VStack :width="64">
                  <NumberInput
                    :model-value="selected.width"
                    label="Width"
                   
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('width', value)"
                  />
                </VStack>
                <VStack :width="64">
                  <NumberInput
                    :model-value="selected.height"
                    label="Height"
                   
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('height', value)"
                  />
                </VStack>
              </HStack>
            </VStack>
          </Section>

          <Divider />

          <Section variant="transparent" :padding="3" class="insp-section">
            <VStack :gap="2">
              <Text weight="semibold">
                Styles
              </Text>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Radius
                </Text>
                <VStack :width="88">
                  <NumberInput
                    :model-value="selected.radius"
                    label="Radius"
                    is-label-hidden
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('radius', value)"
                  />
                </VStack>
                <IconButton label="Copy radius" variant="ghost" size="sm">
                  <Icon icon="copy" size="sm" />
                </IconButton>
              </HStack>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Border
                </Text>
                <VStack :width="88">
                  <TextInput :model-value="''" label="Border" is-label-hidden placeholder="Add…" size="sm" />
                </VStack>
                <IconButton label="Border presets" variant="ghost" size="sm">
                  <Icon name="heroicons:square-2-stack" size="sm" />
                </IconButton>
                <IconButton label="Clear border" variant="ghost" size="sm">
                  <Icon icon="close" size="sm" />
                </IconButton>
              </HStack>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Shadow
                </Text>
                <VStack :width="88">
                  <TextInput :model-value="''" label="Shadow" is-label-hidden placeholder="Add…" size="sm" />
                </VStack>
                <IconButton label="Shadow presets" variant="ghost" size="sm">
                  <Icon name="heroicons:square-2-stack" size="sm" />
                </IconButton>
                <IconButton label="Clear shadow" variant="ghost" size="sm">
                  <Icon icon="close" size="sm" />
                </IconButton>
              </HStack>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Fill
                </Text>
                <VStack :width="88">
                  <TextInput
                    :model-value="selected.fill ?? ''"
                    label="Fill"
                    is-label-hidden
                    size="sm"
                    @update:model-value="updateSelected({ fill: $event })"
                  />
                </VStack>
                <span class="swatch" :style="{ backgroundColor: selected.fill ?? '#111111' }" />
                <IconButton label="Clear fill" variant="ghost" size="sm">
                  <Icon icon="close" size="sm" />
                </IconButton>
              </HStack>
            </VStack>
          </Section>

          <Divider />

          <Section variant="transparent" :padding="3" class="insp-section">
            <VStack :gap="2">
              <Text weight="semibold">
                Transforms
              </Text>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Rotate
                </Text>
                <VStack :width="88">
                  <NumberInput
                    :model-value="selected.rotation"
                    label="Rotation"
                    is-label-hidden
                    size="sm"
                    @update:model-value="(value: number | null) => updateNumber('rotation', value)"
                  />
                </VStack>
                <IconButton label="Rotate left" variant="ghost" size="sm">
                  <Icon name="heroicons:arrow-path" size="sm" />
                </IconButton>
                <IconButton label="Rotate right" variant="ghost" size="sm">
                  <Icon name="heroicons:arrow-path" size="sm" />
                </IconButton>
              </HStack>
              <HStack :gap="2" align="center" class="insp-row">
                <Text type="supporting" color="secondary" class="insp-label">
                  Flip
                </Text>
                <IconButton label="Flip horizontally" variant="ghost" size="sm">
                  <Icon name="heroicons:arrows-right-left" size="sm" />
                </IconButton>
                <IconButton label="Flip vertically" variant="ghost" size="sm">
                  <Icon name="heroicons:arrows-up-down" size="sm" />
                </IconButton>
              </HStack>
            </VStack>
          </Section>

          <template v-if="selected.kind === 'text'">
            <Divider />

            <Section variant="transparent" :padding="3" class="insp-section">
              <VStack :gap="2">
                <Text weight="semibold">
                  Text
                </Text>
                <TextArea
                  :model-value="selected.content"
                  label="Content"
                  is-label-hidden
                  :rows="3"
                  @update:model-value="updateSelected({ content: $event })"
                />
                <HStack :gap="2" align="center" class="insp-row">
                  <Text type="supporting" color="secondary" class="insp-label">
                    Font
                  </Text>
                  <VStack :width="128">
                    <Selector
                      :model-value="selected.family ?? 'Anton'"
                      label="Font"
                      is-label-hidden
                      size="sm"
                      :options="FONT_OPTIONS"
                      @update:model-value="(value: string | number | null) => updateSelected({ family: String(value) })"
                    />
                  </VStack>
                </HStack>
                <HStack :gap="2" align="center" class="insp-row">
                  <Text type="supporting" color="secondary" class="insp-label">
                    Weight
                  </Text>
                  <VStack :width="128">
                    <Selector
                      :model-value="selected.weight ?? 'Regular'"
                      label="Weight"
                      is-label-hidden
                      size="sm"
                      :options="WEIGHT_OPTIONS"
                      @update:model-value="(value: string | number | null) => updateSelected({ weight: String(value) })"
                    />
                  </VStack>
                </HStack>
                <HStack :gap="2" align="center" class="insp-row">
                  <Text type="supporting" color="secondary" class="insp-label">
                    Color
                  </Text>
                  <VStack :width="88">
                    <TextInput
                      :model-value="selected.color ?? ''"
                      label="Text color"
                      is-label-hidden
                      size="sm"
                      @update:model-value="updateSelected({ color: $event })"
                    />
                  </VStack>
                  <span class="swatch" :style="{ backgroundColor: selected.color ?? '#111111' }" />
                </HStack>
                <HStack :gap="2" align="center" class="insp-row">
                  <Text type="supporting" color="secondary" class="insp-label">
                    Size
                  </Text>
                  <VStack :width="88">
                    <NumberInput
                      :model-value="selected.size ?? 16"
                      label="Size"
                      is-label-hidden
                      size="sm"
                      @update:model-value="(value: number | null) => updateNumber('size', value)"
                    />
                  </VStack>
                </HStack>
                <HStack :gap="2" align="center" class="insp-row">
                  <Text type="supporting" color="secondary" class="insp-label">
                    Line
                  </Text>
                  <VStack :width="88">
                    <NumberInput
                      :model-value="selected.line ?? 100"
                      label="Line height"
                      is-label-hidden
                      size="sm"
                      @update:model-value="(value: number | null) => updateNumber('line', value)"
                    />
                  </VStack>
                </HStack>
              </VStack>
            </Section>
          </template>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style>
.editor-header {
  padding: var(--astryx-spacing-1, 4px) var(--astryx-spacing-2, 8px);
  border-block-end: 1px solid var(--astryx-color-border, #00000014);
}

.tab-strip {
  overflow-x: auto;
  max-width: 480px;
}

.doc-tab {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-inline: 4px;
  border-radius: 6px;
  color: var(--astryx-color-text-secondary, #525252);
}

.doc-tab[data-active] {
  background: var(--astryx-color-background-muted, #f5f5f5);
  color: var(--astryx-color-text-primary, #171717);
}

.doc-tab__button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.doc-tab__name {
  white-space: nowrap;
  font-size: 13px;
}

.doc-tab[data-active] .doc-tab__name {
  font-weight: 500;
}

.saved-note {
  padding-inline-end: var(--astryx-spacing-2, 8px);
}

.layer-groups {
  padding-block-start: var(--astryx-spacing-2, 8px);
}

.layer-groups .astryx-collapsible-trigger {
  padding-inline: var(--astryx-spacing-3, 12px);
}

.layer-rows {
  padding-block: 2px;
}

.layer-row {
  padding: 6px var(--astryx-spacing-3, 12px) 6px 32px;
  cursor: pointer;
}

.layer-row[data-selected] {
  background: var(--astryx-color-background-muted, #f5f5f5);
}

.layer-row:hover {
  background: var(--astryx-color-background-muted, #f5f5f5);
}

.canvas-stage {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  overflow: auto;
  background: var(--astryx-color-background-body, #fafafa);
  padding-block: var(--astryx-spacing-6, 24px);
}

.artboard-card {
  position: relative;
  overflow: hidden;
  background: #f4f1ec;
  flex: none;
}

.artboard {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--astryx-color-border, #00000014);
}

.layer {
  position: absolute;
  box-sizing: border-box;
  cursor: pointer;
  border: 1px solid transparent;
}

.layer.selected {
  border-color: var(--astryx-color-accent, #2563eb);
  box-shadow: 0 0 0 1px var(--astryx-color-accent, #2563eb);
}

.text-layer {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
}

.image-layer {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.insp-section {
  padding-inline: var(--astryx-spacing-3, 12px);
}

.insp-row {
  min-height: 28px;
}

.insp-label {
  flex: 0 0 56px;
}

.swatch {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px var(--astryx-color-border, #00000014);
}
</style>
