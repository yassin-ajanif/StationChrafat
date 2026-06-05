import type { DocumentLine, DocumentLineDraft, DocumentLineTableRow } from '../../shared/models/common/document-line.model';
import type { PaymentSplit } from '../../shared/models/common/payment-split.model';

export type DevisStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';
export type CommandeStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'livree' | 'annulee';
export type LivraisonStatut = 'planifiee' | 'en_cours' | 'livree' | 'annulee';
export type FactureStatut = 'brouillon' | 'emise' | 'payee' | 'en_retard';
export type AvoirStatut = 'brouillon' | 'emis' | 'applique';
export type RetourStatut = 'en_attente' | 'recu' | 'traite' | 'refuse';

export type DevisLine = DocumentLine;
export type DevisLineDraft = DocumentLineDraft;
export type DevisLineTableRow = DocumentLineTableRow;

export type CommandeLine = DocumentLine;
export type CommandeLineDraft = DocumentLineDraft;
export type CommandeLineTableRow = DocumentLineTableRow;

export type LivraisonLine = DocumentLine;
export type LivraisonLineDraft = DocumentLineDraft;
export type LivraisonLineTableRow = DocumentLineTableRow;

export type FactureLine = DocumentLine;
export type FactureLineDraft = DocumentLineDraft;
export type FactureLineTableRow = DocumentLineTableRow;

export type AvoirLine = DocumentLine;
export type AvoirLineDraft = DocumentLineDraft;
export type AvoirLineTableRow = DocumentLineTableRow;

export type RetourLine = DocumentLine;
export type RetourLineDraft = DocumentLineDraft;
export type RetourLineTableRow = DocumentLineTableRow;

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

export interface Avoir {
  id: number;
  numero: string;
  factureLiee: string;
  client: string;
  montant: number;
  statut: AvoirStatut;
  dateEmission: string;
  serviceLines: AvoirLine[];
  productLines: AvoirLine[];
  payments: PaymentSplit;
}

export interface AvoirDraft {
  factureLiee: string;
  client: string;
  statut: AvoirStatut;
  dateEmission: string;
  serviceLines: AvoirLineDraft[];
  productLines: AvoirLineDraft[];
  payments: PaymentSplit;
}

export interface Retour {
  id: number;
  numero: string;
  client: string;
  factureLiee: string;
  motif: string;
  montant: number;
  statut: RetourStatut;
  dateCreation: string;
  serviceLines: RetourLine[];
  productLines: RetourLine[];
  payments: PaymentSplit;
}

export interface RetourDraft {
  client: string;
  factureLiee: string;
  motif: string;
  statut: RetourStatut;
  dateCreation: string;
  serviceLines: RetourLineDraft[];
  productLines: RetourLineDraft[];
  payments: PaymentSplit;
}
