import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  AvoirFournisseur,
  CommandeAchat,
  DevisAchat,
  FactureFournisseur,
  Reception,
} from '../models/achat';
import {
  CanopyFuelType,
  NozzleLiveStatus,
  StockOverview,
  TankLevelStatus,
} from '../models/stock-overview';
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
    numero: 'DEV-C-0001',
    client: 'Station Service Tanger',
    montantHT: 45_000,
    tva: 20,
    montantTTC: 54_000,
    statut: 'envoye',
    dateCreation: '2026-05-28',
    dateValidite: '2026-06-28',
    notes: 'Approvisionnement gazoil juin',
  },
  {
    id: 2,
    numero: 'DEV-C-0002',
    client: 'Transport Union',
    montantHT: 32_000,
    tva: 20,
    montantTTC: 38_400,
    statut: 'brouillon',
    dateCreation: '2026-06-01',
    dateValidite: '2026-07-01',
    notes: 'Devis carburant flotte',
  },
];

const demoCommandes: Commande[] = [
  {
    id: 1,
    numero: 'CMD-C-0001',
    client: 'Station Service Tanger',
    montant: 54_000,
    statut: 'en_attente',
    dateCreation: '2026-05-29',
    description: 'En attente de confirmation',
  },
  {
    id: 2,
    numero: 'CMD-C-0002',
    client: 'Fleet Maroc',
    montant: 12_500,
    statut: 'confirmee',
    dateCreation: '2026-06-02',
    description: 'Commande gazoil 5 000 L',
  },
];

const demoLivraisons: Livraison[] = [
  {
    id: 1,
    numero: 'LIV-C-0001',
    client: 'Station Service Tanger',
    dateLivraison: '2026-06-10',
    statut: 'planifiee',
    adresse: 'Avenue Mohammed V, Tanger',
    description: 'Livraison carburant prévue',
  },
  {
    id: 2,
    numero: 'LIV-C-0002',
    client: 'Fleet Maroc',
    dateLivraison: '2026-06-05',
    statut: 'livree',
    adresse: 'Zone industrielle, Casablanca',
    description: 'Livraison effectuée',
  },
];

const demoFactures: Facture[] = [
  {
    id: 1,
    numero: 'FAC-C-0001',
    client: 'Fleet Maroc',
    montantTTC: 12_500,
    statut: 'emise',
    dateEmission: '2026-06-01',
    dateEcheance: '2026-07-01',
  },
  {
    id: 2,
    numero: 'FAC-C-0002',
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
    numero: 'AVR-C-0001',
    factureLiee: 'FAC-C-0001',
    client: 'Fleet Maroc',
    montant: 500,
    statut: 'emis',
    dateEmission: '2026-06-03',
  },
];

const demoDevisAchat: DevisAchat[] = [
  {
    id: 1,
    numero: 'DAF-C-0001',
    fournisseur: 'TotalEnergies Maroc',
    montantHT: 380_000,
    tva: 20,
    montantTTC: 456_000,
    statut: 'accepte',
    dateCreation: '2026-05-20',
    dateValidite: '2026-06-20',
    notes: 'Approvisionnement gazoil 40 000 L',
  },
  {
    id: 2,
    numero: 'DAF-C-0002',
    fournisseur: 'Afriquia',
    montantHT: 125_000,
    tva: 20,
    montantTTC: 150_000,
    statut: 'envoye',
    dateCreation: '2026-06-01',
    dateValidite: '2026-07-01',
    notes: 'Devis SP-95',
  },
];

const demoCommandesAchat: CommandeAchat[] = [
  {
    id: 1,
    numero: 'BCF-C-0001',
    fournisseur: 'TotalEnergies Maroc',
    montant: 456_000,
    statut: 'confirmee',
    dateCreation: '2026-05-22',
    description: 'BC gazoil juin',
  },
  {
    id: 2,
    numero: 'BCF-C-0002',
    fournisseur: 'Shell Distribution',
    montant: 89_500,
    statut: 'en_attente',
    dateCreation: '2026-06-02',
    description: 'BC excellium',
  },
];

const demoReceptions: Reception[] = [
  {
    id: 1,
    numero: 'BR-C-0001',
    fournisseur: 'TotalEnergies Maroc',
    dateReception: '2026-06-08',
    statut: 'planifiee',
    reference: 'BL-TE-88421',
    description: 'Réception citerne gazoil',
  },
  {
    id: 2,
    numero: 'BR-C-0002',
    fournisseur: 'Afriquia',
    dateReception: '2026-05-30',
    statut: 'recue',
    reference: 'BL-AF-12005',
    description: 'Réception SP-95 confirmée',
  },
];

const demoFacturesFournisseur: FactureFournisseur[] = [
  {
    id: 1,
    numero: 'FF-C-0001',
    fournisseur: 'TotalEnergies Maroc',
    montantTTC: 456_000,
    statut: 'recue',
    dateReception: '2026-06-10',
    dateEcheance: '2026-07-10',
  },
  {
    id: 2,
    numero: 'FF-C-0002',
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
    numero: 'AF-C-0001',
    factureLiee: 'FF-C-0001',
    fournisseur: 'TotalEnergies Maroc',
    montant: 2_400,
    statut: 'recu',
    dateReception: '2026-06-12',
  },
];

@Injectable({ providedIn: 'root' })
export class CarburantApi {
  getStockOverview(): Observable<StockOverview> {
    const nozzleSeeds = [
      { pumpLabel: 'P01', lineNumber: 1, fuelLabel: 'GASOIL' as CanopyFuelType, currentIndexLiters: 450.2, indexEntree: 125_450.2, indexSortie: 125_000, status: 'libre' as NozzleLiveStatus },
      { pumpLabel: 'P02', lineNumber: 1, fuelLabel: 'SANS PLOMB' as CanopyFuelType, currentIndexLiters: 1_240.5, indexEntree: 98_240.5, indexSortie: 97_000, status: 'en_cours' as NozzleLiveStatus },
      { pumpLabel: 'P03', lineNumber: 1, fuelLabel: 'EXCELLIUM' as CanopyFuelType, currentIndexLiters: 315.4, indexEntree: 88_315.4, indexSortie: 88_000, status: 'attente' as NozzleLiveStatus },
      { pumpLabel: 'P04', lineNumber: 2, fuelLabel: 'GASOIL' as CanopyFuelType, currentIndexLiters: 820.0, indexEntree: 210_820, indexSortie: 210_000, status: 'en_cours' as NozzleLiveStatus },
      { pumpLabel: 'P05', lineNumber: 2, fuelLabel: 'SANS PLOMB' as CanopyFuelType, currentIndexLiters: 540.0, indexEntree: 52_540, indexSortie: 52_000, status: 'libre' as NozzleLiveStatus },
      { pumpLabel: 'P06', lineNumber: 2, fuelLabel: 'EXCELLIUM' as CanopyFuelType, currentIndexLiters: 680.0, indexEntree: 41_680, indexSortie: 41_000, status: 'libre' as NozzleLiveStatus },
      { pumpLabel: 'P07', lineNumber: 3, fuelLabel: 'GASOIL' as CanopyFuelType, currentIndexLiters: 2_150.8, indexEntree: 312_150.8, indexSortie: 310_000, status: 'en_cours' as NozzleLiveStatus },
      { pumpLabel: 'P08', lineNumber: 3, fuelLabel: 'SANS PLOMB' as CanopyFuelType, currentIndexLiters: 420.0, indexEntree: 76_420, indexSortie: 76_000, status: 'attente' as NozzleLiveStatus },
      { pumpLabel: 'P09', lineNumber: 3, fuelLabel: 'EXCELLIUM' as CanopyFuelType, currentIndexLiters: 290.5, indexEntree: 33_290.5, indexSortie: 33_000, status: 'libre' as NozzleLiveStatus },
      { pumpLabel: 'P10', lineNumber: 4, fuelLabel: 'GASOIL' as CanopyFuelType, currentIndexLiters: 610.0, indexEntree: 145_610, indexSortie: 145_000, status: 'libre' as NozzleLiveStatus },
      { pumpLabel: 'P11', lineNumber: 4, fuelLabel: 'SANS PLOMB' as CanopyFuelType, currentIndexLiters: 980.2, indexEntree: 62_980.2, indexSortie: 62_000, status: 'en_cours' as NozzleLiveStatus },
      { pumpLabel: 'P12', lineNumber: 4, fuelLabel: 'EXCELLIUM' as CanopyFuelType, currentIndexLiters: 0, indexEntree: null, indexSortie: null, status: 'hors_service' as NozzleLiveStatus },
    ];

    return of({
      canopyName: 'Auvent principal',
      lineCount: 4,
      nozzles: nozzleSeeds.map((seed, index) => ({ id: index + 1, ...seed })),
      tanks: [
        { id: 1, name: 'Sans Plomb', subtitle: 'SP-95 Industrial', currentLiters: 28_800, maxCapacityLiters: 40_000, sales24hLiters: 4_200, status: 'optimal' as TankLevelStatus },
        { id: 2, name: 'Gazole', subtitle: 'Gasoil Standard', currentLiters: 17_000, maxCapacityLiters: 50_000, sales24hLiters: 8_500, status: 'alerte' as TankLevelStatus },
        { id: 3, name: 'Gazole Excellium', subtitle: 'Premium Diesel', currentLiters: 3_600, maxCapacityLiters: 30_000, sales24hLiters: 2_100, status: 'critique' as TankLevelStatus },
      ],
    }).pipe(delay(300));
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
