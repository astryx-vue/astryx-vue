<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import DropdownMenuBranch from './DropdownMenuBranch.vue'
import { dropdownMenuFrameKey } from './frame.js'
import { MenuBottomSheet } from './lazyMenuBottomSheet.js'
import { DropdownMenuItems } from './renderItems.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuFrame' })

defineSlots<{
  default?: () => unknown
  header?: () => unknown
  footer?: () => unknown
}>()
const frame = inject(dropdownMenuFrameKey)
if (frame == null)
  throw new Error('DropdownMenuFrame must render inside DropdownMenu')

// SSR 和水合的第一帧都不挂异步面板；关闭的面板本来就没有可见内容。
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <MenuBottomSheet
    v-if="frame.isSheet && isClient"
    v-model:is-open="frame.sheetOpen"
    height="hug"
    :label="frame.sheetLabel"
    :padding="2"
  >
    <LayerContentBoundary>
      <DropdownMenuBranch :value="frame.menuContext">
        <div
          v-if="$slots.header"
          :ref="frame.setHeader"
          class="astryx-dropdown-menu-region"
          @keydown="frame.regions.onRegionKeydown"
        >
          <slot name="header" />
        </div>
        <div
          :id="frame.surfaceId"
          :ref="frame.setSurface"
          v-bind="frame.menuBindings"
          :aria-labelledby="frame.menuAriaLabelledBy"
          :aria-label="frame.menuAriaLabel"
          class="astryx-dropdown-menu is-sheet"
          :class="frame.surfaceClass"
          :data-overflow="frame.hasOverflow || undefined"
          role="menu"
          tabindex="-1"
          @keydown="frame.onSurfaceKeydown"
        >
          <div class="astryx-dropdown-menu-tree" :hidden="frame.isDrilled || undefined" :inert="frame.isDrilled || undefined">
            <DropdownMenuItems v-if="frame.items != null" :items="frame.items" />
            <slot v-else />
          </div>
          <div :ref="frame.setHost" class="astryx-dropdown-menu-tree" />
        </div>
        <div
          v-if="$slots.footer"
          :ref="frame.setFooter"
          class="astryx-dropdown-menu-region"
          @keydown="frame.regions.onRegionKeydown"
        >
          <slot name="footer" />
        </div>
      </DropdownMenuBranch>
    </LayerContentBoundary>
  </MenuBottomSheet>
  <Teleport v-else :to="frame.teleportTarget">
    <Transition name="astryx-dropdown-menu">
      <div
        v-if="frame.hasRegions"
        v-show="frame.isOpen"
        :id="frame.dialogId"
        :ref="frame.setPopover"
        class="astryx-dropdown-menu-popover"
        role="dialog"
        aria-modal="true"
        :aria-label="frame.dialogLabel"
        :data-placement="frame.placement"
        :style="frame.surfaceStyle"
      >
        <LayerContentBoundary>
          <DropdownMenuBranch :value="frame.menuContext">
            <div
              v-if="$slots.header"
              :ref="frame.setHeader"
              class="astryx-dropdown-menu-region"
              @keydown="frame.regions.onRegionKeydown"
            >
              <slot name="header" />
            </div>
            <div
              :id="frame.surfaceId"
              :ref="frame.setSurface"
              v-bind="frame.menuBindings"
              :aria-labelledby="frame.menuAriaLabelledBy"
              :aria-label="frame.menuAriaLabel"
              class="astryx-dropdown-menu is-in-frame"
              :class="frame.surfaceClass"
              :data-overflow="frame.hasOverflow || undefined"
              :data-region-focus="frame.regionFocus || undefined"
              role="menu"
              tabindex="0"
              @focus="frame.onSurfaceFocus"
              @keydown="frame.onSurfaceKeydown"
            >
              <div class="astryx-dropdown-menu-tree" :hidden="frame.isDrilled || undefined" :inert="frame.isDrilled || undefined">
                <DropdownMenuItems v-if="frame.items != null" :items="frame.items" />
                <slot v-else />
              </div>
              <div :ref="frame.setHost" class="astryx-dropdown-menu-tree" />
            </div>
            <div
              v-if="$slots.footer"
              :ref="frame.setFooter"
              class="astryx-dropdown-menu-region"
              @keydown="frame.regions.onRegionKeydown"
            >
              <slot name="footer" />
            </div>
          </DropdownMenuBranch>
        </LayerContentBoundary>
      </div>
      <div
        v-else
        v-show="frame.isOpen"
        :id="frame.surfaceId"
        :ref="frame.setSurface"
        v-bind="frame.menuBindings"
        :aria-labelledby="frame.menuAriaLabelledBy"
        :aria-label="frame.menuAriaLabel"
        class="astryx-dropdown-menu"
        :class="frame.surfaceClass"
        :data-placement="frame.placement"
        :data-overflow="frame.hasOverflow || undefined"
        role="menu"
        :style="frame.surfaceStyle"
        tabindex="-1"
        @focus="frame.onSurfaceFocus"
        @keydown="frame.onSurfaceKeydown"
      >
        <LayerContentBoundary>
          <DropdownMenuBranch :value="frame.menuContext">
            <div class="astryx-dropdown-menu-tree" :hidden="frame.isDrilled || undefined" :inert="frame.isDrilled || undefined">
              <DropdownMenuItems v-if="frame.items != null" :items="frame.items" />
              <slot v-else />
            </div>
            <div :ref="frame.setHost" class="astryx-dropdown-menu-tree" />
          </DropdownMenuBranch>
        </LayerContentBoundary>
      </div>
    </Transition>
  </Teleport>
</template>
