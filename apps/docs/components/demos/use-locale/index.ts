import { defineDemo } from '../../demo-infra/defineDemo'
import invoiceSummaryDemo from './invoice-summary.vue'
import invoiceSummarySource from './invoice-summary.vue?raw&highlighted'

export const useLocaleInvoiceSummary = defineDemo(invoiceSummaryDemo, invoiceSummarySource)
