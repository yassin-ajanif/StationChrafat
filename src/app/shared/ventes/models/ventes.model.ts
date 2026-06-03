export type VentesModule = 'lavage' | 'vidange' | 'carburant';

export type DevisStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

export interface Devis {
  id: number;
  numero: string;
  client: string;
  module: VentesModule;
  montantHT: number;
  tva: number;
  montantTTC: number;
  statut: DevisStatut;
  dateCreation: string;
  dateValidite: string;
  notes: string;
}

export interface DevisDraft {
  client: string;
  montantHT: number;
  tva: number;
  statut: DevisStatut;
  dateValidite: string;
  notes: string;
}

export const DEFAULT_TVA = 20;

export function computeTTC(montantHT: number, tva: number): number {
  return montantHT + (montantHT * tva) / 100;
}

export function nextDevisNumber(existing: Devis[], module: VentesModule): string {
  const prefix = module === 'lavage' ? 'DEV-L' : module === 'vidange' ? 'DEV-V' : 'DEV-C';
  const nums = existing
    .filter((d) => d.numero.startsWith(prefix))
    .map((d) => parseInt(d.numero.replace(prefix, ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(4, '0')}`;
}

export const STATUT_LABELS: Record<DevisStatut, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
};

export type CommandeStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'livree' | 'annulee';

export interface Commande {
  id: number;
  numero: string;
  client: string;
  module: VentesModule;
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

export type LivraisonStatut = 'planifiee' | 'en_cours' | 'livree' | 'annulee';

export interface Livraison {
  id: number;
  numero: string;
  client: string;
  module: VentesModule;
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
