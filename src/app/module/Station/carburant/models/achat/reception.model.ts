export type ReceptionStatut = 'planifiee' | 'en_cours' | 'recue' | 'annulee';

export interface Reception {
  id: number;
  numero: string;
  fournisseur: string;
  dateReception: string;
  statut: ReceptionStatut;
  reference: string;
  description: string;
}

export const RECEPTION_STATUT_LABELS: Record<ReceptionStatut, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  recue: 'Reçue',
  annulee: 'Annulée',
};
