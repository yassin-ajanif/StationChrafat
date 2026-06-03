import {
  PaymentSplit,
  computePaymentDifference,
  computePaymentTotal,
  emptyPaymentSplit,
  paymentDifferenceLabel,
} from './payment-split.model';

export interface VidangeConsumedProduct {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface VidangeBonServiceLine {
  id: number;
  serviceType: string;
  amount: number;
}

/** Bon vidange avec services et produits consommés au niveau du bon. */
export interface VidangeBon {
  id: number;
  bonNumber: string;
  vehicleRef: string;
  chefVidangeLavageId: number;
  lines: VidangeBonServiceLine[];
  consumedProducts: VidangeConsumedProduct[];
  payments: PaymentSplit;
}

export const VIDANGE_SERVICE_TYPES = [
  'Vidange complète',
  'Vidange + filtre',
  'Vidange rapide',
  'Pack entretien',
] as const;

export type VidangeServiceType = (typeof VIDANGE_SERVICE_TYPES)[number];

export const VIDANGE_CONSUMABLE_PRODUCTS = [
  'Huile moteur 10W40',
  'Filtre à huile',
  'Filtre à air',
  'Liquide frein',
] as const;

export type VidangeConsumableProduct = (typeof VIDANGE_CONSUMABLE_PRODUCTS)[number];

export interface VidangeBonDraftInput {
  bonNumber: string;
  vehicleRef: string;
  chefVidangeLavageId: number;
  lines: Pick<VidangeBonServiceLine, 'serviceType' | 'amount'>[];
  consumedProducts: VidangeConsumedProduct[];
  payments: PaymentSplit;
}

export interface VidangeServiceTableRow {
  id: number;
  serviceType: string;
  amount: number | null;
}

export interface VidangeProductTableRow {
  id: number;
  productName: string;
  quantity: number | null;
  unitPrice: number | null;
}

export function consumedProductLineAmount(product: VidangeConsumedProduct): number {
  return product.quantity * product.unitPrice;
}

export function parseConsumedProducts(
  rows: { productName: string; quantity: number | null; unitPrice: number | null }[],
): VidangeConsumedProduct[] {
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

export function filledServiceRows(rows: VidangeServiceTableRow[]): VidangeServiceTableRow[] {
  return rows.filter(
    (row) =>
      row.serviceType.trim().length > 0 &&
      row.amount != null &&
      row.amount > 0 &&
      !Number.isNaN(row.amount),
  );
}

export function filledProductRows(rows: VidangeProductTableRow[]): VidangeProductTableRow[] {
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

export function buildVidangeBonDraft(
  serviceRows: VidangeServiceTableRow[],
  productRows: VidangeProductTableRow[],
): Pick<VidangeBonDraftInput, 'lines' | 'consumedProducts'> {
  return {
    lines: filledServiceRows(serviceRows).map((row) => ({
      serviceType: row.serviceType.trim(),
      amount: row.amount!,
    })),
    consumedProducts: parseConsumedProducts(productRows),
  };
}

export function isVidangeBonTablesValid(input: {
  bonNumber: string;
  chefVidangeLavageId: number | null;
  serviceRows: VidangeServiceTableRow[];
  productRows: VidangeProductTableRow[];
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

export function productTableQtyTotal(rows: VidangeProductTableRow[]): number {
  return filledProductRows(rows).reduce((sum, row) => sum + row.quantity!, 0);
}

export function productTableAmountTotal(rows: VidangeProductTableRow[]): number {
  return filledProductRows(rows).reduce(
    (sum, row) => sum + row.quantity! * row.unitPrice!,
    0,
  );
}

export function serviceTableTotal(rows: VidangeServiceTableRow[]): number {
  return filledServiceRows(rows).reduce((sum, row) => sum + row.amount!, 0);
}

export function computeDraftBonTotal(
  serviceRows: VidangeServiceTableRow[],
  productRows: VidangeProductTableRow[],
): number {
  return serviceTableTotal(serviceRows) + productTableAmountTotal(productRows);
}

export function computeBonServicesAmount(bon: VidangeBon): number {
  return bon.lines.reduce((sum, line) => sum + (line.amount > 0 ? line.amount : 0), 0);
}

export function computeBonProductsAmount(bon: VidangeBon): number {
  return bon.consumedProducts.reduce(
    (sum, product) => sum + consumedProductLineAmount(product),
    0,
  );
}

export function computeBonTotal(bon: VidangeBon): number {
  return computeBonServicesAmount(bon) + computeBonProductsAmount(bon);
}

export function computeBonConsumedQty(bon: VidangeBon): number {
  return bon.consumedProducts.reduce((sum, product) => sum + product.quantity, 0);
}

export function computeVidangeBonsTotal(bons: VidangeBon[]): number {
  return bons.reduce((sum, bon) => sum + computeBonTotal(bon), 0);
}

export function canProceedVidangeStep(_bons: VidangeBon[]): boolean {
  return true;
}

export function suggestNextVidangeBonNumber(
  existing: Pick<VidangeBon, 'bonNumber'>[],
): string {
  const max = existing.reduce((acc, bon) => {
    const match = bon.bonNumber.match(/VID-(\d+)/i);
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, 8900);
  return `VID-${max + 1}`;
}

export { emptyPaymentSplit, computePaymentTotal, computePaymentDifference, paymentDifferenceLabel };
