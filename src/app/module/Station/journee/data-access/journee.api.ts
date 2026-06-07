import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { BonsStep3Livraison } from '../state/journee.store';
import {
  ENCAISSEMENT_DIVERS_CLIENT_ID,
  DepenseLine,
  EncaissementClientOption,
  EncaissementLine,
  JourneeKpis,
  JourneeSummary,
  NozzleIndexLine,
  Operator,
  ShiftSlot,
  StockControlLine,
  StockControlStep6,
} from '../state/journee.store';
import { emptyPaymentSplit } from '../../shared/components/bon-recap-payments/bon-recap-payments.component';

@Injectable({ providedIn: 'root' })
export class JourneeApi {
  private readonly operators: Operator[] = [
    { id: 1, name: 'Ahmed El Mansouri' },
    { id: 2, name: 'Fatima Zahra' },
    { id: 3, name: 'Youssef Benali' },
  ];

  getOperators() {
    return of([...this.operators]).pipe(delay(200));
  }

  getKpis() {
    const kpis: JourneeKpis = {
      closedCount: 24,
      monthlyRevenue: 1_248_500,
      monthlyRevenueDeltaPercent: 12,
      avgCashDiscrepancy: -142,
      cashDiscrepancyThreshold: 500,
    };
    return of(kpis).pipe(delay(300));
  }

  getJournees() {
    const list: JourneeSummary[] = [
      {
        id: 1,
        date: '2023-10-24',
        dateLabel: '24 Octobre 2023',
        status: 'en_cours',
        caTotal: 0,
        chefDePiste: this.operators[0],
        shiftSlot: 'Matin',
      },
      {
        id: 2,
        date: '2023-10-23',
        dateLabel: '23 Octobre 2023',
        status: 'cloturee',
        caTotal: 89_136,
        chefDePiste: this.operators[0],
        shiftSlot: 'Apres-midi',
      },
      {
        id: 3,
        date: '2023-10-22',
        dateLabel: '22 Octobre 2023',
        status: 'cloturee',
        caTotal: 92_450,
        chefDePiste: this.operators[2],
        shiftSlot: 'Nuit',
      },
    ];
    return of(list).pipe(delay(400));
  }

  startJournee(payload: {
    chefDePisteId: number;
    shiftSlot: ShiftSlot;
  }) {
    return of({ id: 99, ...payload, openedAt: new Date().toISOString() }).pipe(delay(500));
  }

  hasActiveJournee() {
    return of(true).pipe(delay(100));
  }

  getNozzleIndexLines() {
    const lines: NozzleIndexLine[] = [
      {
        id: 1,
        nozzleId: 101,
        bombisteId: 1,
        island: 'ILOT 1',
        pumpLabel: 'L1-P01',
        fuelCode: 'SSP',
        fuelLabel: 'SSP',
        fuelColor: '#2563eb',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 0,
        unitPrice: 14.85,
        status: 'active',
      },
      {
        id: 2,
        nozzleId: 102,
        bombisteId: 1,
        island: 'ILOT 1',
        pumpLabel: 'L1-P02',
        fuelCode: 'SSP_VP',
        fuelLabel: 'SSP VP',
        fuelColor: '#7c3aed',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 0,
        unitPrice: 15.1,
        status: 'active',
      },
      {
        id: 3,
        nozzleId: 103,
        bombisteId: 1,
        island: 'ILOT 1',
        pumpLabel: 'L1-P03',
        fuelCode: 'GAS',
        fuelLabel: 'GAS',
        fuelColor: '#16a34a',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 0,
        unitPrice: 13.2,
        status: 'active',
      },
      {
        id: 4,
        nozzleId: 104,
        bombisteId: 1,
        island: 'ILOT 1',
        pumpLabel: 'L1-P04',
        fuelCode: 'SSP',
        fuelLabel: 'SSP',
        fuelColor: '#2563eb',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 12.5,
        unitPrice: 14.85,
        status: 'active',
      },
      {
        id: 5,
        nozzleId: 105,
        bombisteId: 1,
        island: 'ILOT 1',
        pumpLabel: 'L1-P05',
        fuelCode: 'SSP',
        fuelLabel: 'SSP',
        fuelColor: '#2563eb',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 0,
        unitPrice: 14.85,
        status: 'offline',
      },
      {
        id: 6,
        nozzleId: 201,
        bombisteId: 2,
        island: 'ILOT 2',
        pumpLabel: 'L2-P10',
        fuelCode: 'GAS',
        fuelLabel: 'GAS',
        fuelColor: '#16a34a',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 0,
        unitPrice: 13.2,
        status: 'active',
      },
      {
        id: 7,
        nozzleId: 211,
        bombisteId: 2,
        island: 'ILOT 2',
        pumpLabel: 'L2-P11',
        fuelCode: 'SSP_VP',
        fuelLabel: 'SSP VP',
        fuelColor: '#7c3aed',
        indexEntree: null,
        indexSortie: null,
        tankReturn: 0,
        unitPrice: 15.1,
        status: 'offline',
      },
    ];
    return of(lines).pipe(delay(350));
  }

  getStationBons() {
    const dateLivraison = new Date().toISOString().split('T')[0];
    const bons: BonsStep3Livraison[] = [
      {
        operatorId: 2,
        chefVidangeLavageId: 2,
        livraison: {
          id: 1,
          numero: 'LAV-8801',
          client: '12345-A-12',
          dateLivraison,
          statut: 'planifiee',
          adresse: 'Station-service',
          description: '',
          montant: 130,
          serviceLines: [
            {
              id: 1,
              reference: 'SRV-01',
              designation: 'Lavage complet',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 66.67,
              discountPercent: 0,
              vatPercent: 20,
            },
          ],
          productLines: [
            {
              id: 2,
              reference: 'PRD-01',
              designation: 'Shampoing',
              quantity: 2,
              unit: 'u',
              unitPriceHT: 12.5,
              discountPercent: 0,
              vatPercent: 20,
            },
          ],
          payments: { cash: 130, tpe: 0, bons: 0 },
        },
      },
      {
        operatorId: 3,
        chefVidangeLavageId: 3,
        livraison: {
          id: 2,
          numero: 'LAV-8802',
          client: '67890-B-34',
          dateLivraison,
          statut: 'planifiee',
          adresse: 'Station-service',
          description: '',
          montant: 75,
          serviceLines: [
            {
              id: 3,
              reference: 'SRV-02',
              designation: 'Lavage express',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 41.67,
              discountPercent: 0,
              vatPercent: 20,
            },
            {
              id: 4,
              reference: 'SRV-03',
              designation: 'Intérieur',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 20.83,
              discountPercent: 0,
              vatPercent: 20,
            },
          ],
          productLines: [],
          payments: { cash: 75, tpe: 0, bons: 0 },
        },
      },
      {
        operatorId: 2,
        chefVidangeLavageId: 2,
        livraison: {
          id: 3,
          numero: 'VID-8901',
          client: '12345-A-12',
          dateLivraison,
          statut: 'planifiee',
          adresse: 'Station-service',
          description: '',
          montant: 355,
          serviceLines: [
            {
              id: 5,
              reference: 'SRV-04',
              designation: 'Vidange complète',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 100,
              discountPercent: 0,
              vatPercent: 20,
            },
          ],
          productLines: [
            {
              id: 6,
              reference: '1236',
              designation: 'Huile moteur 10W40',
              quantity: 4,
              unit: 'u',
              unitPriceHT: 37.5,
              discountPercent: 0,
              vatPercent: 20,
            },
            {
              id: 7,
              reference: 'FLT-01',
              designation: 'Filtre à huile',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 29.17,
              discountPercent: 0,
              vatPercent: 20,
            },
          ],
          payments: { cash: 0, tpe: 355, bons: 0 },
        },
      },
      {
        operatorId: 3,
        chefVidangeLavageId: 3,
        livraison: {
          id: 4,
          numero: 'VID-8902',
          client: '67890-B-34',
          dateLivraison,
          statut: 'planifiee',
          adresse: 'Station-service',
          description: '',
          montant: 230,
          serviceLines: [
            {
              id: 8,
              reference: 'SRV-05',
              designation: 'Vidange + filtre',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 125,
              discountPercent: 0,
              vatPercent: 20,
            },
            {
              id: 9,
              reference: 'SRV-06',
              designation: 'Pack entretien',
              quantity: 1,
              unit: 'u',
              unitPriceHT: 66.67,
              discountPercent: 0,
              vatPercent: 20,
            },
          ],
          productLines: [],
          payments: { cash: 100, tpe: 130, bons: 0 },
        },
      },
    ];
    return of(bons).pipe(delay(300));
  }

  getEncaissementClients() {
    const clients: EncaissementClientOption[] = [
      {
        id: ENCAISSEMENT_DIVERS_CLIENT_ID,
        label: 'ENCAISSEMENT DIVERS',
        currentBalance: null,
      },
      {
        id: 1,
        label: 'CENTRE KINESITHERAPIE',
        currentBalance: 15_772.58,
      },
      {
        id: 2,
        label: 'SOCIETE ATLAS LOGISTIQUE',
        currentBalance: 4_320.0,
      },
      {
        id: 3,
        label: 'GARAGE EL AMAL',
        currentBalance: 890.25,
      },
      {
        id: 4,
        label: 'TRANSPORT RIF',
        currentBalance: 12_150.0,
      },
    ];
    return of(clients).pipe(delay(250));
  }

  getEncaissements() {
    const lines: EncaissementLine[] = [
      {
        id: 1,
        clientId: ENCAISSEMENT_DIVERS_CLIENT_ID,
        paymentMode: 'CMI',
        amount: 35_221.1,
        note: '',
      },
      {
        id: 2,
        clientId: ENCAISSEMENT_DIVERS_CLIENT_ID,
        paymentMode: 'TAQ',
        amount: 2_500,
        note: '',
      },
      {
        id: 3,
        clientId: 1,
        paymentMode: 'BON',
        amount: 3_251.1,
        note: '',
      },
    ];
    return of(lines).pipe(delay(300));
  }

  getDepenses() {
    const lines: DepenseLine[] = [
      {
        id: 1,
        expenseType: 'Achat Fournitures',
        description: '',
        amount: 0,
        paymentMode: 'Espèces (Caisse)',
        note: '',
      },
    ];
    return of(lines).pipe(delay(300));
  }

  submitJournee(journeeId: number) {
    return of({ id: journeeId, status: 'soumise' as const }).pipe(delay(800));
  }

  getStockControlLines() {
    const lines: StockControlLine[] = [
      { id: 1, productId: 1, name: 'Gazole Excellium', categoryLabel: 'Carburant', unit: 'L', theoreticalStock: 28500, measuredStock: null, unitPriceDh: 12.85 },
      { id: 2, productId: 2, name: 'Sans Plomb 95', categoryLabel: 'Carburant', unit: 'L', theoreticalStock: 18200, measuredStock: null, unitPriceDh: 14.85 },
      { id: 3, productId: 3, name: 'Sans Plomb 98', categoryLabel: 'Carburant', unit: 'L', theoreticalStock: 5200, measuredStock: null, unitPriceDh: 15.2 },
      { id: 4, productId: 4, name: 'Gazole Standard', categoryLabel: 'Carburant', unit: 'L', theoreticalStock: 22100, measuredStock: null, unitPriceDh: 12.5 },
      { id: 5, productId: 6, name: 'Huile Moteur 15W40', categoryLabel: 'Vidange', unit: 'Bidons', theoreticalStock: 420, measuredStock: null, unitPriceDh: 350 },
      { id: 6, productId: 7, name: 'Huile Moteur 5W30', categoryLabel: 'Vidange', unit: 'Bidons', theoreticalStock: 180, measuredStock: null, unitPriceDh: 420 },
      { id: 7, productId: 9, name: 'Liquide Frein DOT4', categoryLabel: 'Vidange', unit: 'Unités', theoreticalStock: 220, measuredStock: null, unitPriceDh: 85 },
      { id: 8, productId: 11, name: 'Shampooing Auto', categoryLabel: 'Lavage', unit: 'L', theoreticalStock: 340, measuredStock: null, unitPriceDh: 45 },
      { id: 9, productId: 12, name: 'Cire Protectrice', categoryLabel: 'Lavage', unit: 'Unités', theoreticalStock: 85, measuredStock: null, unitPriceDh: 120 },
      { id: 10, productId: 13, name: 'Détergent Mousse', categoryLabel: 'Lavage', unit: 'L', theoreticalStock: 420, measuredStock: null, unitPriceDh: 38 },
    ];
    return of(lines).pipe(delay(300));
  }
}
