<script setup lang="ts">
import { CheckboxIndicator, Icon, TextInput, Token } from '@astryx-vue/core'
import { h } from 'vue'

const SearchIcon = () => h(Icon, { icon: 'search' })
</script>

<template>
  <div class="mobile-tokenizer-overview" aria-hidden="true">
    <button class="astryx-mobile-tokenizer__trigger" type="button" tabindex="-1">
      <Token label="Design" />
      <span class="astryx-mobile-tokenizer__trigger-placeholder">Add tags</span>
    </button>
    <div class="mobile-tokenizer-overview__sheet">
      <span class="mobile-tokenizer-overview__grabber" />
      <TextInput
        model-value=""
        label="Search project tags"
        is-label-hidden
        placeholder="Search..."
        :start-icon="SearchIcon"
        width="100%"
        tabindex="-1"
      />
      <div class="mobile-tokenizer-overview__rows">
        <div class="astryx-mobile-tokenizer__row">
          <span>Design</span>
          <CheckboxIndicator state="checked" />
        </div>
        <div class="astryx-mobile-tokenizer__row">
          <span>Engineering</span>
          <CheckboxIndicator state="unchecked" />
        </div>
        <div class="astryx-mobile-tokenizer__row">
          <span>Documentation</span>
          <CheckboxIndicator state="unchecked" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-tokenizer-overview {
  display: grid;
  gap: 10px;
  width: min(100%, 300px);
}
.mobile-tokenizer-overview__sheet {
  position: relative;
  height: 164px;
  padding: 22px 12px 0;
  overflow: hidden;
  border: 1px solid var(--astryx-color-border);
  border-bottom: 0;
  border-radius: 16px 16px 0 0;
  background: var(--astryx-color-background-popover);
  box-shadow: 0 -8px 24px rgb(0 0 0 / 12%);
}
.mobile-tokenizer-overview__grabber {
  position: absolute;
  top: 7px;
  left: 50%;
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: var(--astryx-color-border-emphasized);
  transform: translateX(-50%);
}
.mobile-tokenizer-overview__rows {
  padding-top: 4px;
}
.mobile-tokenizer-overview__sheet .astryx-mobile-tokenizer__row {
  min-height: 40px;
  padding-block: 6px;
  cursor: default;
}
</style>
