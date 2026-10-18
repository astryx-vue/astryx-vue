import { defineDemo } from '../../demo-infra/defineDemo'
import rowsDemo from './rows.vue'
import rowsSource from './rows.vue?raw&highlighted'

export const useContainerRevealRows = defineDemo(rowsDemo, rowsSource)
