export type DevisAchatStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

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
}

export const DEVIS_ACHAT_STATUT_LABELS: Record<DevisAchatStatut, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
};
