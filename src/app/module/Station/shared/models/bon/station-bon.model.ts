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

export type StationBonLine = DocumentLine;
export type StationBonLineDraft = DocumentLineDraft;
export type StationBonLineTableRow = DocumentLineTableRow;

export interface StationBon {
  id: number;
  bonNumber: string;
  partnerRef: string;
  chefVidangeLavageId: number;
  serviceLines: StationBonLine[];
  productLines: StationBonLine[];
  payments: PaymentSplit;
  fuelTransmittedFromNozzles?: boolean;
}

export interface StationBonDraftInput {
  bonNumber: string;
  partnerRef: string;
  chefVidangeLavageId: number;
  serviceLines: StationBonLineDraft[];
  productLines: StationBonLineDraft[];
  payments: PaymentSplit;
}

export function computeBonServicesAmountHT(bon: StationBon): number {
  return computeDocumentLinesTotalHT(bon.serviceLines);
}

export function computeBonProductsAmountHT(bon: StationBon): number {
  return computeDocumentLinesTotalHT(bon.productLines);
}

export function computeBonServicesAmount(bon: StationBon): number {
  return computeDocumentLinesTotalTTC(bon.serviceLines);
}

export function computeBonProductsAmount(bon: StationBon): number {
  return computeDocumentLinesTotalTTC(bon.productLines);
}

export function computeBonTotalHT(bon: StationBon): number {
  return computeBonServicesAmountHT(bon) + computeBonProductsAmountHT(bon);
}

export function computeBonTotal(bon: StationBon): number {
  return computeBonServicesAmount(bon) + computeBonProductsAmount(bon);
}

export function computeBonConsumedQty(bon: StationBon): number {
  return bon.productLines.reduce((sum, line) => sum + line.quantity, 0);
}

export function computeStationBonsTotal(bons: StationBon[]): number {
  return bons.reduce((sum, bon) => sum + computeBonTotal(bon), 0);
}

export function canProceedBonsStep(_bons: StationBon[]): boolean {
  return true;
}

export function suggestNextStationBonNumber(
  existing: Pick<StationBon, 'bonNumber'>[],
  prefix: string,
  fallback: number,
): string {
  const max = existing.reduce((acc, bon) => {
    const match = bon.bonNumber.match(new RegExp(`${prefix}-(\\d+)`, 'i'));
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, fallback);
  return `${prefix}-${max + 1}`;
}

export function computeDraftBonTotal(
  serviceRows: StationBonLineTableRow[],
  productRows: StationBonLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftServicesTotal(
  serviceRows: StationBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftProductsTotal(
  productRows: StationBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildStationBonDraft(
  serviceRows: StationBonLineTableRow[],
  productRows: StationBonLineTableRow[],
): Pick<StationBonDraftInput, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: StationBonLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isStationBonLinesValid(input: {
  bonNumber: string;
  chefVidangeLavageId: number | null;
  serviceRows: StationBonLineTableRow[];
  productRows: StationBonLineTableRow[];
}): boolean {
  if (input.bonNumber.trim().length === 0 || input.chefVidangeLavageId == null) {
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
