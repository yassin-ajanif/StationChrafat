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

export type FactureStatut = 'brouillon' | 'emise' | 'payee' | 'en_retard';

export type FactureLine = DocumentLine;
export type FactureLineDraft = DocumentLineDraft;
export type FactureLineTableRow = DocumentLineTableRow;

export interface Facture {
  id: number;
  numero: string;
  client: string;
  montantTTC: number;
  statut: FactureStatut;
  dateEmission: string;
  dateEcheance: string;
  serviceLines: FactureLine[];
  productLines: FactureLine[];
  payments: PaymentSplit;
}

export interface FactureDraft {
  client: string;
  statut: FactureStatut;
  dateEmission: string;
  dateEcheance: string;
  serviceLines: FactureLineDraft[];
  productLines: FactureLineDraft[];
  payments: PaymentSplit;
}

export const FACTURE_STATUT_LABELS: Record<FactureStatut, string> = {
  brouillon: 'Brouillon',
  emise: 'Émise',
  payee: 'Payée',
  en_retard: 'En retard',
};

export function computeFactureMontantTTC(
  facture: Pick<Facture, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(facture.serviceLines) +
    computeDocumentLinesTotalTTC(facture.productLines)
  );
}

export function computeDraftFactureTotal(
  serviceRows: FactureLineTableRow[],
  productRows: FactureLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftFactureServicesTotal(serviceRows: FactureLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftFactureProductsTotal(productRows: FactureLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildFactureLineDrafts(
  serviceRows: FactureLineTableRow[],
  productRows: FactureLineTableRow[],
): Pick<FactureDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: FactureLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isFactureFormValid(input: {
  client: string;
  serviceRows: FactureLineTableRow[];
  productRows: FactureLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignFactureLineIds(lines: FactureLineDraft[], startId = 1): FactureLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextFactureNumber(existing: Facture[]): string {
  const nums = existing
    .filter((f) => f.numero.startsWith('FAC-L'))
    .map((f) => parseInt(f.numero.replace('FAC-L-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `FAC-L-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
