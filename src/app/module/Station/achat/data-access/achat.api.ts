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
  RetourFournisseur,
  RetourFournisseurDraft,
  assignAvoirFournisseurLineIds,
  assignCommandeAchatLineIds,
  assignDevisAchatLineIds,
  assignFactureFournisseurLineIds,
  assignReceptionLineIds,
  assignRetourFournisseurLineIds,
  computeAvoirFournisseurMontant,
  computeCommandeAchatMontant,
  computeDevisAchatEffectiveTva,
  computeDevisAchatMontantHT,
  computeDevisAchatMontantTTC,
  computeFactureFournisseurMontantTTC,
  computeReceptionMontant,
  computeRetourFournisseurMontant,
  nextAvoirFournisseurNumber,
  nextCommandeAchatNumber,
  nextDevisAchatNumber,
  nextFactureFournisseurNumber,
  nextReceptionNumber,
  nextRetourFournisseurNumber,
} from '../models/achat';

function randomDelay(): number {
  return 200 + Math.floor(Math.random() * 300);
}

const demoDevisAchat: DevisAchat[] = [
  {
    id: 1,
    numero: 'DAF-S-0001',
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
    numero: 'DAF-S-0002',
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
    numero: 'BCF-S-0001',
    fournisseur: 'ProClean Maroc',
    montant: 5_400,
    statut: 'confirmee',
    dateCreation: '2026-05-22',
    description: 'BC Tous produits station',
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
    numero: 'BCF-S-0002',
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
    numero: 'BR-S-0001',
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
    numero: 'BR-S-0002',
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
    numero: 'FF-S-0001',
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
    numero: 'FF-S-0002',
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
    numero: 'AF-S-0001',
    factureLiee: 'FF-S-0001',
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

const demoRetoursFournisseur: RetourFournisseur[] = [
  {
    id: 1,
    numero: 'RETF-S-0001',
    fournisseur: 'Shell Distribution',
    factureLiee: 'FF-S-0002',
    motif: 'Erreur de quantité',
    montant: 4_500,
    statut: 'envoye',
    dateCreation: '2026-06-01',
    serviceLines: [
      {
        id: 1,
        reference: 'SRV-RET-FOUR',
        designation: 'Retour fournisseur',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 3_750,
        discountPercent: 0,
        vatPercent: 20,
      },
    ],
    productLines: [],
    payments: { cash: 2_250, tpe: 2_250, bons: 0 },
  },
];

@Injectable({ providedIn: 'root' })
export class AchatApi {

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

  getRetoursFournisseur(): Observable<RetourFournisseur[]> {
    return of([...demoRetoursFournisseur]).pipe(delay(randomDelay()));
  }

  addRetourFournisseur(draft: RetourFournisseurDraft): Observable<RetourFournisseur> {
    const serviceLines = assignRetourFournisseurLineIds(draft.serviceLines, 1);
    const productLines = assignRetourFournisseurLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const retourFournisseur: RetourFournisseur = {
      id: Math.max(...demoRetoursFournisseur.map((r) => r.id), 0) + 1,
      numero: nextRetourFournisseurNumber(demoRetoursFournisseur),
      fournisseur: draft.fournisseur,
      factureLiee: draft.factureLiee,
      motif: draft.motif,
      montant: computeRetourFournisseurMontant(totals),
      statut: draft.statut,
      dateCreation: draft.dateCreation || new Date().toISOString().split('T')[0],
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoRetoursFournisseur.push(retourFournisseur);
    return of(retourFournisseur).pipe(delay(randomDelay()));
  }

  updateRetourFournisseur(id: number, draft: RetourFournisseurDraft): Observable<RetourFournisseur> {
    const idx = demoRetoursFournisseur.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new Error('Retour fournisseur introuvable');
    }
    const serviceLines = assignRetourFournisseurLineIds(draft.serviceLines, 1);
    const productLines = assignRetourFournisseurLineIds(
      draft.productLines,
      serviceLines.length > 0 ? Math.max(...serviceLines.map((l) => l.id)) + 1 : 1,
    );
    const totals = { serviceLines, productLines };
    const updated: RetourFournisseur = {
      ...demoRetoursFournisseur[idx],
      fournisseur: draft.fournisseur,
      factureLiee: draft.factureLiee,
      motif: draft.motif,
      montant: computeRetourFournisseurMontant(totals),
      statut: draft.statut,
      dateCreation: draft.dateCreation,
      serviceLines,
      productLines,
      payments: { ...draft.payments },
    };
    demoRetoursFournisseur[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeRetourFournisseur(id: number): Observable<boolean> {
    const idx = demoRetoursFournisseur.findIndex((r) => r.id === id);
    if (idx !== -1) {
      demoRetoursFournisseur.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }
}
