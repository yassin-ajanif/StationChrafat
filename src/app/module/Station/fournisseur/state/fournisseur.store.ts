export interface Fournisseur {
  id: number;
  name: string;
  phone: string;
  email: string;
  ice: string;
  address: string;
  city: string;
  paymentTermsDays: number;
  active: boolean;
}

export interface FournisseurDraft {
  name: string;
  phone: string;
  email: string;
  ice: string;
  address: string;
  city: string;
  paymentTermsDays: number;
  active: boolean;
}

export const EMPTY_FOURNISSEUR_DRAFT: FournisseurDraft = {
  name: '',
  phone: '',
  email: '',
  ice: '',
  address: '',
  city: '',
  paymentTermsDays: 30,
  active: true,
};
