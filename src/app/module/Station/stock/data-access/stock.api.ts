import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { CanopyFuelType, NozzleLiveStatus, StockOverview } from '../models/stock.model';

interface NozzleSeed {
  pumpLabel: string;
  lineNumber: number;
  fuelLabel: CanopyFuelType;
  currentIndexLiters: number;
  indexEntree: number | null;
  indexSortie: number | null;
  status: NozzleLiveStatus;
}

@Injectable({ providedIn: 'root' })
export class StockApi {
  getStockOverview(): Observable<StockOverview> {
    const nozzleSeeds: NozzleSeed[] = [
      { pumpLabel: 'P01', lineNumber: 1, fuelLabel: 'GASOIL', currentIndexLiters: 450.2, indexEntree: 125_450.2, indexSortie: 125_000, status: 'libre' },
      { pumpLabel: 'P02', lineNumber: 1, fuelLabel: 'SANS PLOMB', currentIndexLiters: 1_240.5, indexEntree: 98_240.5, indexSortie: 97_000, status: 'en_cours' },
      { pumpLabel: 'P03', lineNumber: 1, fuelLabel: 'EXCELLIUM', currentIndexLiters: 315.4, indexEntree: 88_315.4, indexSortie: 88_000, status: 'attente' },
      { pumpLabel: 'P04', lineNumber: 2, fuelLabel: 'GASOIL', currentIndexLiters: 820.0, indexEntree: 210_820, indexSortie: 210_000, status: 'en_cours' },
      { pumpLabel: 'P05', lineNumber: 2, fuelLabel: 'SANS PLOMB', currentIndexLiters: 540.0, indexEntree: 52_540, indexSortie: 52_000, status: 'libre' },
      { pumpLabel: 'P06', lineNumber: 2, fuelLabel: 'EXCELLIUM', currentIndexLiters: 680.0, indexEntree: 41_680, indexSortie: 41_000, status: 'libre' },
      { pumpLabel: 'P07', lineNumber: 3, fuelLabel: 'GASOIL', currentIndexLiters: 2_150.8, indexEntree: 312_150.8, indexSortie: 310_000, status: 'en_cours' },
      { pumpLabel: 'P08', lineNumber: 3, fuelLabel: 'SANS PLOMB', currentIndexLiters: 420.0, indexEntree: 76_420, indexSortie: 76_000, status: 'attente' },
      { pumpLabel: 'P09', lineNumber: 3, fuelLabel: 'EXCELLIUM', currentIndexLiters: 290.5, indexEntree: 33_290.5, indexSortie: 33_000, status: 'libre' },
      { pumpLabel: 'P10', lineNumber: 4, fuelLabel: 'GASOIL', currentIndexLiters: 610.0, indexEntree: 145_610, indexSortie: 145_000, status: 'libre' },
      { pumpLabel: 'P11', lineNumber: 4, fuelLabel: 'SANS PLOMB', currentIndexLiters: 980.2, indexEntree: 62_980.2, indexSortie: 62_000, status: 'en_cours' },
      { pumpLabel: 'P12', lineNumber: 4, fuelLabel: 'EXCELLIUM', currentIndexLiters: 0, indexEntree: null, indexSortie: null, status: 'hors_service' },
    ];

    const overview: StockOverview = {
      canopyName: 'Auvent principal',
      lineCount: 4,
      nozzles: nozzleSeeds.map((seed, index) => ({ id: index + 1, ...seed })),
      tanks: [
        {
          id: 1,
          name: 'Sans Plomb',
          subtitle: 'SP-95 Industrial',
          currentLiters: 28_800,
          maxCapacityLiters: 40_000,
          sales24hLiters: 4_200,
          status: 'optimal',
        },
        {
          id: 2,
          name: 'Gazole',
          subtitle: 'Gasoil Standard',
          currentLiters: 17_000,
          maxCapacityLiters: 50_000,
          sales24hLiters: 8_500,
          status: 'alerte',
        },
        {
          id: 3,
          name: 'Gazole Excellium',
          subtitle: 'Premium Diesel',
          currentLiters: 3_600,
          maxCapacityLiters: 30_000,
          sales24hLiters: 2_100,
          status: 'critique',
        },
      ],
    };

    return of(overview).pipe(delay(300));
  }
}
