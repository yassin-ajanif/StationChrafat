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

export type RetourFournisseurStatut = 'en_attente' | 'envoye' | 'recu' | 'refuse';

export type RetourFournisseurLine = DocumentLine;
export type RetourFournisseurLineDraft = DocumentLineDraft;
export type RetourFournisseurLineTableRow = DocumentLineTableRow;

export interface RetourFournisseur {
  id: number;
  numero: string;
  fournisseur: string;
  factureLiee: string;
  motif: string;
  montant: number;
  statut: RetourFournisseurStatut;
  dateCreation: string;
  serviceLines: RetourFournisseurLine[];
  productLines: RetourFournisseurLine[];
  payments: PaymentSplit;
}

export interface RetourFournisseurDraft {
  fournisseur: string;
  factureLiee: string;
  motif: string;
  statut: RetourFournisseurStatut;
  dateCreation: string;
  serviceLines: RetourFournisseurLineDraft[];
  productLines: RetourFournisseurLineDraft[];
  payments: PaymentSplit;
}

export const RETOUR_FOURNISSEUR_STATUT_KEYS: Record<RetourFournisseurStatut, string> = {
  en_attente: 'ventes.retour.statusEnAttente',
  envoye: 'achat.retour.statusEnvoye',
  recu: 'ventes.retour.statusRecu',
  refuse: 'ventes.retour.statusRefuse',
};

export function computeRetourFournisseurMontant(
  retour: Pick<RetourFournisseur, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(retour.serviceLines) +
    computeDocumentLinesTotalTTC(retour.productLines)
  );
}

export function computeDraftRetourFournisseurTotal(
  serviceRows: RetourFournisseurLineTableRow[],
  productRows: RetourFournisseurLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftRetourFournisseurServicesTotal(
  serviceRows: RetourFournisseurLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftRetourFournisseurProductsTotal(
  productRows: RetourFournisseurLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildRetourFournisseurLineDrafts(
  serviceRows: RetourFournisseurLineTableRow[],
  productRows: RetourFournisseurLineTableRow[],
): Pick<RetourFournisseurDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: RetourFournisseurLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isRetourFournisseurFormValid(input: {
  fournisseur: string;
  serviceRows: RetourFournisseurLineTableRow[];
  productRows: RetourFournisseurLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignRetourFournisseurLineIds(
  lines: RetourFournisseurLineDraft[],
  startId = 1,
): RetourFournisseurLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextRetourFournisseurNumber(existing: RetourFournisseur[]): string {
  const nums = existing
    .filter((r) => r.numero.startsWith('RETF-S'))
    .map((r) => parseInt(r.numero.replace('RETF-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `RETF-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
