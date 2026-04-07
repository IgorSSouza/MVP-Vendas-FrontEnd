export const PaymentMethod = {
  PIX: 'pix',
  CASH: 'cash',
  DEBIT_CARD: 'debit_card',
  CREDIT_CARD: 'credit_card',
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]
