import { PaymentMethod } from '@domain/enums'

import { formatCurrency, getPaymentMethodLabel } from '@presentation/components/sales/sale-utils'
import { AppSelect } from '@presentation/components/shared/AppSelect'
import { CurrencyInput } from '@presentation/components/shared/CurrencyInput'
import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'

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
  const paymentOptions = Object.values(PaymentMethod).map((method) => ({
    value: method,
    label: getPaymentMethodLabel(method),
  }))

  return (
    <aside className="app-surface p-5 sm:p-6 2xl:sticky 2xl:top-6">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700/80 dark:text-cyan-300/80">
          3. Fechamento
        </p>
        <h2 className="mt-3 text-lg font-semibold text-slate-950 dark:text-slate-50">
          Finalizar venda
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Ajuste pagamento e desconto, confirme os totais e conclua a operação.
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Forma de pagamento
          </span>
          <AppSelect
            value={paymentMethod as PaymentMethod}
            onChange={onPaymentMethodChange}
            options={paymentOptions}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Desconto</span>
          <CurrencyInput value={discount} onChange={onDiscountChange} />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            O desconto é aplicado diretamente sobre o subtotal.
          </span>
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <strong className="text-slate-900 dark:text-slate-100">
              {formatCurrency(subtotal)}
            </strong>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Desconto</span>
            <strong className="text-slate-900 dark:text-slate-100">
              {formatCurrency(discount)}
            </strong>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <span>Total</span>
            <strong className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {formatCurrency(total)}
            </strong>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Lucro estimado</span>
            <strong
              className={
                profit >= 0
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-rose-600 dark:text-rose-300'
              }
            >
              {formatCurrency(profit)}
            </strong>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={() => void onSubmit()}
        className="app-button-primary mt-6 w-full rounded-2xl py-3.5"
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? <InlineSpinner className="h-4 w-4" /> : null}
          <span>{isSubmitting ? 'Finalizando venda...' : 'Finalizar venda'}</span>
        </span>
      </button>
    </aside>
  )
}
