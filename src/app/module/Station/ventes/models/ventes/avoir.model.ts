import {
  DocumentLine,
  DocumentLineDraft,
  DocumentLineTableRow,
  computeDocumentLinesTotalTTC,
  computeDocumentLineTableTotalTTC,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  filledDocumentLineTableRows,
  isDocumentLineTableRowEmpty,
  isDocumentLineTableRowFilled,
  parseDocumentLineDrafts,
} from '../../../shared/models/common/document-line.model';
import {
  PaymentSplit,
  emptyPaymentSplit,
} from '../../../shared/models/common/payment-split.model';

export type AvoirStatut = 'brouillon' | 'emis' | 'applique';

export type AvoirLine = DocumentLine;
export type AvoirLineDraft = DocumentLineDraft;
export type AvoirLineTableRow = DocumentLineTableRow;

export interface Avoir {
  id: number;
  numero: string;
  factureLiee: string;
  client: string;
  montant: number;
  statut: AvoirStatut;
  dateEmission: string;
  serviceLines: AvoirLine[];
  productLines: AvoirLine[];
  payments: PaymentSplit;
}

export interface AvoirDraft {
  factureLiee: string;
  client: string;
  statut: AvoirStatut;
  dateEmission: string;
  serviceLines: AvoirLineDraft[];
  productLines: AvoirLineDraft[];
  payments: PaymentSplit;
}

export const AVOIR_STATUT_KEYS: Record<AvoirStatut, string> = {
  brouillon: 'ventes.avoir.statusBrouillon',
  emis: 'ventes.avoir.statusEmis',
  applique: 'ventes.avoir.statusApplique',
};

export function computeAvoirMontant(avoir: Pick<Avoir, 'serviceLines' | 'productLines'>): number {
  return (
    computeDocumentLinesTotalTTC(avoir.serviceLines) +
    computeDocumentLinesTotalTTC(avoir.productLines)
  );
}

export function computeDraftAvoirTotal(
  serviceRows: AvoirLineTableRow[],
  productRows: AvoirLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftAvoirServicesTotal(serviceRows: AvoirLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftAvoirProductsTotal(productRows: AvoirLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildAvoirLineDrafts(
  serviceRows: AvoirLineTableRow[],
  productRows: AvoirLineTableRow[],
): Pick<AvoirDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: AvoirLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isAvoirFormValid(input: {
  client: string;
  serviceRows: AvoirLineTableRow[];
  productRows: AvoirLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignAvoirLineIds(lines: AvoirLineDraft[], startId = 1): AvoirLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextAvoirNumber(existing: Avoir[]): string {
  const nums = existing
    .filter((a) => a.numero.startsWith('AVR-S'))
    .map((a) => parseInt(a.numero.replace('AVR-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `AVR-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
