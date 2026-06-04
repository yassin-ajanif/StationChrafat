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

export type ReceptionStatut = 'planifiee' | 'en_cours' | 'recue' | 'annulee';

export type ReceptionLine = DocumentLine;
export type ReceptionLineDraft = DocumentLineDraft;
export type ReceptionLineTableRow = DocumentLineTableRow;

export interface Reception {
  id: number;
  numero: string;
  fournisseur: string;
  dateReception: string;
  statut: ReceptionStatut;
  reference: string;
  description: string;
  montant: number;
  serviceLines: ReceptionLine[];
  productLines: ReceptionLine[];
  payments: PaymentSplit;
}

export interface ReceptionDraft {
  fournisseur: string;
  dateReception: string;
  statut: ReceptionStatut;
  reference: string;
  description: string;
  serviceLines: ReceptionLineDraft[];
  productLines: ReceptionLineDraft[];
  payments: PaymentSplit;
}

export const RECEPTION_STATUT_LABELS: Record<ReceptionStatut, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  recue: 'Reçue',
  annulee: 'Annulée',
};

export function computeReceptionMontant(
  reception: Pick<Reception, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(reception.serviceLines) +
    computeDocumentLinesTotalTTC(reception.productLines)
  );
}

export function computeDraftReceptionTotal(
  serviceRows: ReceptionLineTableRow[],
  productRows: ReceptionLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftReceptionServicesTotal(serviceRows: ReceptionLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftReceptionProductsTotal(productRows: ReceptionLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildReceptionLineDrafts(
  serviceRows: ReceptionLineTableRow[],
  productRows: ReceptionLineTableRow[],
): Pick<ReceptionDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: ReceptionLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isReceptionFormValid(input: {
  fournisseur: string;
  serviceRows: ReceptionLineTableRow[];
  productRows: ReceptionLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignReceptionLineIds(lines: ReceptionLineDraft[], startId = 1): ReceptionLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextReceptionNumber(existing: Reception[]): string {
  const nums = existing
    .filter((r) => r.numero.startsWith('BR-S'))
    .map((r) => parseInt(r.numero.replace('BR-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `BR-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
