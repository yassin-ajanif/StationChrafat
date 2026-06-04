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

export type AvoirFournisseurStatut = 'brouillon' | 'recu' | 'applique';

export type AvoirFournisseurLine = DocumentLine;
export type AvoirFournisseurLineDraft = DocumentLineDraft;
export type AvoirFournisseurLineTableRow = DocumentLineTableRow;

export interface AvoirFournisseur {
  id: number;
  numero: string;
  factureLiee: string;
  fournisseur: string;
  montant: number;
  statut: AvoirFournisseurStatut;
  dateReception: string;
  serviceLines: AvoirFournisseurLine[];
  productLines: AvoirFournisseurLine[];
  payments: PaymentSplit;
}

export interface AvoirFournisseurDraft {
  factureLiee: string;
  fournisseur: string;
  statut: AvoirFournisseurStatut;
  dateReception: string;
  serviceLines: AvoirFournisseurLineDraft[];
  productLines: AvoirFournisseurLineDraft[];
  payments: PaymentSplit;
}

export const AVOIR_FOURNISSEUR_STATUT_LABELS: Record<AvoirFournisseurStatut, string> = {
  brouillon: 'Brouillon',
  recu: 'Reçu',
  applique: 'Appliqué',
};

export function computeAvoirFournisseurMontant(
  avoir: Pick<AvoirFournisseur, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(avoir.serviceLines) +
    computeDocumentLinesTotalTTC(avoir.productLines)
  );
}

export function computeDraftAvoirFournisseurTotal(
  serviceRows: AvoirFournisseurLineTableRow[],
  productRows: AvoirFournisseurLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftAvoirFournisseurServicesTotal(
  serviceRows: AvoirFournisseurLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftAvoirFournisseurProductsTotal(
  productRows: AvoirFournisseurLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildAvoirFournisseurLineDrafts(
  serviceRows: AvoirFournisseurLineTableRow[],
  productRows: AvoirFournisseurLineTableRow[],
): Pick<AvoirFournisseurDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: AvoirFournisseurLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isAvoirFournisseurFormValid(input: {
  fournisseur: string;
  serviceRows: AvoirFournisseurLineTableRow[];
  productRows: AvoirFournisseurLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignAvoirFournisseurLineIds(
  lines: AvoirFournisseurLineDraft[],
  startId = 1,
): AvoirFournisseurLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextAvoirFournisseurNumber(existing: AvoirFournisseur[]): string {
  const nums = existing
    .filter((a) => a.numero.startsWith('AF-S'))
    .map((a) => parseInt(a.numero.replace('AF-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `AF-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
