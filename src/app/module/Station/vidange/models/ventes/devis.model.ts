import {
  DocumentLine,
  DocumentLineDraft,
  DocumentLineTableRow,
  computeDocumentLinesTotalHT,
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

export type DevisStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

export type DevisLine = DocumentLine;
export type DevisLineDraft = DocumentLineDraft;
export type DevisLineTableRow = DocumentLineTableRow;

export interface Devis {
  id: number;
  numero: string;
  client: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  statut: DevisStatut;
  dateCreation: string;
  dateValidite: string;
  notes: string;
  serviceLines: DevisLine[];
  productLines: DevisLine[];
  payments: PaymentSplit;
}

export interface DevisDraft {
  client: string;
  statut: DevisStatut;
  dateValidite: string;
  notes: string;
  serviceLines: DevisLineDraft[];
  productLines: DevisLineDraft[];
  payments: PaymentSplit;
}

export const DEFAULT_TVA = 20;

export const STATUT_LABELS: Record<DevisStatut, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
};

export function computeTTC(montantHT: number, tva: number): number {
  return montantHT + (montantHT * tva) / 100;
}

export function computeDevisMontantHT(
  devis: Pick<Devis, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalHT(devis.serviceLines) +
    computeDocumentLinesTotalHT(devis.productLines)
  );
}

export function computeDevisMontantTTC(
  devis: Pick<Devis, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(devis.serviceLines) +
    computeDocumentLinesTotalTTC(devis.productLines)
  );
}

export function computeEffectiveTva(montantHT: number, montantTTC: number): number {
  if (montantHT <= 0) {
    return DEFAULT_TVA;
  }
  return Math.round(((montantTTC / montantHT - 1) * 100 + Number.EPSILON) * 100) / 100;
}

export function computeDraftDevisTotal(
  serviceRows: DevisLineTableRow[],
  productRows: DevisLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftDevisServicesTotal(serviceRows: DevisLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftDevisProductsTotal(productRows: DevisLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildDevisLineDrafts(
  serviceRows: DevisLineTableRow[],
  productRows: DevisLineTableRow[],
): Pick<DevisDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: DevisLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isDevisFormValid(input: {
  client: string;
  serviceRows: DevisLineTableRow[];
  productRows: DevisLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignDevisLineIds(lines: DevisLineDraft[], startId = 1): DevisLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextDevisNumber(existing: Devis[]): string {
  const nums = existing
    .filter((d) => d.numero.startsWith('DEV-V'))
    .map((d) => parseInt(d.numero.replace('DEV-V-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `DEV-V-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
