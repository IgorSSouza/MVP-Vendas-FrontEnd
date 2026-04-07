export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 0
  }

  return Number(digits) / 100
}
