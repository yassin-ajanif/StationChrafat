import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  AvoirFournisseur,
  AvoirFournisseurDraft,
  CommandeAchat,
  CommandeAchatDraft,
  DevisAchat,
  DevisAchatDraft,
  FactureFournisseur,
  FactureFournisseurDraft,
  Reception,
  ReceptionDraft,
  assignAvoirFournisseurLineIds,
  assignCommandeAchatLineIds,
  assignDevisAchatLineIds,
  assignFactureFournisseurLineIds,
  assignReceptionLineIds,
  computeAvoirFournisseurMontant,
  computeCommandeAchatMontant,
  computeDevisAchatEffectiveTva,
  computeDevisAchatMontantHT,
  computeDevisAchatMontantTTC,
  computeFactureFournisseurMontantTTC,
  computeReceptionMontant,
  nextAvoirFournisseurNumber,
  nextCommandeAchatNumber,
  nextDevisAchatNumber,
  nextFactureFournisseurNumber,
  nextReceptionNumber,
} from '../models/achat';
import { StockOverview } from '../models/stock-overview';
import {
  Avoir,
  AvoirDraft,
  Commande,
  CommandeDraft,
  Devis,
  DevisDraft,
  Facture,
  FactureDraft,
  Livraison,
  LivraisonDraft,
  assignAvoirLineIds,
  assignCommandeLineIds,
  assignDevisLineIds,
  assignFactureLineIds,
  assignLivraisonLineIds,
  computeAvoirMontant,
  computeCommandeMontant,
  computeDevisMontantHT,
  computeDevisMontantTTC,
  computeEffectiveTva,
  computeFactureMontantTTC,
  computeLivraisonMontant,
  nextAvoirNumber,
  nextCommandeNumber,
  nextDevisNumber,
  nextFactureNumber,
  nextLivraisonNumber,
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-LAV-COMP',
        designation: 'Lavage complet',
        quantity: 40,
        unit: 'u',
        unitPriceHT: 25,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [
      {
        id: 2,
        reference: 'PRD-SHAM',
        designation: 'Shampoing',
        quantity: 10,
        unit: 'L',
        unitPriceHT: 20,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    payments: { cash: 720, tpe: 720, bons: 0 },
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
    serviceLines: [
      {
        id: 3,
        reference: 'SRV-LAV-EXP',
        designation: 'Lavage express',
        quantity: 34,
        unit: 'u',
        unitPriceHT: 25,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 0, tpe: 0, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-LAV-COMP',
        designation: 'Lavage complet',
        quantity: 40,
        unit: 'u',
        unitPriceHT: 25,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [
      {
        id: 2,
        reference: 'PRD-SHAM',
        designation: 'Shampoing',
        quantity: 10,
        unit: 'L',
        unitPriceHT: 20,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    payments: { cash: 720, tpe: 720, bons: 0 },
  },
  {
    id: 2,
    numero: 'CMD-L-0002',
    client: 'Auto Clean',
    montant: 750,
    statut: 'en_attente',
    dateCreation: '2026-06-01',
    description: 'Lavage chassis x10',
    serviceLines: [
      {
        id: 3,
        reference: 'SRV-LAV-CHS',
        designation: 'Lavage chassis',
        quantity: 10,
        unit: 'u',
        unitPriceHT: 62.5,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 0, tpe: 0, bons: 0 },
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
    montant: 1_440,
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-LAV-COMP',
        designation: 'Lavage complet',
        quantity: 40,
        unit: 'u',
        unitPriceHT: 25,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [
      {
        id: 2,
        reference: 'PRD-SHAM',
        designation: 'Shampoing',
        quantity: 10,
        unit: 'L',
        unitPriceHT: 20,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    payments: { cash: 720, tpe: 720, bons: 0 },
  },
  {
    id: 2,
    numero: 'LIV-L-0002',
    client: 'Auto Clean',
    dateLivraison: '2026-06-05',
    statut: 'planifiee',
    adresse: 'Casablanca',
    description: 'Livraison service prévue',
    montant: 750,
    serviceLines: [
      {
        id: 3,
        reference: 'SRV-LAV-EXP',
        designation: 'Lavage express',
        quantity: 25,
        unit: 'u',
        unitPriceHT: 25,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 0, tpe: 0, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-LAV-FLOTTE',
        designation: 'Lavage flotte',
        quantity: 400,
        unit: 'u',
        unitPriceHT: 26,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 6_250, tpe: 6_250, bons: 0 },
  },
  {
    id: 2,
    numero: 'FAC-L-0002',
    client: 'Trans Nord',
    montantTTC: 48_200,
    statut: 'payee',
    dateEmission: '2026-05-15',
    dateEcheance: '2026-06-15',
    serviceLines: [
      {
        id: 2,
        reference: 'SRV-LAV-PRO',
        designation: 'Lavage pro',
        quantity: 1_600,
        unit: 'u',
        unitPriceHT: 25.1,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 24_100, tpe: 24_100, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-AVOIR',
        designation: 'Avoir lavage flotte',
        quantity: 1,
        unit: 'u',
        unitPriceHT: 416.67,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 250, tpe: 250, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-APPRO',
        designation: 'Approvisionnement consommables',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 4_500,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 2_700, tpe: 2_700, bons: 0 },
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
    serviceLines: [
      {
        id: 2,
        reference: 'SRV-PROD',
        designation: 'Fourniture produits entretien',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 2_800,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 0, tpe: 0, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-APPRO',
        designation: 'Approvisionnement consommables',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 4_500,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 2_700, tpe: 2_700, bons: 0 },
  },
  {
    id: 2,
    numero: 'BCF-L-0002',
    fournisseur: 'Distrib Auto',
    montant: 3_360,
    statut: 'en_attente',
    dateCreation: '2026-06-02',
    description: 'BC produits entretien',
    serviceLines: [
      {
        id: 2,
        reference: 'SRV-PROD',
        designation: 'Fourniture produits entretien',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 2_800,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 0, tpe: 0, bons: 0 },
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
    montant: 5_400,
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-REC',
        designation: 'Réception consommables',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 4_500,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 0, tpe: 0, bons: 0 },
  },
  {
    id: 2,
    numero: 'BR-L-0002',
    fournisseur: 'Distrib Auto',
    dateReception: '2026-05-30',
    statut: 'recue',
    reference: 'BL-DA-12005',
    description: 'Réception cire confirmée',
    montant: 3_360,
    serviceLines: [
      {
        id: 2,
        reference: 'SRV-REC',
        designation: 'Réception produits',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 2_800,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 1_680, tpe: 1_680, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-FF',
        designation: 'Facture fournisseur consommables',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 380_000,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 228_000, tpe: 228_000, bons: 0 },
  },
  {
    id: 2,
    numero: 'FF-L-0002',
    fournisseur: 'Shell Distribution',
    montantTTC: 89_500,
    statut: 'payee',
    dateReception: '2026-05-28',
    dateEcheance: '2026-06-28',
    serviceLines: [
      {
        id: 2,
        reference: 'SRV-FF',
        designation: 'Facture fournisseur produits',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 74_583.33,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 44_750, tpe: 44_750, bons: 0 },
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
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-AF',
        designation: 'Avoir fournisseur',
        quantity: 1,
        unit: 'u',
        unitPriceHT: 2_000,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 1_200, tpe: 1_200, bons: 0 },
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
    const serviceLines = assignDevisLineIds(draft.serviceLines, 1);
    const productLines = assignDevisLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const montantHT = computeDevisMontantHT(totals);
    const montantTTC = computeDevisMontantTTC(totals);
    const devis: Devis = {
      id: Math.max(...demoDevis.map((d) => d.id), 0) + 1,
      numero: nextDevisNumber(demoDevis),
      client: draft.client,
      montantHT,
      tva: computeEffectiveTva(montantHT, montantTTC),
      montantTTC,
      statut: draft.statut,
      dateCreation: new Date().toISOString().split('T')[0],
      dateValidite: draft.dateValidite,
      notes: draft.notes,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoDevis.push(devis);
    return of(devis).pipe(delay(randomDelay()));
  }

  updateDevis(id: number, draft: DevisDraft): Observable<Devis> {
    const idx = demoDevis.findIndex((d) => d.id === id);
    if (idx === -1) {
      throw new Error('Devis introuvable');
    }
    const serviceLines = assignDevisLineIds(draft.serviceLines, 1);
    const productLines = assignDevisLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const montantHT = computeDevisMontantHT(totals);
    const montantTTC = computeDevisMontantTTC(totals);
    const updated: Devis = {
      ...demoDevis[idx],
      client: draft.client,
      montantHT,
      tva: computeEffectiveTva(montantHT, montantTTC),
      montantTTC,
      statut: draft.statut,
      dateValidite: draft.dateValidite,
      notes: draft.notes,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
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

  addCommande(draft: CommandeDraft): Observable<Commande> {
    const serviceLines = assignCommandeLineIds(draft.serviceLines, 1);
    const productLines = assignCommandeLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const commande: Commande = {
      id: Math.max(...demoCommandes.map((c) => c.id), 0) + 1,
      numero: nextCommandeNumber(demoCommandes),
      client: draft.client,
      montant: computeCommandeMontant(totals),
      statut: draft.statut,
      dateCreation: new Date().toISOString().split('T')[0],
      description: draft.description,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoCommandes.push(commande);
    return of(commande).pipe(delay(randomDelay()));
  }

  updateCommande(id: number, draft: CommandeDraft): Observable<Commande> {
    const idx = demoCommandes.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new Error('Commande introuvable');
    }
    const serviceLines = assignCommandeLineIds(draft.serviceLines, 1);
    const productLines = assignCommandeLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Commande = {
      ...demoCommandes[idx],
      client: draft.client,
      montant: computeCommandeMontant(totals),
      statut: draft.statut,
      description: draft.description,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoCommandes[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeCommande(id: number): Observable<boolean> {
    const idx = demoCommandes.findIndex((c) => c.id === id);
    if (idx !== -1) {
      demoCommandes.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getLivraisons(): Observable<Livraison[]> {
    return of([...demoLivraisons]).pipe(delay(randomDelay()));
  }

  addLivraison(draft: LivraisonDraft): Observable<Livraison> {
    const serviceLines = assignLivraisonLineIds(draft.serviceLines, 1);
    const productLines = assignLivraisonLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const livraison: Livraison = {
      id: Math.max(...demoLivraisons.map((l) => l.id), 0) + 1,
      numero: nextLivraisonNumber(demoLivraisons),
      client: draft.client,
      dateLivraison: draft.dateLivraison || new Date().toISOString().split('T')[0],
      statut: draft.statut,
      adresse: draft.adresse,
      description: draft.description,
      montant: computeLivraisonMontant(totals),
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoLivraisons.push(livraison);
    return of(livraison).pipe(delay(randomDelay()));
  }

  updateLivraison(id: number, draft: LivraisonDraft): Observable<Livraison> {
    const idx = demoLivraisons.findIndex((l) => l.id === id);
    if (idx === -1) {
      throw new Error('Livraison introuvable');
    }
    const serviceLines = assignLivraisonLineIds(draft.serviceLines, 1);
    const productLines = assignLivraisonLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Livraison = {
      ...demoLivraisons[idx],
      client: draft.client,
      dateLivraison: draft.dateLivraison,
      statut: draft.statut,
      adresse: draft.adresse,
      description: draft.description,
      montant: computeLivraisonMontant(totals),
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoLivraisons[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeLivraison(id: number): Observable<boolean> {
    const idx = demoLivraisons.findIndex((l) => l.id === id);
    if (idx !== -1) {
      demoLivraisons.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getFactures(): Observable<Facture[]> {
    return of([...demoFactures]).pipe(delay(randomDelay()));
  }

  addFacture(draft: FactureDraft): Observable<Facture> {
    const serviceLines = assignFactureLineIds(draft.serviceLines, 1);
    const productLines = assignFactureLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const facture: Facture = {
      id: Math.max(...demoFactures.map((f) => f.id), 0) + 1,
      numero: nextFactureNumber(demoFactures),
      client: draft.client,
      montantTTC: computeFactureMontantTTC(totals),
      statut: draft.statut,
      dateEmission: draft.dateEmission || new Date().toISOString().split('T')[0],
      dateEcheance: draft.dateEcheance,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoFactures.push(facture);
    return of(facture).pipe(delay(randomDelay()));
  }

  updateFacture(id: number, draft: FactureDraft): Observable<Facture> {
    const idx = demoFactures.findIndex((f) => f.id === id);
    if (idx === -1) {
      throw new Error('Facture introuvable');
    }
    const serviceLines = assignFactureLineIds(draft.serviceLines, 1);
    const productLines = assignFactureLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Facture = {
      ...demoFactures[idx],
      client: draft.client,
      montantTTC: computeFactureMontantTTC(totals),
      statut: draft.statut,
      dateEmission: draft.dateEmission,
      dateEcheance: draft.dateEcheance,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoFactures[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeFacture(id: number): Observable<boolean> {
    const idx = demoFactures.findIndex((f) => f.id === id);
    if (idx !== -1) {
      demoFactures.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getAvoirs(): Observable<Avoir[]> {
    return of([...demoAvoirs]).pipe(delay(randomDelay()));
  }

  addAvoir(draft: AvoirDraft): Observable<Avoir> {
    const serviceLines = assignAvoirLineIds(draft.serviceLines, 1);
    const productLines = assignAvoirLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const avoir: Avoir = {
      id: Math.max(...demoAvoirs.map((a) => a.id), 0) + 1,
      numero: nextAvoirNumber(demoAvoirs),
      factureLiee: draft.factureLiee,
      client: draft.client,
      montant: computeAvoirMontant(totals),
      statut: draft.statut,
      dateEmission: draft.dateEmission || new Date().toISOString().split('T')[0],
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoAvoirs.push(avoir);
    return of(avoir).pipe(delay(randomDelay()));
  }

  updateAvoir(id: number, draft: AvoirDraft): Observable<Avoir> {
    const idx = demoAvoirs.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new Error('Avoir introuvable');
    }
    const serviceLines = assignAvoirLineIds(draft.serviceLines, 1);
    const productLines = assignAvoirLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Avoir = {
      ...demoAvoirs[idx],
      factureLiee: draft.factureLiee,
      client: draft.client,
      montant: computeAvoirMontant(totals),
      statut: draft.statut,
      dateEmission: draft.dateEmission,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoAvoirs[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeAvoir(id: number): Observable<boolean> {
    const idx = demoAvoirs.findIndex((a) => a.id === id);
    if (idx !== -1) {
      demoAvoirs.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getDevisAchat(): Observable<DevisAchat[]> {
    return of([...demoDevisAchat]).pipe(delay(randomDelay()));
  }

  addDevisAchat(draft: DevisAchatDraft): Observable<DevisAchat> {
    const serviceLines = assignDevisAchatLineIds(draft.serviceLines, 1);
    const productLines = assignDevisAchatLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const montantHT = computeDevisAchatMontantHT(totals);
    const montantTTC = computeDevisAchatMontantTTC(totals);
    const devisAchat: DevisAchat = {
      id: Math.max(...demoDevisAchat.map((d) => d.id), 0) + 1,
      numero: nextDevisAchatNumber(demoDevisAchat),
      fournisseur: draft.fournisseur,
      montantHT,
      tva: computeDevisAchatEffectiveTva(montantHT, montantTTC),
      montantTTC,
      statut: draft.statut,
      dateCreation: new Date().toISOString().split('T')[0],
      dateValidite: draft.dateValidite,
      notes: draft.notes,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoDevisAchat.push(devisAchat);
    return of(devisAchat).pipe(delay(randomDelay()));
  }

  updateDevisAchat(id: number, draft: DevisAchatDraft): Observable<DevisAchat> {
    const idx = demoDevisAchat.findIndex((d) => d.id === id);
    if (idx === -1) {
      throw new Error('Devis achat introuvable');
    }
    const serviceLines = assignDevisAchatLineIds(draft.serviceLines, 1);
    const productLines = assignDevisAchatLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const montantHT = computeDevisAchatMontantHT(totals);
    const montantTTC = computeDevisAchatMontantTTC(totals);
    const updated: DevisAchat = {
      ...demoDevisAchat[idx],
      fournisseur: draft.fournisseur,
      montantHT,
      tva: computeDevisAchatEffectiveTva(montantHT, montantTTC),
      montantTTC,
      statut: draft.statut,
      dateValidite: draft.dateValidite,
      notes: draft.notes,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoDevisAchat[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeDevisAchat(id: number): Observable<boolean> {
    const idx = demoDevisAchat.findIndex((d) => d.id === id);
    if (idx !== -1) {
      demoDevisAchat.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getCommandesAchat(): Observable<CommandeAchat[]> {
    return of([...demoCommandesAchat]).pipe(delay(randomDelay()));
  }

  addCommandeAchat(draft: CommandeAchatDraft): Observable<CommandeAchat> {
    const serviceLines = assignCommandeAchatLineIds(draft.serviceLines, 1);
    const productLines = assignCommandeAchatLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const commandeAchat: CommandeAchat = {
      id: Math.max(...demoCommandesAchat.map((c) => c.id), 0) + 1,
      numero: nextCommandeAchatNumber(demoCommandesAchat),
      fournisseur: draft.fournisseur,
      montant: computeCommandeAchatMontant(totals),
      statut: draft.statut,
      dateCreation: new Date().toISOString().split('T')[0],
      description: draft.description,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoCommandesAchat.push(commandeAchat);
    return of(commandeAchat).pipe(delay(randomDelay()));
  }

  updateCommandeAchat(id: number, draft: CommandeAchatDraft): Observable<CommandeAchat> {
    const idx = demoCommandesAchat.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new Error('Commande achat introuvable');
    }
    const serviceLines = assignCommandeAchatLineIds(draft.serviceLines, 1);
    const productLines = assignCommandeAchatLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: CommandeAchat = {
      ...demoCommandesAchat[idx],
      fournisseur: draft.fournisseur,
      montant: computeCommandeAchatMontant(totals),
      statut: draft.statut,
      description: draft.description,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoCommandesAchat[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeCommandeAchat(id: number): Observable<boolean> {
    const idx = demoCommandesAchat.findIndex((c) => c.id === id);
    if (idx !== -1) {
      demoCommandesAchat.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getReceptions(): Observable<Reception[]> {
    return of([...demoReceptions]).pipe(delay(randomDelay()));
  }

  addReception(draft: ReceptionDraft): Observable<Reception> {
    const serviceLines = assignReceptionLineIds(draft.serviceLines, 1);
    const productLines = assignReceptionLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const reception: Reception = {
      id: Math.max(...demoReceptions.map((r) => r.id), 0) + 1,
      numero: nextReceptionNumber(demoReceptions),
      fournisseur: draft.fournisseur,
      dateReception: draft.dateReception || new Date().toISOString().split('T')[0],
      statut: draft.statut,
      reference: draft.reference,
      description: draft.description,
      montant: computeReceptionMontant(totals),
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoReceptions.push(reception);
    return of(reception).pipe(delay(randomDelay()));
  }

  updateReception(id: number, draft: ReceptionDraft): Observable<Reception> {
    const idx = demoReceptions.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new Error('Réception introuvable');
    }
    const serviceLines = assignReceptionLineIds(draft.serviceLines, 1);
    const productLines = assignReceptionLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Reception = {
      ...demoReceptions[idx],
      fournisseur: draft.fournisseur,
      dateReception: draft.dateReception,
      statut: draft.statut,
      reference: draft.reference,
      description: draft.description,
      montant: computeReceptionMontant(totals),
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoReceptions[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeReception(id: number): Observable<boolean> {
    const idx = demoReceptions.findIndex((r) => r.id === id);
    if (idx !== -1) {
      demoReceptions.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getFacturesFournisseur(): Observable<FactureFournisseur[]> {
    return of([...demoFacturesFournisseur]).pipe(delay(randomDelay()));
  }

  addFactureFournisseur(draft: FactureFournisseurDraft): Observable<FactureFournisseur> {
    const serviceLines = assignFactureFournisseurLineIds(draft.serviceLines, 1);
    const productLines = assignFactureFournisseurLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const factureFournisseur: FactureFournisseur = {
      id: Math.max(...demoFacturesFournisseur.map((f) => f.id), 0) + 1,
      numero: nextFactureFournisseurNumber(demoFacturesFournisseur),
      fournisseur: draft.fournisseur,
      montantTTC: computeFactureFournisseurMontantTTC(totals),
      statut: draft.statut,
      dateReception: draft.dateReception || new Date().toISOString().split('T')[0],
      dateEcheance: draft.dateEcheance,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoFacturesFournisseur.push(factureFournisseur);
    return of(factureFournisseur).pipe(delay(randomDelay()));
  }

  updateFactureFournisseur(id: number, draft: FactureFournisseurDraft): Observable<FactureFournisseur> {
    const idx = demoFacturesFournisseur.findIndex((f) => f.id === id);
    if (idx === -1) {
      throw new Error('Facture fournisseur introuvable');
    }
    const serviceLines = assignFactureFournisseurLineIds(draft.serviceLines, 1);
    const productLines = assignFactureFournisseurLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: FactureFournisseur = {
      ...demoFacturesFournisseur[idx],
      fournisseur: draft.fournisseur,
      montantTTC: computeFactureFournisseurMontantTTC(totals),
      statut: draft.statut,
      dateReception: draft.dateReception,
      dateEcheance: draft.dateEcheance,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoFacturesFournisseur[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeFactureFournisseur(id: number): Observable<boolean> {
    const idx = demoFacturesFournisseur.findIndex((f) => f.id === id);
    if (idx !== -1) {
      demoFacturesFournisseur.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getAvoirsFournisseur(): Observable<AvoirFournisseur[]> {
    return of([...demoAvoirsFournisseur]).pipe(delay(randomDelay()));
  }

  addAvoirFournisseur(draft: AvoirFournisseurDraft): Observable<AvoirFournisseur> {
    const serviceLines = assignAvoirFournisseurLineIds(draft.serviceLines, 1);
    const productLines = assignAvoirFournisseurLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const avoirFournisseur: AvoirFournisseur = {
      id: Math.max(...demoAvoirsFournisseur.map((a) => a.id), 0) + 1,
      numero: nextAvoirFournisseurNumber(demoAvoirsFournisseur),
      factureLiee: draft.factureLiee,
      fournisseur: draft.fournisseur,
      montant: computeAvoirFournisseurMontant(totals),
      statut: draft.statut,
      dateReception: draft.dateReception || new Date().toISOString().split('T')[0],
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoAvoirsFournisseur.push(avoirFournisseur);
    return of(avoirFournisseur).pipe(delay(randomDelay()));
  }

  updateAvoirFournisseur(id: number, draft: AvoirFournisseurDraft): Observable<AvoirFournisseur> {
    const idx = demoAvoirsFournisseur.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new Error('Avoir fournisseur introuvable');
    }
    const serviceLines = assignAvoirFournisseurLineIds(draft.serviceLines, 1);
    const productLines = assignAvoirFournisseurLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: AvoirFournisseur = {
      ...demoAvoirsFournisseur[idx],
      factureLiee: draft.factureLiee,
      fournisseur: draft.fournisseur,
      montant: computeAvoirFournisseurMontant(totals),
      statut: draft.statut,
      dateReception: draft.dateReception,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoAvoirsFournisseur[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeAvoirFournisseur(id: number): Observable<boolean> {
    const idx = demoAvoirsFournisseur.findIndex((a) => a.id === id);
    if (idx !== -1) {
      demoAvoirsFournisseur.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }
}
