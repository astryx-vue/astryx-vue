<script setup lang="ts">
import Kbd from '../Kbd/Kbd.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteFooter' })

const messages = useAstryxMessages()
</script>

<template>
  <div class="astryx-command-palette-footer">
    <slot>
      <span class="astryx-command-palette-hint">
        <Kbd keys="up" />
        <Kbd keys="down" />
        {{ messages.commandPalette.navigate }}
      </span>
      <span class="astryx-command-palette-hint">
        <Kbd keys="enter" />
        {{ messages.commandPalette.select }}
      </span>
      <span class="astryx-command-palette-hint">
        <Kbd keys="escape" />
        {{ messages.commandPalette.close }}
      </span>
    </slot>
  </div>
</template>
