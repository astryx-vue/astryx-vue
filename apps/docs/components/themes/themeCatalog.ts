import type { BadgeVariant } from '@astryx-vue/core/Badge'
import '@astryx-vue/themes/butter.css'
import '@astryx-vue/themes/chocolate.css'
import '@astryx-vue/themes/gothic.css'
import '@astryx-vue/themes/matcha.css'
import '@astryx-vue/themes/neutral.css'
import '@astryx-vue/themes/stone.css'
import '@astryx-vue/themes/y2k.css'

export const themeIds = ['neutral', 'butter', 'chocolate', 'gothic', 'matcha', 'stone', 'y2k'] as const

export type ThemeId = typeof themeIds[number]

export interface ThemeProduct {
  name: string
  copy: string
  badge: string
  image: string
}

export interface ThemeStock extends Record<string, unknown> {
  id: string
  item: string
  detail: string
  available: number
  location: string
  tags: string
  image: string
}

interface ThemeEntry {
  id: ThemeId
  label: string
  picker: string
  products: ThemeProduct[]
  stock: ThemeStock[]
}

const badgeVariants: Record<string, BadgeVariant> = {
  'New': 'blue',
  'Popular': 'green',
  'Limited': 'orange',
  'Fresh': 'yellow',
  'Classic': 'neutral',
  'Staple': 'yellow',
  'Retro': 'purple',
  'Seasonal': 'pink',
  'Spring': 'pink',
  'Small batch': 'purple',
  'Smooth': 'teal',
  'Rich': 'orange',
  'Bold': 'red',
  'Tableware': 'neutral',
  'Kitchen': 'cyan',
  'Cute': 'pink',
  'Leather': 'orange',
  'Drinkware': 'teal',
  'Home': 'orange',
  'Pantry': 'yellow',
  'Coffee': 'orange',
  'Cozy': 'red',
}

export function badgeVariant(tag: string): BadgeVariant {
  return badgeVariants[tag] ?? 'neutral'
}

function neutralImage(slot: 'Watch' | 'Headphones' | 'Backpack' | 'Wallet' | 'Tumbler' | 'Blanket'): string {
  return `https://astryx.atmeta.com/template-assets/Neutral-${slot}.png`
}

function themedImage(theme: string, slot: 'watch' | 'headphones' | 'backpack' | 'wallet' | 'tumbler' | 'throw'): string {
  return `https://astryx.atmeta.com/images/${theme}/preview-${slot}.png`
}

function picker(theme: string): string {
  return `https://astryx.atmeta.com/images/theme-${theme}-picker.png`
}

function stock(
  item: string,
  detail: string,
  available: number,
  location: string,
  tags: string,
  image: string,
): ThemeStock {
  return { id: item, item, detail, available, location, tags, image }
}

const catalog: ThemeEntry[] = [
  {
    id: 'neutral',
    label: 'Neutral',
    picker: picker('neutral'),
    products: [
      { name: 'Minimalist Watch', copy: 'Clean design meets everyday durability.', badge: 'New', image: neutralImage('Watch') },
      { name: 'Wireless Headphones', copy: 'Immersive sound, all-day comfort.', badge: 'Popular', image: neutralImage('Headphones') },
      { name: 'Canvas Backpack', copy: 'Water-resistant canvas with a quiet, modern profile.', badge: 'Limited', image: neutralImage('Backpack') },
    ],
    stock: [
      stock('Minimalist Watch', 'Stainless steel, sapphire crystal', 42, 'Aisle 3', 'New', neutralImage('Watch')),
      stock('Wireless Headphones', 'ANC, 30hr battery', 128, 'Aisle 1', 'Popular', neutralImage('Headphones')),
      stock('Canvas Backpack', 'Water-resistant, 25L', 63, 'Aisle 2', 'Limited', neutralImage('Backpack')),
      stock('Leather Wallet', 'Full-grain, RFID blocking', 15, 'Aisle 4', 'Leather', neutralImage('Wallet')),
      stock('Travel Tumbler', 'Vacuum insulated, 16oz', 87, 'Aisle 5', 'Drinkware', neutralImage('Tumbler')),
      stock('Linen Throw', 'Heavyweight, oat', 24, 'Aisle 6', 'Home', neutralImage('Blanket')),
    ],
  },
  {
    id: 'butter',
    label: 'Butter',
    picker: picker('butter'),
    products: [
      { name: 'Butter Croissant', copy: 'Flaky, laminated layers baked golden each morning.', badge: 'Fresh', image: themedImage('butter', 'watch') },
      { name: 'Pancakes', copy: 'Stacked tall with a melting pat of butter.', badge: 'Popular', image: themedImage('butter', 'headphones') },
      { name: 'Belgian Waffle', copy: 'Deep pockets made for syrup and butter.', badge: 'New', image: themedImage('butter', 'backpack') },
    ],
    stock: [
      stock('Butter Croissant', 'All-butter, 27 layers', 64, 'Case 1', 'Fresh', themedImage('butter', 'watch')),
      stock('Pancakes', 'Stack of three', 38, 'Griddle', 'Popular', themedImage('butter', 'headphones')),
      stock('Belgian Waffle', 'Liège style, pearl sugar', 51, 'Griddle', 'New', themedImage('butter', 'backpack')),
      stock('Buttered Toast', 'Sourdough, thick cut', 12, 'Case 2', 'Classic', themedImage('butter', 'wallet')),
      stock('Cultured Butter', 'European style, salted', 27, 'Cooler', 'Staple', themedImage('butter', 'tumbler')),
      stock('Almond Croissant', 'Frangipane filled', 19, 'Case 1', 'Limited', themedImage('butter', 'throw')),
    ],
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    picker: '',
    products: [
      { name: 'Cocoa Bar', copy: 'Single-origin dark chocolate, snapped into squares.', badge: 'New', image: '' },
      { name: 'Drinking Chocolate', copy: 'Thick, whisked, and poured warm.', badge: 'Popular', image: '' },
      { name: 'Brownie', copy: 'Fudgy center with a crackled top.', badge: 'Limited', image: '' },
    ],
    stock: [
      stock('Cocoa Bar', 'Single origin, 70%', 42, 'Shelf 1', 'New', ''),
      stock('Drinking Chocolate', 'Whisked, 40g tin', 128, 'Shelf 2', 'Popular', ''),
      stock('Brownie', 'Fudgy, crackled top', 63, 'Case 1', 'Limited', ''),
      stock('Cocoa Nibs', 'Roasted, 200g', 15, 'Shelf 3', 'Pantry', ''),
      stock('Mocha Beans', 'Washed, 250g', 87, 'Shelf 2', 'Coffee', ''),
      stock('Hot Cocoa Mix', 'Just add milk', 24, 'Shelf 1', 'Cozy', ''),
    ],
  },
  {
    id: 'gothic',
    label: 'Gothic',
    picker: picker('gothic'),
    products: [
      { name: 'Sea Holly', copy: 'A single preserved thistle stem with a steely bloom.', badge: 'New', image: themedImage('gothic', 'watch') },
      { name: 'Garden Rose', copy: 'One peach bloom, cut fresh each morning.', badge: 'Popular', image: themedImage('gothic', 'headphones') },
      { name: 'Ranunculus', copy: 'Layered petals in a soft mauve.', badge: 'Limited', image: themedImage('gothic', 'backpack') },
    ],
    stock: [
      stock('Sea Holly', 'Preserved, single stem', 64, 'Cooler 1', 'New', themedImage('gothic', 'watch')),
      stock('Garden Rose', 'Fresh cut, peach', 38, 'Cooler 2', 'Popular', themedImage('gothic', 'headphones')),
      stock('Ranunculus', 'Fresh cut, mauve', 51, 'Cooler 2', 'Limited', themedImage('gothic', 'backpack')),
      stock('Coral Poppy', 'Fresh cut, single stem', 15, 'Cooler 3', 'Seasonal', themedImage('gothic', 'wallet')),
      stock('Pink Tulip', 'Fresh cut, single stem', 27, 'Cooler 2', 'Spring', themedImage('gothic', 'tumbler')),
      stock('Dried Nigella Pods', 'Preserved, branch', 19, 'Cooler 1', 'Small batch', themedImage('gothic', 'throw')),
    ],
  },
  {
    id: 'matcha',
    label: 'Matcha',
    picker: picker('matcha'),
    products: [
      { name: 'Matcha', copy: 'Stone-ground ceremonial matcha over cold milk.', badge: 'Classic', image: themedImage('matcha', 'watch') },
      { name: 'Strawberry Matcha', copy: 'Fresh strawberry purée layered with bright matcha.', badge: 'Seasonal', image: themedImage('matcha', 'headphones') },
      { name: 'Ube Matcha', copy: 'Creamy ube and matcha for a sweet, earthy swirl.', badge: 'New', image: themedImage('matcha', 'backpack') },
    ],
    stock: [
      stock('Matcha', 'Ceremonial grade, oat or whole', 64, 'Bar 1', 'Classic', themedImage('matcha', 'watch')),
      stock('Strawberry Matcha', 'Real fruit purée, no syrup', 38, 'Bar 2', 'Seasonal', themedImage('matcha', 'headphones')),
      stock('Ube Matcha', 'Ube cream, double shot', 51, 'Bar 2', 'New', themedImage('matcha', 'backpack')),
      stock('Vanilla Matcha', 'Madagascar vanilla bean', 12, 'Bar 3', 'Smooth', themedImage('matcha', 'wallet')),
      stock('Hazelnut Matcha', 'Toasted hazelnut, whipped top', 27, 'Bar 3', 'Rich', themedImage('matcha', 'tumbler')),
      stock('Matcha Mocha', 'Dark chocolate, single origin', 19, 'Bar 4', 'Bold', themedImage('matcha', 'throw')),
    ],
  },
  {
    id: 'stone',
    label: 'Stone',
    picker: picker('stone'),
    products: [
      { name: 'Speckled Bowl', copy: 'Hand-thrown stoneware with a raw clay foot.', badge: 'New', image: themedImage('stone', 'watch') },
      { name: 'Ceramic Cup', copy: 'Everyday cup and saucer with a tactile finish.', badge: 'Popular', image: themedImage('stone', 'headphones') },
      { name: 'Stoneware Plate', copy: 'Reactive matte glaze in a soft olive tone.', badge: 'Limited', image: themedImage('stone', 'backpack') },
    ],
    stock: [
      stock('Speckled Bowl', 'Stoneware, 16cm', 64, 'Shelf 1', 'New', themedImage('stone', 'watch')),
      stock('Ceramic Cup', 'Cup + saucer, 8oz', 38, 'Shelf 2', 'Popular', themedImage('stone', 'headphones')),
      stock('Stoneware Plate', 'Reactive glaze, 22cm', 51, 'Shelf 1', 'Limited', themedImage('stone', 'backpack')),
      stock('Serving Bowl', 'Two-tone, 24cm', 15, 'Shelf 3', 'Tableware', themedImage('stone', 'wallet')),
      stock('Stoneware Teapot', 'Matte clay, 700ml', 27, 'Shelf 2', 'Kitchen', themedImage('stone', 'tumbler')),
      stock('Bud Vase', 'Olive glaze, 18cm', 19, 'Shelf 1', 'Small batch', themedImage('stone', 'throw')),
    ],
  },
  {
    id: 'y2k',
    label: 'Y2K',
    picker: picker('y2k'),
    products: [
      { name: 'Phone', copy: 'Iridescent clamshell with a rainbow screen.', badge: 'Retro', image: themedImage('y2k', 'watch') },
      { name: 'Glow Star Set', copy: 'Glow-in-the-dark stars, pack of three.', badge: 'Popular', image: themedImage('y2k', 'headphones') },
      { name: 'Butterfly', copy: 'Sparkly stick-on in pastel chrome.', badge: 'New', image: themedImage('y2k', 'backpack') },
    ],
    stock: [
      stock('Phone', 'Iridescent, rainbow LCD', 64, 'Bin 1', 'Retro', themedImage('y2k', 'watch')),
      stock('Glow Star Set', 'Glow-in-the-dark, pack of 3', 38, 'Bin 2', 'Popular', themedImage('y2k', 'headphones')),
      stock('Butterfly', 'Stick-on, pastel chrome', 51, 'Bin 2', 'New', themedImage('y2k', 'backpack')),
      stock('Puffy Heart Charm', 'Squishy, holo finish', 12, 'Bin 3', 'Classic', themedImage('y2k', 'wallet')),
      stock('Daisy Charm', 'Holographic, clip-on', 27, 'Bin 3', 'Cute', themedImage('y2k', 'tumbler')),
      stock('Inflatable Couch', 'Transparent pink, 2-seater', 19, 'Bin 1', 'Limited', themedImage('y2k', 'throw')),
    ],
  },
]

export const themeCatalog = catalog

export function themeEntry(id: ThemeId): ThemeEntry {
  const entry = catalog.find(item => item.id === id)
  if (!entry)
    throw new Error(`Unknown theme: ${id}`)
  return entry
}
