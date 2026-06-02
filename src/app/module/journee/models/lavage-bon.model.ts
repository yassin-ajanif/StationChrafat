import {
  PaymentSplit,
  computePaymentDifference,
  computePaymentTotal,
  emptyPaymentSplit,
  paymentDifferenceLabel,
} from './payment-split.model';

export interface LavageConsumedProduct {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface LavageBonServiceLine {
  id: number;
  washType: string;
  amount: number;
}

/** Bon lavage avec services et produits consommés au niveau du bon. */
export interface LavageBon {
  id: number;
  bonNumber: string;
  clientRef: string;
  chefVidangeLavageId: number;
  lines: LavageBonServiceLine[];
  consumedProducts: LavageConsumedProduct[];
  payments: PaymentSplit;
}

export const LAVAGE_WASH_TYPES = ['Complet', 'Express', 'Chassis', 'Intérieur'] as const;

export type LavageWashType = (typeof LAVAGE_WASH_TYPES)[number];

export const LAVAGE_CONSUMABLE_PRODUCTS = [
  'Shampoing',
  'Cire',
  'Nettoyant jantes',
  'Dégraissant',
  'Polish',
  'Désodorisant',
] as const;

export type LavageConsumableProduct = (typeof LAVAGE_CONSUMABLE_PRODUCTS)[number];

export interface LavageBonDraftInput {
  bonNumber: string;
  clientRef: string;
  chefVidangeLavageId: number;
  lines: Pick<LavageBonServiceLine, 'washType' | 'amount'>[];
  consumedProducts: LavageConsumedProduct[];
  payments: PaymentSplit;
}

export interface LavageServiceTableRow {
  id: number;
  washType: string;
  amount: number | null;
}

export interface LavageProductTableRow {
  id: number;
  productName: string;
  quantity: number | null;
  unitPrice: number | null;
}

export function consumedProductLineAmount(product: LavageConsumedProduct): number {
  return product.quantity * product.unitPrice;
}

export function parseConsumedProducts(
  rows: { productName: string; quantity: number | null; unitPrice: number | null }[],
): LavageConsumedProduct[] {
  return rows
    .filter(
      (row) =>
        row.productName.trim().length > 0 &&
        row.quantity != null &&
        row.quantity > 0 &&
        !Number.isNaN(row.quantity) &&
        row.unitPrice != null &&
        row.unitPrice > 0 &&
        !Number.isNaN(row.unitPrice),
    )
    .map((row) => ({
      productName: row.productName.trim(),
      quantity: row.quantity!,
      unitPrice: row.unitPrice!,
    }));
}

export function filledServiceRows(rows: LavageServiceTableRow[]): LavageServiceTableRow[] {
  return rows.filter(
    (row) =>
      row.washType.trim().length > 0 &&
      row.amount != null &&
      row.amount > 0 &&
      !Number.isNaN(row.amount),
  );
}

export function filledProductRows(rows: LavageProductTableRow[]): LavageProductTableRow[] {
  return rows.filter(
    (row) =>
      row.productName.trim().length > 0 &&
      row.quantity != null &&
      row.quantity > 0 &&
      !Number.isNaN(row.quantity) &&
      row.unitPrice != null &&
      row.unitPrice > 0 &&
      !Number.isNaN(row.unitPrice),
  );
}

export function buildLavageBonDraft(
  serviceRows: LavageServiceTableRow[],
  productRows: LavageProductTableRow[],
): Pick<LavageBonDraftInput, 'lines' | 'consumedProducts'> {
  return {
    lines: filledServiceRows(serviceRows).map((row) => ({
      washType: row.washType.trim(),
      amount: row.amount!,
    })),
    consumedProducts: parseConsumedProducts(productRows),
  };
}

export function isLavageBonTablesValid(input: {
  bonNumber: string;
  chefVidangeLavageId: number | null;
  serviceRows: LavageServiceTableRow[];
  productRows: LavageProductTableRow[];
}): boolean {
  if (input.bonNumber.trim().length === 0) {
    return false;
  }
  if (input.chefVidangeLavageId == null) {
    return false;
  }
  if (filledServiceRows(input.serviceRows).length === 0) {
    return false;
  }
  return input.productRows.every((row) => {
    const hasProduct = row.productName.trim().length > 0;
    const hasQty = row.quantity != null && row.quantity > 0 && !Number.isNaN(row.quantity);
    const hasPrice =
      row.unitPrice != null && row.unitPrice > 0 && !Number.isNaN(row.unitPrice);
    const isEmpty =
      !hasProduct &&
      (row.quantity == null || row.quantity === 0) &&
      (row.unitPrice == null || row.unitPrice === 0);
    if (isEmpty) {
      return true;
    }
    return hasProduct && hasQty && hasPrice;
  });
}

export function productTableQtyTotal(rows: LavageProductTableRow[]): number {
  return filledProductRows(rows).reduce((sum, row) => sum + row.quantity!, 0);
}

export function productTableAmountTotal(rows: LavageProductTableRow[]): number {
  return filledProductRows(rows).reduce(
    (sum, row) => sum + row.quantity! * row.unitPrice!,
    0,
  );
}

export function serviceTableTotal(rows: LavageServiceTableRow[]): number {
  return filledServiceRows(rows).reduce((sum, row) => sum + row.amount!, 0);
}

export function computeDraftBonTotal(
  serviceRows: LavageServiceTableRow[],
  productRows: LavageProductTableRow[],
): number {
  return serviceTableTotal(serviceRows) + productTableAmountTotal(productRows);
}

export function computeBonServicesAmount(bon: LavageBon): number {
  return bon.lines.reduce((sum, line) => sum + (line.amount > 0 ? line.amount : 0), 0);
}

export function computeBonProductsAmount(bon: LavageBon): number {
  return bon.consumedProducts.reduce(
    (sum, product) => sum + consumedProductLineAmount(product),
    0,
  );
}

export function computeBonTotal(bon: LavageBon): number {
  return computeBonServicesAmount(bon) + computeBonProductsAmount(bon);
}

export function computeBonConsumedQty(bon: LavageBon): number {
  return bon.consumedProducts.reduce((sum, product) => sum + product.quantity, 0);
}

export function computeLavageBonsTotal(bons: LavageBon[]): number {
  return bons.reduce((sum, bon) => sum + computeBonTotal(bon), 0);
}

export function canProceedLavageStep(_bons: LavageBon[]): boolean {
  return true;
}

export function suggestNextLavageBonNumber(
  existing: Pick<LavageBon, 'bonNumber'>[],
): string {
  const max = existing.reduce((acc, bon) => {
    const match = bon.bonNumber.match(/LAV-(\d+)/i);
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, 8800);
  return `LAV-${max + 1}`;
}

export { emptyPaymentSplit, computePaymentTotal, computePaymentDifference, paymentDifferenceLabel };
