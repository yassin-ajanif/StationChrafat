export type LivraisonStatut = 'planifiee' | 'en_cours' | 'livree' | 'annulee';

export interface Livraison {
  id: number;
  numero: string;
  client: string;
  dateLivraison: string;
  statut: LivraisonStatut;
  adresse: string;
  description: string;
}

export const LIVRAISON_STATUT_LABELS: Record<LivraisonStatut, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  livree: 'Livrée',
  annulee: 'Annulée',
};
