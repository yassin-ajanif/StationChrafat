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

export type CommandeAchatStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'recue' | 'annulee';

export type CommandeAchatLine = DocumentLine;
export type CommandeAchatLineDraft = DocumentLineDraft;
export type CommandeAchatLineTableRow = DocumentLineTableRow;

export interface CommandeAchat {
  id: number;
  numero: string;
  fournisseur: string;
  montant: number;
  statut: CommandeAchatStatut;
  dateCreation: string;
  description: string;
  serviceLines: CommandeAchatLine[];
  productLines: CommandeAchatLine[];
  payments: PaymentSplit;
}

export interface CommandeAchatDraft {
  fournisseur: string;
  statut: CommandeAchatStatut;
  description: string;
  serviceLines: CommandeAchatLineDraft[];
  productLines: CommandeAchatLineDraft[];
  payments: PaymentSplit;
}

export const COMMANDE_ACHAT_STATUT_LABELS: Record<CommandeAchatStatut, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_cours: 'En cours',
  recue: 'Reçue',
  annulee: 'Annulée',
};

export function computeCommandeAchatMontant(
  commande: Pick<CommandeAchat, 'serviceLines' | 'productLines'>,
): number {
  return (
    computeDocumentLinesTotalTTC(commande.serviceLines) +
    computeDocumentLinesTotalTTC(commande.productLines)
  );
}

export function computeDraftCommandeAchatTotal(
  serviceRows: CommandeAchatLineTableRow[],
  productRows: CommandeAchatLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

export function computeDraftCommandeAchatServicesTotal(
  serviceRows: CommandeAchatLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftCommandeAchatProductsTotal(
  productRows: CommandeAchatLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildCommandeAchatLineDrafts(
  serviceRows: CommandeAchatLineTableRow[],
  productRows: CommandeAchatLineTableRow[],
): Pick<CommandeAchatDraft, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

function rowsAreValid(rows: CommandeAchatLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isCommandeAchatFormValid(input: {
  fournisseur: string;
  serviceRows: CommandeAchatLineTableRow[];
  productRows: CommandeAchatLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
    return false;
  }
  if (filledDocumentLineTableRows(input.serviceRows).length === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function assignCommandeAchatLineIds(
  lines: CommandeAchatLineDraft[],
  startId = 1,
): CommandeAchatLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextCommandeAchatNumber(existing: CommandeAchat[]): string {
  const nums = existing
    .filter((c) => c.numero.startsWith('BCF-V'))
    .map((c) => parseInt(c.numero.replace('BCF-V-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `BCF-V-${String(max + 1).padStart(4, '0')}`;
}

export {
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
};
