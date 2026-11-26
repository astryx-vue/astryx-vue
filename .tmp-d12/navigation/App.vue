<script setup lang="ts">
import { ref } from 'vue'
import Drawer from '../../packages/core/src/Drawer/Drawer.vue'
import DrawerHeader from '../../packages/core/src/Drawer/DrawerHeader.vue'
import Pagination from '../../packages/core/src/Pagination/Pagination.vue'
import SideNav from '../../packages/core/src/SideNav/SideNav.vue'
import SideNavItem from '../../packages/core/src/SideNav/SideNavItem.vue'
import TreeList from '../../packages/core/src/TreeList/TreeList.vue'

const page = ref(5)
const drawerOpen = ref(false)
const params = new URLSearchParams(window.location.search)
const direction = params.get('dir') === 'rtl' ? 'rtl' : 'ltr'
const placement = params.get('side') === 'start' ? 'start' : 'end'
const treeItems = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        isExpanded: true,
        children: [{ id: 'button', label: 'Button.vue', href: '#button' }],
      },
    ],
  },
  { id: 'readme', label: 'README.md', href: '#readme' },
]
</script>

<template>
  <main :dir="direction" style="padding: 24px">
    <h1>Navigation checks</h1>
    <div class="demo-columns">
      <section>
        <h2>Side navigation</h2>
        <SideNav id="side-nav" label="Settings navigation">
          <SideNavItem href="#settings" label="Settings">
            <SideNavItem href="#general" label="General" is-selected />
            <SideNavItem href="#security" label="Security" />
          </SideNavItem>
        </SideNav>
      </section>
      <section>
        <h2>Tree list</h2>
        <TreeList :items="treeItems" label="Files" />
      </section>
    </div>
    <section style="margin-top: 24px">
      <h2>Compact pagination</h2>
      <Pagination v-model:page="page" :total-pages="10" variant="compact" has-first-last />
    </section>
    <button id="open-drawer" type="button" style="margin-top: 24px" @click="drawerOpen = true">
      Open drawer
    </button>
    <Drawer
      :is-open="drawerOpen"
      label="Details"
      :placement="placement"
      :dir="direction"
      @open-change="drawerOpen = $event"
    >
      <DrawerHeader title="Details" has-close-button @open-change="drawerOpen = $event">
        <template #startContent>0</template>
        <template #endContent>0</template>
      </DrawerHeader>
      <p>Drawer body</p>
    </Drawer>
  </main>
</template>

<style scoped>
.demo-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
@media (max-width: 640px) { .demo-columns { grid-template-columns: 1fr; } }
</style>
