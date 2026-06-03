export type FactureStatut = 'brouillon' | 'emise' | 'payee' | 'en_retard';

export interface Facture {
  id: number;
  numero: string;
  client: string;
  montantTTC: number;
  statut: FactureStatut;
  dateEmission: string;
  dateEcheance: string;
}

export const FACTURE_STATUT_LABELS: Record<FactureStatut, string> = {
  brouillon: 'Brouillon',
  emise: 'Émise',
  payee: 'Payée',
  en_retard: 'En retard',
};
