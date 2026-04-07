import { PaymentMethod, SaleItemType } from '@domain/enums'

export { formatCurrency, formatDateTime } from '@shared/utils/formatters'

export function getPaymentMethodLabel(paymentMethod: string) {
  const labels: Record<string, string> = {
    [PaymentMethod.PIX]: 'Pix',
    [PaymentMethod.CASH]: 'Dinheiro',
    [PaymentMethod.DEBIT_CARD]: 'Cartão de débito',
    [PaymentMethod.CREDIT_CARD]: 'Cartão de crédito',
  }

  return labels[paymentMethod] ?? paymentMethod
}

export function getItemTypeLabel(itemType: string) {
  return itemType === SaleItemType.PRODUCT ? 'Produto' : 'Serviço'
}
