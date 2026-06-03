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

export type FactureFournisseurStatut = 'brouillon' | 'recue' | 'payee' | 'en_retard';

export type FactureFournisseurLine = DocumentLine;
export type FactureFournisseurLineDraft = DocumentLineDraft;
export type FactureFournisseurLineTableRow = DocumentLineTableRow;

export interface FactureFournisseur {
  id: number;
  numero: string;
  fournisseur: string;
  montantTTC: number;
  statut: FactureFournisseurStatut;
  dateReception: string;
  dateEcheance: string;
  serviceLines: FactureFournisseurLine[];
  productLines: FactureFournisseurLine[];
  payments: PaymentSplit;
}

export interface FactureFournisseurDraft {
  fournisseur: string;
  statut: FactureFournisseurStatut;
  dateReception: string;
  dateEcheance: string;
  serviceLines: FactureFournisseurLineDraft[];
  productLines: FactureFournisseurLineDraft[];
  payments: PaymentSplit;
}

export const FACTURE_FOURNISSEUR_STATUT_LABELS: Record<FactureFournisseurStatut, string> = {
  brouillon: 'Brouillon',
  recue: 'Reçue',
  payee: 'Payée',
  en_retard: 'En retard',
};

export function computeFactureFournisseurMontantTTC(
  facture: Pick<FactureFournisseur, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(facture.serviceLines) +
    computeDocumentLinesTotalTTC(facture.productLines)
  );
}

export function computeDraftFactureFournisseurTotal(
  serviceRows: FactureFournisseurLineTableRow[],
  productRows: FactureFournisseurLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftFactureFournisseurServicesTotal(
  serviceRows: FactureFournisseurLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftFactureFournisseurProductsTotal(
  productRows: FactureFournisseurLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildFactureFournisseurLineDrafts(
  serviceRows: FactureFournisseurLineTableRow[],
  productRows: FactureFournisseurLineTableRow[],
): Pick<FactureFournisseurDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: FactureFournisseurLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isFactureFournisseurFormValid(input: {
  fournisseur: string;
  serviceRows: FactureFournisseurLineTableRow[];
  productRows: FactureFournisseurLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignFactureFournisseurLineIds(
  lines: FactureFournisseurLineDraft[],
  startId = 1,
): FactureFournisseurLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextFactureFournisseurNumber(existing: FactureFournisseur[]): string {
  const nums = existing
    .filter((f) => f.numero.startsWith('FF-L'))
    .map((f) => parseInt(f.numero.replace('FF-L-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `FF-L-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
