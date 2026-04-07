import { getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'

type SalePaymentBadgeProps = {
  paymentMethod: string
}

export function SalePaymentBadge({ paymentMethod }: SalePaymentBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
      {getPaymentMethodLabel(paymentMethod)}
    </span>
  )
}
