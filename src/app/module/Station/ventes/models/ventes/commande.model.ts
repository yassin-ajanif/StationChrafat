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

export type CommandeStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'livree' | 'annulee';

export type CommandeLine = DocumentLine;
export type CommandeLineDraft = DocumentLineDraft;
export type CommandeLineTableRow = DocumentLineTableRow;

export interface Commande {
  id: number;
  numero: string;
  client: string;
  montant: number;
  statut: CommandeStatut;
  dateCreation: string;
  description: string;
  serviceLines: CommandeLine[];
  productLines: CommandeLine[];
  payments: PaymentSplit;
}

export interface CommandeDraft {
  client: string;
  statut: CommandeStatut;
  description: string;
  serviceLines: CommandeLineDraft[];
  productLines: CommandeLineDraft[];
  payments: PaymentSplit;
}

export const COMMANDE_STATUT_KEYS: Record<CommandeStatut, string> = {
  en_attente: 'ventes.commande.statusEnAttente',
  confirmee: 'ventes.commande.statusConfirmee',
  en_cours: 'ventes.commande.statusEnCours',
  livree: 'ventes.commande.statusLivree',
  annulee: 'ventes.commande.statusAnnulee',
};

export function computeCommandeMontant(
  commande: Pick<Commande, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(commande.serviceLines) +
    computeDocumentLinesTotalTTC(commande.productLines)
  );
}

export function computeDraftCommandeTotal(
  serviceRows: CommandeLineTableRow[],
  productRows: CommandeLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftCommandeServicesTotal(serviceRows: CommandeLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftCommandeProductsTotal(productRows: CommandeLineTableRow[]): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildCommandeLineDrafts(
  serviceRows: CommandeLineTableRow[],
  productRows: CommandeLineTableRow[],
): Pick<CommandeDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: CommandeLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isCommandeFormValid(input: {
  client: string;
  serviceRows: CommandeLineTableRow[];
  productRows: CommandeLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignCommandeLineIds(lines: CommandeLineDraft[], startId = 1): CommandeLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextCommandeNumber(existing: Commande[]): string {
  const nums = existing
    .filter((c) => c.numero.startsWith('CMD-S'))
    .map((c) => parseInt(c.numero.replace('CMD-S-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `CMD-S-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
