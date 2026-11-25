<script setup lang="ts">
import Kbd from '../Kbd/Kbd.vue'
import { useComponentMessages } from '../locale/context.js'
import { commandPaletteMessages } from '../locale/messages/command-palette.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteFooter' })

const messages = useComponentMessages({ commandPalette: commandPaletteMessages })
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
