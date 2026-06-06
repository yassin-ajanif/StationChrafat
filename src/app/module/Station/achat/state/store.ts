import type { DocumentLine, DocumentLineDraft, DocumentLineTableRow } from '../../shared/components/document-lines-table/document-lines-table.component';
import type { PaymentSplit } from '../../shared/components/bon-recap-payments/bon-recap-payments.component';

export type DevisAchatStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';
export type CommandeAchatStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'recue' | 'annulee';
export type ReceptionStatut = 'planifiee' | 'en_cours' | 'recue' | 'annulee';
export type FactureFournisseurStatut = 'brouillon' | 'recue' | 'payee' | 'en_retard';
export type AvoirFournisseurStatut = 'brouillon' | 'recu' | 'applique';
export type RetourFournisseurStatut = 'en_attente' | 'envoye' | 'recu' | 'refuse';

export type DevisAchatLine = DocumentLine;
export type DevisAchatLineDraft = DocumentLineDraft;
export type DevisAchatLineTableRow = DocumentLineTableRow;

export type CommandeAchatLine = DocumentLine;
export type CommandeAchatLineDraft = DocumentLineDraft;
export type CommandeAchatLineTableRow = DocumentLineTableRow;

export type ReceptionLine = DocumentLine;
export type ReceptionLineDraft = DocumentLineDraft;
export type ReceptionLineTableRow = DocumentLineTableRow;

export type FactureFournisseurLine = DocumentLine;
export type FactureFournisseurLineDraft = DocumentLineDraft;
export type FactureFournisseurLineTableRow = DocumentLineTableRow;

export type AvoirFournisseurLine = DocumentLine;
export type AvoirFournisseurLineDraft = DocumentLineDraft;
export type AvoirFournisseurLineTableRow = DocumentLineTableRow;

export type RetourFournisseurLine = DocumentLine;
export type RetourFournisseurLineDraft = DocumentLineDraft;
export type RetourFournisseurLineTableRow = DocumentLineTableRow;

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
