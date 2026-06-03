import {
  DocumentLine,
  DocumentLineDraft,
  DocumentLineTableRow,
  computeDocumentLinesTotalHT,
  computeDocumentLinesTotalTTC,
  computeDocumentLineTableTotalHT,
  computeDocumentLineTableTotalTTC,
  createEmptyDocumentLineTableRow,
  defaultDocumentLineVisibility,
  documentLineToTableRow,
  filledDocumentLineTableRows,
  isDocumentLineTableRowEmpty,
  isDocumentLineTableRowFilled,
  parseDocumentLineDrafts,
} from '../common/document-line.model';
import {
  PaymentSplit,
  computePaymentDifference,
  computePaymentTotal,
  emptyPaymentSplit,
  paymentDifferenceLabel,
} from '../common/payment-split.model';

export type VidangeBonLine = DocumentLine;
export type VidangeBonLineDraft = DocumentLineDraft;
export type VidangeBonLineTableRow = DocumentLineTableRow;

/** Bon vidange : lignes services + lignes produits consommés. */
export interface VidangeBon {
  id: number;
  bonNumber: string;
  vehicleRef: string;
  chefVidangeLavageId: number;
  serviceLines: VidangeBonLine[];
  productLines: VidangeBonLine[];
  payments: PaymentSplit;
}

export interface VidangeBonDraftInput {
  bonNumber: string;
  vehicleRef: string;
  chefVidangeLavageId: number;
  serviceLines: VidangeBonLineDraft[];
  productLines: VidangeBonLineDraft[];
  payments: PaymentSplit;
}

export function computeBonServicesAmountHT(bon: VidangeBon): number {
  return computeDocumentLinesTotalHT(bon.serviceLines);
}

export function computeBonProductsAmountHT(bon: VidangeBon): number {
  return computeDocumentLinesTotalHT(bon.productLines);
}

export function computeBonServicesAmount(bon: VidangeBon): number {
  return computeDocumentLinesTotalTTC(bon.serviceLines);
}

export function computeBonProductsAmount(bon: VidangeBon): number {
  return computeDocumentLinesTotalTTC(bon.productLines);
}

export function computeBonTotalHT(bon: VidangeBon): number {
  return computeBonServicesAmountHT(bon) + computeBonProductsAmountHT(bon);
}

export function computeBonTotal(bon: VidangeBon): number {
  return computeBonServicesAmount(bon) + computeBonProductsAmount(bon);
}

export function computeBonConsumedQty(bon: VidangeBon): number {
  return bon.productLines.reduce((sum, line) => sum + line.quantity, 0);
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

export function computeDraftBonTotal(
  serviceRows: VidangeBonLineTableRow[],
  productRows: VidangeBonLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftServicesTotal(
  serviceRows: VidangeBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftProductsTotal(
  productRows: VidangeBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildVidangeBonDraft(
  serviceRows: VidangeBonLineTableRow[],
  productRows: VidangeBonLineTableRow[],
): Pick<VidangeBonDraftInput, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: VidangeBonLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isVidangeBonLinesValid(input: {
  bonNumber: string;
  chefVidangeLavageId: number | null;
  serviceRows: VidangeBonLineTableRow[];
  productRows: VidangeBonLineTableRow[];
}): boolean {
  if (input.bonNumber.trim().length === 0 || input.chefVidangeLavageId == null) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export {
  createEmptyDocumentLineTableRow,
  defaultDocumentLineVisibility,
  documentLineToTableRow,
  emptyPaymentSplit,
  computePaymentTotal,
  computePaymentDifference,
  paymentDifferenceLabel,
};
