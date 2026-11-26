<script setup lang="ts">
import { ref } from 'vue'
import BottomSheet from '../../packages/core/src/BottomSheet/BottomSheet.vue'
import BottomSheetSwitcher from '../../packages/core/src/BottomSheet/BottomSheetSwitcher.vue'
import CodeBlock from '../../packages/core/src/Code/CodeBlock.vue'
import ComplexSelector from '../../packages/core/src/ComplexSelector/ComplexSelector.vue'
import List from '../../packages/core/src/List/List.vue'
import ListItem from '../../packages/core/src/List/ListItem.vue'
import Markdown from '../../packages/core/src/Markdown/Markdown.vue'
import MultiSelector from '../../packages/core/src/MultiSelector/MultiSelector.vue'
import Selector from '../../packages/core/src/Selector/Selector.vue'

const activeSheet = ref<string | null>(null)
const hasScrim = ref(true)
const single = ref<string | null>(null)
const multiple = ref<string[]>([])
const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]
const markdown = '99. Ninety-nine\n100. Hundred\n101. Hundred one'
</script>

<template>
  <main style="padding: 24px">
    <h1>Content and overlay checks</h1>
    <section>
      <h2>Disabled selectors</h2>
      <button id="tab-start" type="button">Start</button>
      <Selector v-model="single" label="Single" :options="options" disabled disabled-message="Unavailable" />
      <MultiSelector v-model="multiple" label="Multiple" :options="options" disabled disabled-message="Unavailable" />
      <ComplexSelector v-model="single" label="Complex" :options="options" is-disabled disabled-message="Unavailable" />
    </section>
    <section>
      <h2>Markdown counters</h2>
      <Markdown id="markdown-counters" :content="markdown" />
      <List id="component-counters" list-style="decimal" :start="99">
        <ListItem label="Nine" />
        <ListItem label="Ten" />
        <ListItem label="Hundred" />
      </List>
    </section>
    <section>
      <h2>Code highlighting</h2>
      <CodeBlock code="const ready = true" language="typescript" />
    </section>
    <section>
      <h2>Bottom sheet switcher</h2>
      <button id="open-flow" type="button" @click="activeSheet = 'details'">Open flow</button>
      <button id="toggle-scrim" type="button" @click="hasScrim = !hasScrim">Toggle scrim</button>
      <button id="outside-action" type="button">Outside action</button>
      <BottomSheetSwitcher
        v-model:active-sheet="activeSheet"
        label="Checkout"
        :has-scrim="hasScrim"
      >
        <BottomSheet sheet-id="details" label="Details">
          <button id="continue-flow" type="button" @click="activeSheet = 'pay'">Continue</button>
        </BottomSheet>
        <BottomSheet sheet-id="pay" label="Pay">
          <button id="finish-flow" type="button" @click="activeSheet = null">Finish</button>
        </BottomSheet>
      </BottomSheetSwitcher>
    </section>
  </main>
</template>
