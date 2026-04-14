import { PaymentMethod, SaleItemType } from '@domain/enums'
import { formatCurrency, formatDateTime } from '@shared/utils/formatters'

export { formatCurrency, formatDateTime }

export function getPaymentMethodLabel(paymentMethod: string) {
  const labels: Record<string, string> = {
    [PaymentMethod.PIX]: 'Pix',
    [PaymentMethod.CASH]: 'Dinheiro',
    [PaymentMethod.DEBIT_CARD]: 'Cartão de débito',
    [PaymentMethod.CREDIT_CARD]: 'Cartão de crédito',
  }

  return labels[paymentMethod] ?? paymentMethod
}

export function getInstallmentLabel(installments: number, installmentAmount: number) {
  if (installments <= 1) {
    return null
  }

  return `${installments}x de ${formatCurrency(installmentAmount)}`
}

export function getItemTypeLabel(itemType: string) {
  return itemType === SaleItemType.PRODUCT ? 'Produto' : 'Serviço'
}
