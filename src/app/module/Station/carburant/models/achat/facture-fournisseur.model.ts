export type FactureFournisseurStatut = 'brouillon' | 'recue' | 'payee' | 'en_retard';

export interface FactureFournisseur {
  id: number;
  numero: string;
  fournisseur: string;
  montantTTC: number;
  statut: FactureFournisseurStatut;
  dateReception: string;
  dateEcheance: string;
}

export const FACTURE_FOURNISSEUR_STATUT_LABELS: Record<FactureFournisseurStatut, string> = {
  brouillon: 'Brouillon',
  recue: 'Reçue',
  payee: 'Payée',
  en_retard: 'En retard',
};
