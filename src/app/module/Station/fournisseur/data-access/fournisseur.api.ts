import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Fournisseur, FournisseurDraft } from '../state/fournisseur.store';

const SEED_FOURNISSEURS: Fournisseur[] = [
  {
    id: 1,
    name: 'TotalEnergies Marketing Maroc',
    phone: '0522-334455',
    email: 'appro@totalenergies.ma',
    ice: '002111222000033',
    address: 'Tour Casablanca',
    city: 'Casablanca',
    paymentTermsDays: 45,
    active: true,
  },
  {
    id: 2,
    name: 'Afriquia Lubrifiants',
    phone: '0537-778899',
    email: 'ventes@afriquia-lub.ma',
    ice: '001555666000077',
    address: 'Zone logistique',
    city: 'Marrakech',
    paymentTermsDays: 30,
    active: true,
  },
  {
    id: 3,
    name: 'Distrib Boutique Express',
    phone: '0666-445566',
    email: 'contact@boutique-express.ma',
    ice: '003999888000011',
    address: 'Hay Mohammadi',
    city: 'Casablanca',
    paymentTermsDays: 15,
    active: true,
  },
  {
    id: 4,
    name: 'Pièces Auto Maroc (inactif)',
    phone: '0524-112233',
    email: '',
    ice: '004444555000099',
    address: 'Bd Zerktouni',
    city: 'Casablanca',
    paymentTermsDays: 60,
    active: false,
  },
];

let nextFournisseurId = SEED_FOURNISSEURS.length + 1;

@Injectable({ providedIn: 'root' })
export class FournisseurApi {
  getFournisseurs(): Observable<Fournisseur[]> {
    return of([...SEED_FOURNISSEURS]).pipe(delay(200));
  }

  createFournisseur(draft: FournisseurDraft): Observable<Fournisseur> {
    const fournisseur: Fournisseur = { id: nextFournisseurId++, ...draft };
    SEED_FOURNISSEURS.push(fournisseur);
    return of(fournisseur).pipe(delay(200));
  }

  updateFournisseur(id: number, draft: FournisseurDraft): Observable<Fournisseur> {
    const idx = SEED_FOURNISSEURS.findIndex((f) => f.id === id);
    const updated = idx >= 0 ? { ...SEED_FOURNISSEURS[idx], ...draft } : { id, ...draft };
    if (idx >= 0) {
      SEED_FOURNISSEURS[idx] = updated;
    }
    return of(updated).pipe(delay(200));
  }

  deleteFournisseur(id: number): Observable<void> {
    const idx = SEED_FOURNISSEURS.findIndex((f) => f.id === id);
    if (idx >= 0) {
      SEED_FOURNISSEURS.splice(idx, 1);
    }
    return of(undefined).pipe(delay(200));
  }
}
