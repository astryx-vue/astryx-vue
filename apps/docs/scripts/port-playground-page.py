#!/usr/bin/env python3
"""Mechanical React page.tsx → Vue SFC (layout/forms). Charts need manual follow-up."""
from __future__ import annotations

import pathlib
import re
import sys

SRC = pathlib.Path('/tmp/astryx-original/packages/cli/assets/templates/pages')
OUT = pathlib.Path('/workspace/apps/docs/components/playground/pages')

CORE_IMPORTS = {
    'Layout', 'LayoutContent', 'LayoutHeader', 'LayoutFooter', 'LayoutPanel',
    'VStack', 'HStack', 'Stack', 'StackItem', 'Grid', 'GridSpan', 'Center', 'Section',
    'Text', 'Heading', 'Button', 'Card', 'Divider', 'Link', 'Icon', 'Badge', 'Token',
    'TextInput', 'TextArea', 'Selector', 'CheckboxInput', 'RadioList', 'RadioListItem',
    'NumberInput', 'Banner', 'Collapsible', 'Thumbnail', 'FormLayout', 'Field',
    'CheckboxList', 'CheckboxListItem', 'SelectableCard', 'MetadataList', 'MetadataListItem',
    'Switch', 'Step', 'Stepper', 'Dialog', 'DropdownMenu', 'List', 'ListItem', 'Avatar',
    'ProgressBar', 'Timestamp', 'EmptyState', 'HoverCard', 'StatusDot', 'SegmentedControl',
    'SegmentedControlItem', 'Table', 'pixel', 'proportional', 'AspectRatio', 'useMediaQuery',
}

PROP_MAP = {
    'hasDivider': 'has-divider',
    'isLabelHidden': 'is-label-hidden',
    'isScrollable': 'is-scrollable',
    'defaultIsOpen': 'default-is-open',
    'contentWidth': 'content-width',
    'hAlign': 'h-align',
    'vAlign': 'v-align',
    'textWrap': 'text-wrap',
    'maxWidth': 'max-width',
    'paddingBlock': 'padding-block',
    'isIntegerOnly': 'is-integer-only',
    'labelTooltip': 'label-tooltip',
    'controlStyle': 'control-style',
    'endContent': 'end-content',
    'startContent': 'start-content',
    'accessibilityLevel': 'accessibility-level',
    'hasChevron': 'has-chevron',
    'hasHover': 'has-hover',
    'hasDividers': 'has-dividers',
    'idKey': 'id-key',
    'isPulsing': 'is-pulsing',
    'focusTrigger': 'focus-trigger',
}


def extract_function_body(tsx: str) -> str:
    m = re.search(r'export default function \w+\(\) \{([\s\S]*)\}\s*$', tsx)
    return m.group(1) if m else ''


def extract_return_jsx(body: str) -> str:
    m = re.search(r'return\s*\(([\s\S]*)\);\s*$', body.strip())
    return m.group(1).strip() if m else ''


def jsx_to_template(jsx: str) -> str:
    s = jsx
    s = re.sub(r'\{/\*.*?\*/\}', '', s, flags=re.S)
    s = s.replace('&&', 'v-if-placeholder-and')
    s = re.sub(r'\{!(\w+)\s*&&\s*\(', r'<template v-if="!\1">', s)
    s = re.sub(r'\{(\w+)\s*&&\s*\(', r'<template v-if="\1">', s)
    s = s.replace(')}', '</template>')
    s = re.sub(r'onChange=\{set(\w+)\}', r'v-model="\1Lower"', s)
    s = re.sub(r'onChange=\{([^}]+)\}', r'@update:model-value="\1"', s)
    s = re.sub(r'onClick=\{([^}]+)\}', r'@click="\1"', s)
    s = re.sub(r'value=\{([^}]+)\}', r':model-value="\1"', s)
    for camel, kebab in PROP_MAP.items():
        s = re.sub(rf'\b{camel}=\{', f'{kebab}="', s)
        s = re.sub(rf'\b{camel}=\{', f':{kebab}="', s)
    s = re.sub(r'(\w+)=\{([^}]+)\}', r':\1="\2"', s)
    s = re.sub(r'(\w+)="([^"]*)"', r'\1="\2"', s)
    s = s.replace('v-if-placeholder-and', '&&')
    s = re.sub(r'<(\w+)', lambda m: f'<{m.group(1)}', s)
    s = s.replace('</>', '')
    s = re.sub(r'<Fragment[^>]*>', '', s)
    s = re.sub(r'</Fragment>', '', s)
    return s


def port_slug(slug: str) -> None:
    tsx_path = SRC / slug / 'page.tsx'
    tsx = tsx_path.read_text()
    pre = tsx.split('export default function')[0]
    pre = re.sub(r"'use client';\s*", '', pre)
    pre = re.sub(r"import \{[^}]+\} from 'react';\s*", '', pre)
    pre = re.sub(r"import \* as stylex from '@stylexjs/stylex';\s*", '', pre)
    pre = re.sub(r"import type \{[^}]+\} from 'react';\s*", '', pre)
    pre = re.sub(r"import \{[^}]+\} from '@heroicons[^']+';\s*", '', pre, flags=re.M)
    pre = re.sub(r"import \{[^}]+\} from '@astryxdesign/core[^']*';\s*", '', pre, flags=re.M)
    pre = re.sub(r"import type \{[^}]+\} from '@astryxdesign/core[^']*';\s*", '', pre, flags=re.M)

    body = extract_function_body(tsx)
    states = re.findall(r'const \[(\w+),\s*set\w+\]\s*=\s*useState(?:<[^>]+>)?\(([^)]*)\)', body)
    refs = '\n'.join(f'const {name} = ref({init})' for name, init in states)
    refs = refs.replace('useState', 'ref')

    const_block = pre
    const_block = re.sub(r'\buseMemo\b', 'computed', const_block)
    const_block = re.sub(r'useMediaQuery\(', 'useMediaQuery(', const_block)

    imports = sorted(CORE_IMPORTS)
    import_line = f"import {{ {', '.join(imports)} }} from '@astryx-vue/core'"
    script = f"""<script setup lang="ts">
import type {{ CSSProperties }} from 'vue'
import {{ computed, ref }} from 'vue'
{import_line}

{const_block}

{refs}

const submitted = ref(false)
</script>

<template>
  <Text type="body">Automated port for {slug} — needs manual template conversion.</Text>
</template>
"""
    out = OUT / f'{slug}.vue'
    out.write_text(script)
    print('wrote', out, len(script))


if __name__ == '__main__':
    for slug in sys.argv[1:]:
        port_slug(slug)
