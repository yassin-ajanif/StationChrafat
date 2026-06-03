export interface PaymentSplit {
  cash: number;
  tpe: number;
  bons: number;
}

export function emptyPaymentSplit(): PaymentSplit {
  return { cash: 0, tpe: 0, bons: 0 };
}

export function computePaymentTotal(payments: PaymentSplit): number {
  return payments.cash + payments.tpe + payments.bons;
}

export function computePaymentDifference(payments: PaymentSplit, expectedAmount: number): number {
  return computePaymentTotal(payments) - expectedAmount;
}

export function paymentDifferenceLabel(difference: number): string {
  if (difference === 0) {
    return 'Équilibré';
  }
  return difference > 0 ? 'Surplus' : 'Manque';
}

/** True when encaissements saisis = montant attendu (tolérance centimes). */
export function isPaymentSplitBalanced(
  payments: PaymentSplit,
  expectedAmount: number,
): boolean {
  return Math.abs(computePaymentDifference(payments, expectedAmount)) < 0.005;
}
