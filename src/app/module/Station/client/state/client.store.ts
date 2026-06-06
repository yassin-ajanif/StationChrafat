export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  ice: string;
  address: string;
  city: string;
  active: boolean;
}

export interface ClientDraft {
  name: string;
  phone: string;
  email: string;
  ice: string;
  address: string;
  city: string;
  active: boolean;
}

export const EMPTY_CLIENT_DRAFT: ClientDraft = {
  name: '',
  phone: '',
  email: '',
  ice: '',
  address: '',
  city: '',
  active: true,
};
