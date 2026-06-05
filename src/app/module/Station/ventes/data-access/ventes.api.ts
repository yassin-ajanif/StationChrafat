import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
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
  Retour,
  RetourDraft,
} from '../state/store';
import {
  assignLineIds,
  computeEffectiveTva,
  computeMontant,
  nextNumber,
} from './ventes.utils';
import { computeDocumentLinesTotalHT } from '../../shared/models/common/document-line.model';

function randomDelay(): number {
  return 200 + Math.floor(Math.random() * 300);
}

const demoDevis: Devis[] = [
  {
    id: 1,
    numero: 'DEV-S-0001',
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
    numero: 'DEV-S-0002',
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
    numero: 'CMD-S-0001',
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
    numero: 'CMD-S-0002',
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
    numero: 'LIV-S-0001',
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
    numero: 'LIV-S-0002',
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
    numero: 'FAC-S-0001',
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
    numero: 'FAC-S-0002',
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
    numero: 'AVR-S-0001',
    factureLiee: 'FAC-S-0001',
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

const demoRetours: Retour[] = [
  {
    id: 1,
    numero: 'RET-S-0001',
    client: 'Fleet Maroc',
    factureLiee: 'FAC-S-0001',
    motif: 'Produits défectueux',
    montant: 1_200,
    statut: 'recu',
    dateCreation: '2026-06-03',
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-RETOUR',
        designation: 'Retour produits défectueux',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 1_000,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 600, tpe: 600, bons: 0 },
  },
];

@Injectable({ providedIn: 'root' })
export class VentesApi {
  getDevis(): Observable<Devis[]> {
    return of([...demoDevis]).pipe(delay(randomDelay()));
  }

  addDevis(draft: DevisDraft): Observable<Devis> {
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const montantHT = computeDocumentLinesTotalHT(totals.serviceLines) + computeDocumentLinesTotalHT(totals.productLines);
    const montantTTC = computeMontant(totals);
    const devis: Devis = {
      id: Math.max(...demoDevis.map((d) => d.id), 0) + 1,
      numero: nextNumber(demoDevis, 'DEV-S'),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const montantHT = computeDocumentLinesTotalHT(totals.serviceLines) + computeDocumentLinesTotalHT(totals.productLines);
    const montantTTC = computeMontant(totals);
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const commande: Commande = {
      id: Math.max(...demoCommandes.map((c) => c.id), 0) + 1,
      numero: nextNumber(demoCommandes, 'CMD-S'),
      client: draft.client,
      montant: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Commande = {
      ...demoCommandes[idx],
      client: draft.client,
      montant: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const livraison: Livraison = {
      id: Math.max(...demoLivraisons.map((l) => l.id), 0) + 1,
      numero: nextNumber(demoLivraisons, 'LIV-S'),
      client: draft.client,
      dateLivraison: draft.dateLivraison || new Date().toISOString().split('T')[0],
      statut: draft.statut,
      adresse: draft.adresse,
      description: draft.description,
      montant: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
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
      montant: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const facture: Facture = {
      id: Math.max(...demoFactures.map((f) => f.id), 0) + 1,
      numero: nextNumber(demoFactures, 'FAC-S'),
      client: draft.client,
      montantTTC: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Facture = {
      ...demoFactures[idx],
      client: draft.client,
      montantTTC: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const avoir: Avoir = {
      id: Math.max(...demoAvoirs.map((a) => a.id), 0) + 1,
      numero: nextNumber(demoAvoirs, 'AVR-S'),
      factureLiee: draft.factureLiee,
      client: draft.client,
      montant: computeMontant(totals),
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
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Avoir = {
      ...demoAvoirs[idx],
      factureLiee: draft.factureLiee,
      client: draft.client,
      montant: computeMontant(totals),
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

  getRetours(): Observable<Retour[]> {
    return of([...demoRetours]).pipe(delay(randomDelay()));
  }

  addRetour(draft: RetourDraft): Observable<Retour> {
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const retour: Retour = {
      id: Math.max(...demoRetours.map((r) => r.id), 0) + 1,
      numero: nextNumber(demoRetours, 'RET-S'),
      client: draft.client,
      factureLiee: draft.factureLiee,
      motif: draft.motif,
      montant: computeMontant(totals),
      statut: draft.statut,
      dateCreation: draft.dateCreation || new Date().toISOString().split('T')[0],
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoRetours.push(retour);
    return of(retour).pipe(delay(randomDelay()));
  }

  updateRetour(id: number, draft: RetourDraft): Observable<Retour> {
    const idx = demoRetours.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new Error('Retour introuvable');
    }
    const serviceLines = assignLineIds(draft.serviceLines, 1);
    const productLines = assignLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: Retour = {
      ...demoRetours[idx],
      client: draft.client,
      factureLiee: draft.factureLiee,
      motif: draft.motif,
      montant: computeMontant(totals),
      statut: draft.statut,
      dateCreation: draft.dateCreation,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoRetours[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeRetour(id: number): Observable<boolean> {
    const idx = demoRetours.findIndex((r) => r.id === id);
    if (idx !== -1) {
      demoRetours.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }
}
