import { getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'

type SalePaymentBadgeProps = {
  paymentMethod: string
}

export function SalePaymentBadge({ paymentMethod }: SalePaymentBadgeProps) {
  return (
    <span className="app-badge border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
      {getPaymentMethodLabel(paymentMethod)}
    </span>
  )
}
