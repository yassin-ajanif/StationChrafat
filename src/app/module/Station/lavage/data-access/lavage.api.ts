import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  AvoirFournisseur,
  CommandeAchat,
  DevisAchat,
  FactureFournisseur,
  Reception,
} from '../models/achat';
import { StockOverview } from '../models/stock-overview';
import {
  Avoir,
  Commande,
  computeTTC,
  Devis,
  DevisDraft,
  Facture,
  Livraison,
  nextDevisNumber,
} from '../models/ventes';

function randomDelay(): number {
  return 200 + Math.floor(Math.random() * 300);
}

const demoDevis: Devis[] = [
  {
    id: 1,
    numero: 'DEV-L-0001',
    client: 'Garage Al Amal',
    montantHT: 1_200,
    tva: 20,
    montantTTC: 1_440,
    statut: 'accepte',
    dateCreation: '2026-05-15',
    dateValidite: '2026-06-15',
    notes: 'Contrat lavage flotte mensuel',
  },
  {
    id: 2,
    numero: 'DEV-L-0002',
    client: 'Transport Rif',
    montantHT: 850,
    tva: 20,
    montantTTC: 1_020,
    statut: 'brouillon',
    dateCreation: '2026-05-22',
    dateValidite: '2026-06-22',
    notes: 'Devis lavage express',
  },
];

const demoCommandes: Commande[] = [
  {
    id: 1,
    numero: 'CMD-L-0001',
    client: 'Garage Al Amal',
    montant: 1_440,
    statut: 'confirmee',
    dateCreation: '2026-05-16',
    description: 'Bon de commande lavage complet',
  },
  {
    id: 2,
    numero: 'CMD-L-0002',
    client: 'Auto Clean',
    montant: 750,
    statut: 'en_attente',
    dateCreation: '2026-06-01',
    description: 'Lavage chassis x10',
  },
];

const demoLivraisons: Livraison[] = [
  {
    id: 1,
    numero: 'LIV-L-0001',
    client: 'Garage Al Amal',
    dateLivraison: '2026-05-18',
    statut: 'livree',
    adresse: 'Zone Industrielle',
    description: 'Prestation lavage livrée',
  },
  {
    id: 2,
    numero: 'LIV-L-0002',
    client: 'Auto Clean',
    dateLivraison: '2026-06-05',
    statut: 'planifiee',
    adresse: 'Casablanca',
    description: 'Livraison service prévue',
  },
];

const demoFactures: Facture[] = [
  {
    id: 1,
    numero: 'FAC-L-0001',
    client: 'Fleet Maroc',
    montantTTC: 12_500,
    statut: 'emise',
    dateEmission: '2026-06-01',
    dateEcheance: '2026-07-01',
  },
  {
    id: 2,
    numero: 'FAC-L-0002',
    client: 'Trans Nord',
    montantTTC: 48_200,
    statut: 'payee',
    dateEmission: '2026-05-15',
    dateEcheance: '2026-06-15',
  },
];

const demoAvoirs: Avoir[] = [
  {
    id: 1,
    numero: 'AVR-L-0001',
    factureLiee: 'FAC-L-0001',
    client: 'Fleet Maroc',
    montant: 500,
    statut: 'emis',
    dateEmission: '2026-06-03',
  },
];

const demoDevisAchat: DevisAchat[] = [
  {
    id: 1,
    numero: 'DAF-L-0001',
    fournisseur: 'ProClean Maroc',
    montantHT: 4_500,
    tva: 20,
    montantTTC: 5_400,
    statut: 'accepte',
    dateCreation: '2026-05-20',
    dateValidite: '2026-06-20',
    notes: 'Shampoing et cire — trimestre',
  },
  {
    id: 2,
    numero: 'DAF-L-0002',
    fournisseur: 'Distrib Auto',
    montantHT: 2_800,
    tva: 20,
    montantTTC: 3_360,
    statut: 'envoye',
    dateCreation: '2026-06-01',
    dateValidite: '2026-07-01',
    notes: 'Nettoyant jantes',
  },
];

const demoCommandesAchat: CommandeAchat[] = [
  {
    id: 1,
    numero: 'BCF-L-0001',
    fournisseur: 'ProClean Maroc',
    montant: 5_400,
    statut: 'confirmee',
    dateCreation: '2026-05-22',
    description: 'BC consommables lavage',
  },
  {
    id: 2,
    numero: 'BCF-L-0002',
    fournisseur: 'Distrib Auto',
    montant: 3_360,
    statut: 'en_attente',
    dateCreation: '2026-06-02',
    description: 'BC produits entretien',
  },
];

const demoReceptions: Reception[] = [
  {
    id: 1,
    numero: 'BR-L-0001',
    fournisseur: 'ProClean Maroc',
    dateReception: '2026-06-08',
    statut: 'planifiee',
    reference: 'BL-PC-88421',
    description: 'Réception shampoing',
  },
  {
    id: 2,
    numero: 'BR-L-0002',
    fournisseur: 'Distrib Auto',
    dateReception: '2026-05-30',
    statut: 'recue',
    reference: 'BL-DA-12005',
    description: 'Réception cire confirmée',
  },
];

const demoFacturesFournisseur: FactureFournisseur[] = [
  {
    id: 1,
    numero: 'FF-L-0001',
    fournisseur: 'TotalEnergies Maroc',
    montantTTC: 456_000,
    statut: 'recue',
    dateReception: '2026-06-10',
    dateEcheance: '2026-07-10',
  },
  {
    id: 2,
    numero: 'FF-L-0002',
    fournisseur: 'Shell Distribution',
    montantTTC: 89_500,
    statut: 'payee',
    dateReception: '2026-05-28',
    dateEcheance: '2026-06-28',
  },
];

const demoAvoirsFournisseur: AvoirFournisseur[] = [
  {
    id: 1,
    numero: 'AF-L-0001',
    factureLiee: 'FF-L-0001',
    fournisseur: 'TotalEnergies Maroc',
    montant: 2_400,
    statut: 'recu',
    dateReception: '2026-06-12',
  },
];

const demoStockOverview: StockOverview = {
  sectionTitle: 'Consommables lavage',
  items: [
    { id: 1, name: 'Shampoing', unit: 'L', quantityOnHand: 120, minThreshold: 40, status: 'optimal' },
    { id: 2, name: 'Cire', unit: 'L', quantityOnHand: 35, minThreshold: 30, status: 'alerte' },
    { id: 3, name: 'Nettoyant jantes', unit: 'L', quantityOnHand: 12, minThreshold: 25, status: 'critique' },
    { id: 4, name: 'Dégraissant', unit: 'L', quantityOnHand: 48, minThreshold: 20, status: 'optimal' },
    { id: 5, name: 'Polish', unit: 'u', quantityOnHand: 18, minThreshold: 10, status: 'optimal' },
  ],
};

@Injectable({ providedIn: 'root' })
export class LavageApi {
  getStockOverview(): Observable<StockOverview> {
    return of({ ...demoStockOverview }).pipe(delay(300));
  }

  getDevis(): Observable<Devis[]> {
    return of([...demoDevis]).pipe(delay(randomDelay()));
  }

  addDevis(draft: DevisDraft): Observable<Devis> {
    const devis: Devis = {
      id: Math.max(...demoDevis.map((d) => d.id), 0) + 1,
      numero: nextDevisNumber(demoDevis),
      client: draft.client,
      montantHT: draft.montantHT,
      tva: draft.tva,
      montantTTC: computeTTC(draft.montantHT, draft.tva),
      statut: draft.statut,
      dateCreation: new Date().toISOString().split('T')[0],
      dateValidite: draft.dateValidite,
      notes: draft.notes,
    };
    demoDevis.push(devis);
    return of(devis).pipe(delay(randomDelay()));
  }

  updateDevis(id: number, draft: DevisDraft): Observable<Devis> {
    const idx = demoDevis.findIndex((d) => d.id === id);
    if (idx === -1) {
      throw new Error('Devis introuvable');
    }
    const updated: Devis = {
      ...demoDevis[idx],
      client: draft.client,
      montantHT: draft.montantHT,
      tva: draft.tva,
      montantTTC: computeTTC(draft.montantHT, draft.tva),
      statut: draft.statut,
      dateValidite: draft.dateValidite,
      notes: draft.notes,
    };
    demoDevis[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeDevis(id: number): Observable<boolean> {
    const idx = demoDevis.findIndex((d) => d.id === id);
    if (idx !== -1) {
      demoDevis.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getCommandes(): Observable<Commande[]> {
    return of([...demoCommandes]).pipe(delay(randomDelay()));
  }

  getLivraisons(): Observable<Livraison[]> {
    return of([...demoLivraisons]).pipe(delay(randomDelay()));
  }

  getFactures(): Observable<Facture[]> {
    return of([...demoFactures]).pipe(delay(randomDelay()));
  }

  getAvoirs(): Observable<Avoir[]> {
    return of([...demoAvoirs]).pipe(delay(randomDelay()));
  }

  getDevisAchat(): Observable<DevisAchat[]> {
    return of([...demoDevisAchat]).pipe(delay(randomDelay()));
  }

  getCommandesAchat(): Observable<CommandeAchat[]> {
    return of([...demoCommandesAchat]).pipe(delay(randomDelay()));
  }

  getReceptions(): Observable<Reception[]> {
    return of([...demoReceptions]).pipe(delay(randomDelay()));
  }

  getFacturesFournisseur(): Observable<FactureFournisseur[]> {
    return of([...demoFacturesFournisseur]).pipe(delay(randomDelay()));
  }

  getAvoirsFournisseur(): Observable<AvoirFournisseur[]> {
    return of([...demoAvoirsFournisseur]).pipe(delay(randomDelay()));
  }
}
