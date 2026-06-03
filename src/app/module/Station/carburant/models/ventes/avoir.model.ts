export type AvoirStatut = 'brouillon' | 'emis' | 'applique';

export interface Avoir {
  id: number;
  numero: string;
  factureLiee: string;
  client: string;
  montant: number;
  statut: AvoirStatut;
  dateEmission: string;
}

export const AVOIR_STATUT_LABELS: Record<AvoirStatut, string> = {
  brouillon: 'Brouillon',
  emis: 'Émis',
  applique: 'Appliqué',
};
