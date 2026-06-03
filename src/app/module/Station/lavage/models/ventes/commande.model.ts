export type CommandeStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'livree' | 'annulee';

export interface Commande {
  id: number;
  numero: string;
  client: string;
  montant: number;
  statut: CommandeStatut;
  dateCreation: string;
  description: string;
}

export const COMMANDE_STATUT_LABELS: Record<CommandeStatut, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_cours: 'En cours',
  livree: 'Livrée',
  annulee: 'Annulée',
};
