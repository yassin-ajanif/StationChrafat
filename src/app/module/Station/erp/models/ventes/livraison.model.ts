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

export type LivraisonStatut = 'planifiee' | 'en_cours' | 'livree' | 'annulee';

export type LivraisonLine = DocumentLine;
export type LivraisonLineDraft = DocumentLineDraft;
export type LivraisonLineTableRow = DocumentLineTableRow;

export interface Livraison {
  id: number;
  numero: string;
  client: string;
  dateLivraison: string;
  statut: LivraisonStatut;
  adresse: string;
  description: string;
  montant: number;
  serviceLines: LivraisonLine[];
  productLines: LivraisonLine[];
  payments: PaymentSplit;
}

export interface LivraisonDraft {
  client: string;
  dateLivraison: string;
  statut: LivraisonStatut;
  adresse: string;
  description: string;
  serviceLines: LivraisonLineDraft[];
  productLines: LivraisonLineDraft[];
  payments: PaymentSplit;
}

export const LIVRAISON_STATUT_LABELS: Record<LivraisonStatut, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  livree: 'Livrée',
  annulee: 'Annulée',
};

export function computeLivraisonMontant(
  livraison: Pick<Livraison, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(livraison.serviceLines) +
    computeDocumentLinesTotalTTC(livraison.productLines)
  );
}

export function computeDraftLivraisonTotal(
  serviceRows: LivraisonLineTableRow[],
  productRows: LivraisonLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftLivraisonServicesTotal(serviceRows: LivraisonLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftLivraisonProductsTotal(productRows: LivraisonLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildLivraisonLineDrafts(
  serviceRows: LivraisonLineTableRow[],
  productRows: LivraisonLineTableRow[],
): Pick<LivraisonDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: LivraisonLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isLivraisonFormValid(input: {
  client: string;
  serviceRows: LivraisonLineTableRow[];
  productRows: LivraisonLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignLivraisonLineIds(lines: LivraisonLineDraft[], startId = 1): LivraisonLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextLivraisonNumber(existing: Livraison[]): string {
  const nums = existing
    .filter((l) => l.numero.startsWith('LIV-S'))
    .map((l) => parseInt(l.numero.replace('LIV-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `LIV-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
