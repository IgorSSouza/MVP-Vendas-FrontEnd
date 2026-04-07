import { PaymentMethod } from '@domain/enums'

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
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Resumo da venda</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Revise os valores e finalize a operacao.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Forma de pagamento</span>
          <select
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(event.target.value as PaymentMethod)
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
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
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
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
        className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Finalizando venda...' : 'Finalizar venda'}
      </button>
    </aside>
  )
}
