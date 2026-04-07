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
      className="app-input"
    />
  )
}
