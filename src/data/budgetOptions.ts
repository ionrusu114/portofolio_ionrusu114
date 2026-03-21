import type { BudgetOption } from '@/types'

export const budgetOptions: BudgetOption[] = [
  { id: 'starter', label: '3,000 - 5,000', range: [3000, 5000], currency: 'EUR' },
  { id: 'standard', label: '5,000 - 10,000', range: [5000, 10000], currency: 'EUR' },
  { id: 'premium', label: '10,000 - 25,000', range: [10000, 25000], currency: 'EUR' },
  { id: 'enterprise', label: '25,000+', range: [25000, 100000], currency: 'EUR' },
  { id: 'custom', label: 'Custom Budget', range: null, currency: 'EUR' },
]
