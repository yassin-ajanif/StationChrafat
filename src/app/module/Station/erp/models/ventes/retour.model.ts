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

export type RetourStatut = 'en_attente' | 'recu' | 'traite' | 'refuse';

export type RetourLine = DocumentLine;
export type RetourLineDraft = DocumentLineDraft;
export type RetourLineTableRow = DocumentLineTableRow;

export interface Retour {
  id: number;
  numero: string;
  client: string;
  factureLiee: string;
  motif: string;
  montant: number;
  statut: RetourStatut;
  dateCreation: string;
  serviceLines: RetourLine[];
  productLines: RetourLine[];
  payments: PaymentSplit;
}

export interface RetourDraft {
  client: string;
  factureLiee: string;
  motif: string;
  statut: RetourStatut;
  dateCreation: string;
  serviceLines: RetourLineDraft[];
  productLines: RetourLineDraft[];
  payments: PaymentSplit;
}

export const RETOUR_STATUT_LABELS: Record<RetourStatut, string> = {
  en_attente: 'En attente',
  recu: 'Reçu',
  traite: 'Traité',
  refuse: 'Refusé',
};

export function computeRetourMontant(retour: Pick<Retour, 'serviceLines' | 'productLines'>): number {
  return (
    computeDocumentLinesTotalTTC(retour.serviceLines) +
    computeDocumentLinesTotalTTC(retour.productLines)
  );
}

export function computeDraftRetourTotal(
  serviceRows: RetourLineTableRow[],
  productRows: RetourLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftRetourServicesTotal(serviceRows: RetourLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftRetourProductsTotal(productRows: RetourLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildRetourLineDrafts(
  serviceRows: RetourLineTableRow[],
  productRows: RetourLineTableRow[],
): Pick<RetourDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: RetourLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isRetourFormValid(input: {
  client: string;
  serviceRows: RetourLineTableRow[];
  productRows: RetourLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignRetourLineIds(lines: RetourLineDraft[], startId = 1): RetourLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextRetourNumber(existing: Retour[]): string {
  const nums = existing
    .filter((r) => r.numero.startsWith('RET-S'))
    .map((r) => parseInt(r.numero.replace('RET-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `RET-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
