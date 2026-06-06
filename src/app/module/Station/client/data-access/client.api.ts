import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Client, ClientDraft } from '../state/client.store';

const SEED_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'Transport Atlas SARL',
    phone: '0661-234567',
    email: 'contact@transport-atlas.ma',
    ice: '002345678000012',
    address: 'Zone industrielle',
    city: 'Casablanca',
    active: true,
  },
  {
    id: 2,
    name: 'Société BTP Maroc',
    phone: '0522-987654',
    email: 'compta@btp-maroc.ma',
    ice: '001987654000045',
    address: 'Bd Mohammed V',
    city: 'Rabat',
    active: true,
  },
  {
    id: 3,
    name: 'Particulier — Benali',
    phone: '0678-112233',
    email: '',
    ice: '',
    address: 'Hay Riad',
    city: 'Salé',
    active: true,
  },
  {
    id: 4,
    name: 'Flotte Taxi Union',
    phone: '0537-445566',
    email: 'fleet@taxi-union.ma',
    ice: '003112233000078',
    address: 'Av. Hassan II',
    city: 'Marrakech',
    active: false,
  },
];

let nextClientId = SEED_CLIENTS.length + 1;

@Injectable({ providedIn: 'root' })
export class ClientApi {
  getClients(): Observable<Client[]> {
    return of([...SEED_CLIENTS]).pipe(delay(200));
  }

  createClient(draft: ClientDraft): Observable<Client> {
    const client: Client = { id: nextClientId++, ...draft };
    SEED_CLIENTS.push(client);
    return of(client).pipe(delay(200));
  }

  updateClient(id: number, draft: ClientDraft): Observable<Client> {
    const idx = SEED_CLIENTS.findIndex((c) => c.id === id);
    const updated = idx >= 0 ? { ...SEED_CLIENTS[idx], ...draft } : { id, ...draft };
    if (idx >= 0) {
      SEED_CLIENTS[idx] = updated;
    }
    return of(updated).pipe(delay(200));
  }

  deleteClient(id: number): Observable<void> {
    const idx = SEED_CLIENTS.findIndex((c) => c.id === id);
    if (idx >= 0) {
      SEED_CLIENTS.splice(idx, 1);
    }
    return of(undefined).pipe(delay(200));
  }
}
