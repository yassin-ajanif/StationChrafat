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

export type DevisAchatStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

export type DevisAchatLine = DocumentLine;
export type DevisAchatLineDraft = DocumentLineDraft;
export type DevisAchatLineTableRow = DocumentLineTableRow;

export interface DevisAchat {
  id: number;
  numero: string;
  fournisseur: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  statut: DevisAchatStatut;
  dateCreation: string;
  dateValidite: string;
  notes: string;
  serviceLines: DevisAchatLine[];
  productLines: DevisAchatLine[];
  payments: PaymentSplit;
}

export interface DevisAchatDraft {
  fournisseur: string;
  statut: DevisAchatStatut;
  dateValidite: string;
  notes: string;
  serviceLines: DevisAchatLineDraft[];
  productLines: DevisAchatLineDraft[];
  payments: PaymentSplit;
}

export const DEFAULT_TVA_ACHAT = 20;

export const DEVIS_ACHAT_STATUT_KEYS: Record<DevisAchatStatut, string> = {
  brouillon: 'ventes.devis.statusBrouillon',
  envoye: 'ventes.devis.statusEnvoye',
  accepte: 'ventes.devis.statusAccepte',
  refuse: 'ventes.devis.statusRefuse',
};

export function computeDevisAchatMontantHT(
  devis: Pick<DevisAchat, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalHT(devis.serviceLines) +
    computeDocumentLinesTotalHT(devis.productLines)
  );
}

export function computeDevisAchatMontantTTC(
  devis: Pick<DevisAchat, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(devis.serviceLines) +
    computeDocumentLinesTotalTTC(devis.productLines)
  );
}

export function computeDevisAchatEffectiveTva(montantHT: number, montantTTC: number): number {
  if (montantHT <= 0) {
    return DEFAULT_TVA_ACHAT;
  }
  return Math.round(((montantTTC / montantHT - 1) * 100 + Number.EPSILON) * 100) / 100;
}

export function computeDraftDevisAchatTotal(
  serviceRows: DevisAchatLineTableRow[],
  productRows: DevisAchatLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftDevisAchatServicesTotal(serviceRows: DevisAchatLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftDevisAchatProductsTotal(productRows: DevisAchatLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildDevisAchatLineDrafts(
  serviceRows: DevisAchatLineTableRow[],
  productRows: DevisAchatLineTableRow[],
): Pick<DevisAchatDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: DevisAchatLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isDevisAchatFormValid(input: {
  fournisseur: string;
  serviceRows: DevisAchatLineTableRow[];
  productRows: DevisAchatLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignDevisAchatLineIds(lines: DevisAchatLineDraft[], startId = 1): DevisAchatLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextDevisAchatNumber(existing: DevisAchat[]): string {
  const nums = existing
    .filter((d) => d.numero.startsWith('DAF-S'))
    .map((d) => parseInt(d.numero.replace('DAF-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `DAF-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
