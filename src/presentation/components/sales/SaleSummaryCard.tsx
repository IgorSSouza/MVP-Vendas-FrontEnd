import { PaymentMethod } from '@domain/enums'

import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'
import { formatCurrency, getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'

type SaleSummaryCardProps = {
  discount: number
  subtotal: number
  total: number
  profit: number
  paymentMethod: string
  isSubmitting: boolean
  canSubmit: boolean
  onDiscountChange: (discount: number) => void
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void
  onSubmit: () => Promise<void>
}

export function SaleSummaryCard({
  discount,
  subtotal,
  total,
  profit,
  paymentMethod,
  isSubmitting,
  canSubmit,
  onDiscountChange,
  onPaymentMethodChange,
  onSubmit,
}: SaleSummaryCardProps) {
  return (
    <aside className="app-surface p-6">
      <h2 className="text-lg font-semibold text-slate-950">Resumo da venda</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Revise os valores e finalize a operação.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Forma de pagamento</span>
          <select
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(event.target.value as PaymentMethod)
            }
            className="app-select"
          >
            {Object.values(PaymentMethod).map((method) => (
              <option key={method} value={method}>
                {getPaymentMethodLabel(method)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Desconto</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(event) => onDiscountChange(Number(event.target.value))}
            className="app-input"
          />
        </label>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <strong className="text-slate-900">{formatCurrency(subtotal)}</strong>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Desconto</span>
          <strong className="text-slate-900">{formatCurrency(discount)}</strong>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm text-slate-600">
          <span>Total</span>
          <strong className="text-lg text-slate-950">{formatCurrency(total)}</strong>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Lucro estimado</span>
          <strong className={profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
            {formatCurrency(profit)}
          </strong>
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={() => void onSubmit()}
        className="app-button-primary mt-6 w-full"
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? <InlineSpinner className="h-4 w-4" /> : null}
          <span>{isSubmitting ? 'Finalizando venda...' : 'Finalizar venda'}</span>
        </span>
      </button>
    </aside>
  )
}
