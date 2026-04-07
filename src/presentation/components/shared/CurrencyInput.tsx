import { formatCurrency, parseCurrencyInput } from '@shared/utils/formatters'

type CurrencyInputProps = {
  id?: string
  name?: string
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  placeholder?: string
}

export function CurrencyInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
}: CurrencyInputProps) {
  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      value={formatCurrency(value ?? 0)}
      onChange={(event) => onChange(parseCurrencyInput(event.target.value))}
      onBlur={onBlur}
      placeholder={placeholder}
      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
    />
  )
}
