export type AvoirFournisseurStatut = 'brouillon' | 'recu' | 'applique';

export interface AvoirFournisseur {
  id: number;
  numero: string;
  factureLiee: string;
  fournisseur: string;
  montant: number;
  statut: AvoirFournisseurStatut;
  dateReception: string;
}

export const AVOIR_FOURNISSEUR_STATUT_LABELS: Record<AvoirFournisseurStatut, string> = {
  brouillon: 'Brouillon',
  recu: 'Reçu',
  applique: 'Appliqué',
};
