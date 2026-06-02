import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { LavageBon } from '../models/lavage-bon.model';
import { VidangeBon } from '../models/vidange-bon.model';
import {
  ENCAISSEMENT_DIVERS_CLIENT_ID,
  EncaissementClientOption,
  EncaissementLine,
} from '../models/encaissement.model';
import { DepenseLine } from '../models/depense.model';
import { ValidationExtras } from '../models/journee-validation.model';
import { NozzleIndexLine } from '../models/nozzle-index.model';
import {
  JourneeKpis,
  JourneeSummary,
  Operator,
  ShiftSlot,
} from '../models/journee.model';

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
      },
      {
        id: 2,
        date: '2023-10-23',
        dateLabel: '23 Octobre 2023',
        status: 'cloturee',
        caTotal: 89_136,
        chefDePiste: this.operators[0],
      },
      {
        id: 3,
        date: '2023-10-22',
        dateLabel: '22 Octobre 2023',
        status: 'cloturee',
        caTotal: 92_450,
        chefDePiste: this.operators[2],
      },
    ];
    return of(list).pipe(delay(400));
  }

  startJournee(payload: {
    chefDePisteId: number;
    bombisteId: number;
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

  getLavageBons() {
    const bons: LavageBon[] = [
      {
        id: 1,
        bonNumber: 'LAV-8801',
        clientRef: '12345-A-12',
        lines: [{ id: 1, washType: 'Complet', amount: 80 }],
        consumedProducts: [
          { productName: 'Shampoing', quantity: 2, unitPrice: 15 },
          { productName: 'Cire', quantity: 1, unitPrice: 25 },
        ],
      },
      {
        id: 2,
        bonNumber: 'LAV-8802',
        clientRef: '67890-B-34',
        lines: [
          { id: 2, washType: 'Express', amount: 50 },
          { id: 3, washType: 'Intérieur', amount: 25 },
        ],
        consumedProducts: [],
      },
    ];
    return of(bons).pipe(delay(300));
  }

  getVidangeBons() {
    const bons: VidangeBon[] = [
      {
        id: 1,
        bonNumber: 'VID-8901',
        vehicleRef: '12345-A-12',
        lines: [{ id: 1, serviceType: 'Vidange complète', amount: 120 }],
        consumedProducts: [
          { productName: 'Huile moteur 10W40', quantity: 4, unitPrice: 45 },
          { productName: 'Filtre à huile', quantity: 1, unitPrice: 35 },
        ],
      },
      {
        id: 2,
        bonNumber: 'VID-8902',
        vehicleRef: '67890-B-34',
        lines: [
          { id: 2, serviceType: 'Vidange + filtre', amount: 150 },
          { id: 3, serviceType: 'Pack entretien', amount: 80 },
        ],
        consumedProducts: [],
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

  getValidationExtras() {
    const extras: ValidationExtras = {
      shopProducts: 8_126.47,
      debtSettlements: 1_200,
      cardRecharges: 1_100,
    };
    return of(extras).pipe(delay(250));
  }

  submitJournee(journeeId: number) {
    return of({ id: journeeId, status: 'soumise' as const }).pipe(delay(800));
  }

}
