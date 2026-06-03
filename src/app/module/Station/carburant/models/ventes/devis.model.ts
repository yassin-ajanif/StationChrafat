export type DevisStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

export interface Devis {
  id: number;
  numero: string;
  client: string;
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

export const STATUT_LABELS: Record<DevisStatut, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
};

export function computeTTC(montantHT: number, tva: number): number {
  return montantHT + (montantHT * tva) / 100;
}

export function nextDevisNumber(existing: Devis[]): string {
  const nums = existing
    .filter((d) => d.numero.startsWith('DEV-C'))
    .map((d) => parseInt(d.numero.replace('DEV-C-', ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `DEV-C-${String(max + 1).padStart(4, '0')}`;
}
