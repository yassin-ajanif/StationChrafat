export type CommandeAchatStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'recue' | 'annulee';

export interface CommandeAchat {
  id: number;
  numero: string;
  fournisseur: string;
  montant: number;
  statut: CommandeAchatStatut;
  dateCreation: string;
  description: string;
}

export const COMMANDE_ACHAT_STATUT_LABELS: Record<CommandeAchatStatut, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_cours: 'En cours',
  recue: 'Reçue',
  annulee: 'Annulée',
};
