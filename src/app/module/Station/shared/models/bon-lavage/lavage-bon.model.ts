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

export type LavageBonLine = DocumentLine;
export type LavageBonLineDraft = DocumentLineDraft;
export type LavageBonLineTableRow = DocumentLineTableRow;

/** Bon lavage : lignes services + lignes produits consommés. */
export interface LavageBon {
  id: number;
  bonNumber: string;
  clientRef: string;
  chefVidangeLavageId: number;
  serviceLines: LavageBonLine[];
  productLines: LavageBonLine[];
  payments: PaymentSplit;
}

export interface LavageBonDraftInput {
  bonNumber: string;
  clientRef: string;
  chefVidangeLavageId: number;
  serviceLines: LavageBonLineDraft[];
  productLines: LavageBonLineDraft[];
  payments: PaymentSplit;
}

export function computeBonServicesAmountHT(bon: LavageBon): number {
  return computeDocumentLinesTotalHT(bon.serviceLines);
}

export function computeBonProductsAmountHT(bon: LavageBon): number {
  return computeDocumentLinesTotalHT(bon.productLines);
}

export function computeBonServicesAmount(bon: LavageBon): number {
  return computeDocumentLinesTotalTTC(bon.serviceLines);
}

export function computeBonProductsAmount(bon: LavageBon): number {
  return computeDocumentLinesTotalTTC(bon.productLines);
}

export function computeBonTotalHT(bon: LavageBon): number {
  return computeBonServicesAmountHT(bon) + computeBonProductsAmountHT(bon);
}

export function computeBonTotal(bon: LavageBon): number {
  return computeBonServicesAmount(bon) + computeBonProductsAmount(bon);
}

export function computeBonConsumedQty(bon: LavageBon): number {
  return bon.productLines.reduce((sum, line) => sum + line.quantity, 0);
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

export function computeDraftBonTotal(
  serviceRows: LavageBonLineTableRow[],
  productRows: LavageBonLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftServicesTotal(
  serviceRows: LavageBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftProductsTotal(
  productRows: LavageBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildLavageBonDraft(
  serviceRows: LavageBonLineTableRow[],
  productRows: LavageBonLineTableRow[],
): Pick<LavageBonDraftInput, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: LavageBonLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isLavageBonLinesValid(input: {
  bonNumber: string;
  chefVidangeLavageId: number | null;
  serviceRows: LavageBonLineTableRow[];
  productRows: LavageBonLineTableRow[];
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
