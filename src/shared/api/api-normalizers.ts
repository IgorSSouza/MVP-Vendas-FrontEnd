import { PaymentMethod, SaleItemType } from '@domain/enums'

function normalizeEnumValue(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

export function normalizePaymentMethod(paymentMethod: string | number): PaymentMethod {
  if (typeof paymentMethod === 'number') {
    const paymentMethodMap: Record<number, PaymentMethod> = {
      0: PaymentMethod.PIX,
      1: PaymentMethod.CASH,
      2: PaymentMethod.DEBIT_CARD,
      3: PaymentMethod.CREDIT_CARD,
    }

    return paymentMethodMap[paymentMethod] ?? PaymentMethod.PIX
  }

  const normalizedPaymentMethod = normalizeEnumValue(paymentMethod)

  const paymentMethodMap: Record<string, PaymentMethod> = {
    pix: PaymentMethod.PIX,
    cash: PaymentMethod.CASH,
    dinheiro: PaymentMethod.CASH,
    debit_card: PaymentMethod.DEBIT_CARD,
    debitcard: PaymentMethod.DEBIT_CARD,
    cartao_de_debito: PaymentMethod.DEBIT_CARD,
    credit_card: PaymentMethod.CREDIT_CARD,
    creditcard: PaymentMethod.CREDIT_CARD,
    cartao_de_credito: PaymentMethod.CREDIT_CARD,
  }

  return paymentMethodMap[normalizedPaymentMethod] ?? PaymentMethod.PIX
}

export function normalizeSaleItemType(itemType: string | number): SaleItemType {
  if (typeof itemType === 'number') {
    const itemTypeMap: Record<number, SaleItemType> = {
      0: SaleItemType.PRODUCT,
      1: SaleItemType.SERVICE,
    }

    return itemTypeMap[itemType] ?? SaleItemType.PRODUCT
  }

  const normalizedItemType = normalizeEnumValue(itemType)

  const itemTypeMap: Record<string, SaleItemType> = {
    product: SaleItemType.PRODUCT,
    produto: SaleItemType.PRODUCT,
    service: SaleItemType.SERVICE,
    servico: SaleItemType.SERVICE,
  }

  return itemTypeMap[normalizedItemType] ?? SaleItemType.PRODUCT
}
