import { PaymentMethod, SaleItemType } from '@domain/enums'
export { formatCurrency, formatDateTime } from '@shared/utils/formatters'

export function getPaymentMethodLabel(paymentMethod: string) {
  const labels: Record<string, string> = {
    [PaymentMethod.PIX]: 'Pix',
    [PaymentMethod.CASH]: 'Dinheiro',
    [PaymentMethod.DEBIT_CARD]: 'Cartao de debito',
    [PaymentMethod.CREDIT_CARD]: 'Cartao de credito',
  }

  return labels[paymentMethod] ?? paymentMethod
}

export function getItemTypeLabel(itemType: string) {
  return itemType === SaleItemType.PRODUCT ? 'Produto' : 'Servico'
}
