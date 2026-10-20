<script setup lang="ts">
import {
  AspectRatio,
  Button,
  Card,
  Center,
  Divider,
  DropdownMenu,
  Heading,
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
  SegmentedControl,
  SegmentedControlItem,
  Slider,
  StackItem,
  Text,
  TextArea,
  TextInput,
  Toolbar,
  TreeList,
  useResizable,
  VStack,
} from '@astryx-vue/core'
import type { TreeListItemData } from '@astryx-vue/core'
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
  content: string
  fill?: string
  color?: string
  size?: number
  isLocked: boolean
}

const FRAME = { width: 1080, height: 1920 }
const PHOTO = '/template-assets/moody-scene-vertical-1.png'

const layers = ref<Layer[]>([
  {
    id: 'headline',
    name: 'Headline',
    kind: 'text',
    x: 56,
    y: 136,
    width: 968,
    height: 300,
    rotation: 0,
    content: 'A weekend in Salzburg',
    fill: '#111111',
    color: '#111111',
    size: 112,
    isLocked: false,
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
    content: 'March 14–16 · Austria',
    color: '#111111',
    size: 26,
    isLocked: false,
  },
  {
    id: 'photo',
    name: 'Hero photo',
    kind: 'image',
    x: 56,
    y: 480,
    width: 968,
    height: 1200,
    rotation: 0,
    content: 'Moody alpine scene at dusk',
    isLocked: false,
  },
])

const selectedId = ref('headline')
const zoom = ref(0.45)
const activeTab = ref('poster')

const rail = useResizable({ defaultSize: 240, minSize: 200, maxSize: 320 })
const inspector = useResizable({ defaultSize: 300, minSize: 260, maxSize: 400, isReversed: true })

const selected = computed(() => layers.value.find(l => l.id === selectedId.value) ?? null)

const treeItems = computed<TreeListItemData[]>(() =>
  layers.value.map(layer => ({
    id: layer.id,
    label: layer.name,
    icon: layer.kind === 'text' ? 'i-heroicons-bars-3-bottom-left' : 'i-heroicons-photo',
    children: undefined,
  })),
)

function updateSelected(patch: Partial<Layer>): void {
  if (!selected.value)
    return
  layers.value = layers.value.map(l => (l.id === selected.value!.id ? { ...l, ...patch } : l))
}

const canvasScale = computed(() => ({
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top center',
  width: `${FRAME.width}px`,
  height: `${FRAME.height}px`,
}))
</script>

<template>
  <Layout height="fill" class="editor-shell">
    <template #header>
      <LayoutHeader :padding="0">
        <Toolbar label="Document" size="sm" :dividers="['bottom']">
          <template #startContent>
            <HStack :gap="2" align="center">
              <IconButton label="Menu" variant="ghost" size="sm">
                <Icon icon="i-heroicons-bars-3" size="sm" />
              </IconButton>
              <SegmentedControl v-model="activeTab" label="Open documents" size="sm">
                <SegmentedControlItem value="poster" label="Salzburg poster" />
                <SegmentedControlItem value="brand" label="Brand sheet" />
                <SegmentedControlItem value="draft" label="Untitled draft" />
              </SegmentedControl>
            </HStack>
          </template>
          <template #endContent>
            <Text type="supporting" color="secondary">
              Saved locally
            </Text>
            <Button label="Export" variant="primary" size="sm" />
          </template>
        </Toolbar>
        <Section variant="muted" :padding="2">
          <HStack :gap="2" align="center" wrap="wrap">
            <IconButton label="Undo" variant="ghost" size="sm">
              <Icon icon="i-heroicons-arrow-uturn-left" size="sm" />
            </IconButton>
            <IconButton label="Redo" variant="ghost" size="sm">
              <Icon icon="i-heroicons-arrow-uturn-right" size="sm" />
            </IconButton>
            <Divider orientation="vertical" />
            <Button label="Select" variant="secondary" size="sm" />
            <Button label="Text" variant="ghost" size="sm" />
            <Button label="Image" variant="ghost" size="sm" />
            <Button label="Frame" variant="ghost" size="sm" />
            <StackItem size="fill" />
            <Text type="supporting" color="secondary">
              Zoom
            </Text>
            <Slider v-model="zoom" label="Zoom" is-label-hidden :min="0.25" :max="1" :step="0.05" :width="160" />
          </HStack>
        </Section>
      </LayoutHeader>
    </template>

    <template #start>
      <ResizeHandle :resizable="rail.props" :is-always-visible="false" />
      <LayoutPanel :has-divider="false" :width="rail.size" :padding="0" :resizable="rail.props">
        <VStack :padding="3" :gap="3" height="100%">
          <Heading :level="3">
            Layers
          </Heading>
          <TreeList
            :items="treeItems"
            :selected-id="selectedId"
            density="compact"
            @update:selected-id="selectedId = $event"
          />
        </VStack>
      </LayoutPanel>
    </template>

    <LayoutContent :padding="4">
      <Center class="canvas-stage">
        <Card :padding="0" class="artboard-card">
          <div class="artboard" :style="canvasScale">
            <div
              v-for="layer in layers"
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
              <template v-if="layer.kind === 'text'">
                <p
                  class="text-layer"
                  :style="{ color: layer.color, fontSize: `${layer.size ?? 16}px` }"
                >
                  {{ layer.content }}
                </p>
              </template>
              <img
                v-else
                class="image-layer"
                :src="PHOTO"
                :alt="layer.content"
              >
            </div>
          </div>
        </Card>
      </Center>
    </LayoutContent>

    <template #end>
      <ResizeHandle :resizable="inspector.props" is-reversed :is-always-visible="false" />
      <LayoutPanel has-divider :width="inspector.size" :padding="4" :resizable="inspector.props" label="Inspector">
        <VStack v-if="selected" :gap="4">
          <HStack :gap="2" align="center" justify="between">
            <Heading :level="3">
              {{ selected.name }}
            </Heading>
            <IconButton :label="selected.isLocked ? 'Unlock' : 'Lock'" variant="ghost" size="sm" @click="updateSelected({ isLocked: !selected.isLocked })">
              <Icon :icon="selected.isLocked ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" size="sm" />
            </IconButton>
          </HStack>
          <Text type="supporting" color="secondary">
            {{ selected.kind === 'text' ? 'Text layer' : 'Image layer' }}
          </Text>
          <Divider />
          <HStack :gap="2">
            <NumberInput label="X" :model-value="selected.x" size="sm" @update:model-value="updateSelected({ x: $event })" />
            <NumberInput label="Y" :model-value="selected.y" size="sm" @update:model-value="updateSelected({ y: $event })" />
          </HStack>
          <HStack :gap="2">
            <NumberInput label="W" :model-value="selected.width" size="sm" @update:model-value="updateSelected({ width: $event })" />
            <NumberInput label="H" :model-value="selected.height" size="sm" @update:model-value="updateSelected({ height: $event })" />
          </HStack>
          <NumberInput label="Rotation" :model-value="selected.rotation" size="sm" @update:model-value="updateSelected({ rotation: $event })" />
          <template v-if="selected.kind === 'text'">
            <TextArea
              label="Content"
              :model-value="selected.content"
              :rows="3"
              @update:model-value="updateSelected({ content: $event })"
            />
            <TextInput label="Color" :model-value="selected.color ?? ''" @update:model-value="updateSelected({ color: $event })" />
            <NumberInput label="Size" :model-value="selected.size ?? 16" @update:model-value="updateSelected({ size: $event })" />
          </template>
          <template v-else>
            <TextInput label="Alt text" :model-value="selected.content" @update:model-value="updateSelected({ content: $event })" />
            <AspectRatio :ratio="16 / 9" width="100%">
              <img :src="PHOTO" alt="" class="inspector-thumb">
            </AspectRatio>
          </template>
          <DropdownMenu
            :button="{ label: 'Arrange', variant: 'secondary', size: 'sm' }"
            :items="[{ label: 'Bring forward' }, { label: 'Send backward' }, { type: 'divider' }, { label: 'Group selection' }]"
          />
        </VStack>
        <Text v-else color="secondary">
          Select a layer to inspect its properties.
        </Text>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.editor-shell {
  background: var(--color-background-body);
}
.canvas-stage {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  overflow: auto;
}
.artboard-card {
  overflow: visible;
  background: #f4f1ec;
}
.artboard {
  position: relative;
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--color-border);
}
.layer {
  position: absolute;
  box-sizing: border-box;
  cursor: pointer;
  border: 1px solid transparent;
}
.layer.selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}
.text-layer {
  margin: 0;
  font-family: Anton, Impact, sans-serif;
  text-transform: uppercase;
  line-height: 1.02;
}
.image-layer {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.inspector-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
