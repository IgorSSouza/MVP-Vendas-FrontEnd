import type { SaleStatus } from '@domain/entities/Sale'
import { getSaleStatusLabel } from '@presentation/components/sales/sale-utils'

type SaleStatusBadgeProps = {
  status: SaleStatus
}

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  const isReversed = status === 'reversed'

  return (
    <span
      className={[
        'app-badge',
        isReversed
          ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
      ].join(' ')}
    >
      {getSaleStatusLabel(status)}
    </span>
  )
}
