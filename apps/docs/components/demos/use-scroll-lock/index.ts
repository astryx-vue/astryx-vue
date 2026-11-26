import { defineDemo } from '../../demo-infra/defineDemo'
import mobileMenuDemo from './mobile-menu.vue'
import mobileMenuSource from './mobile-menu.vue?raw&highlighted'

export const useScrollLockMobileMenu = defineDemo(mobileMenuDemo, mobileMenuSource)
