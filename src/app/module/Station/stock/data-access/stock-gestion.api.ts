import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { StockGestionSummary, StockGestionTab, StockProduct } from '../state/store';

const SEED_SUMMARIES: StockGestionSummary[] = [
  { id: 1, label: 'Stock Carburant', valueDh: 1_456_200, trendPercent: 12, accent: 'carburant' },
  { id: 2, label: 'Stock Vidange', valueDh: 284_700, trendPercent: 8, accent: 'vidange' },
  { id: 3, label: 'Stock Lavage', valueDh: 93_400, trendPercent: 5, accent: 'lavage' },
  { id: 4, label: 'Valeur Totale', valueDh: 1_834_300, trendPercent: 10, accent: 'total' },
];

const SEED_PRODUCTS: StockProduct[] = [
  { id: 1, name: 'Gazole Excellium', subtitle: 'Gazole haute performance', categoryLabel: 'Carburant', currentStock: 28500, unit: 'L', threshold: 10000, stockStatus: 'optimal', tab: 'carburant' },
  { id: 2, name: 'Sans Plomb 95', subtitle: 'Essence super sans plomb', categoryLabel: 'Carburant', currentStock: 18200, unit: 'L', threshold: 8000, stockStatus: 'optimal', tab: 'carburant' },
  { id: 3, name: 'Sans Plomb 98', subtitle: 'Essence premium', categoryLabel: 'Carburant', currentStock: 5200, unit: 'L', threshold: 6000, stockStatus: 'critique', tab: 'carburant' },
  { id: 4, name: 'Gazole Standard', subtitle: 'Gazole classique', categoryLabel: 'Carburant', currentStock: 22100, unit: 'L', threshold: 10000, stockStatus: 'optimal', tab: 'carburant' },
  { id: 5, name: 'Gazole Maritime', subtitle: 'Gazole non routier (GNR)', categoryLabel: 'Carburant', currentStock: 7800, unit: 'L', threshold: 8000, stockStatus: 'critique', tab: 'carburant' },
  { id: 6, name: 'Huile Moteur 15W40', subtitle: 'Quartz 7000 10L', categoryLabel: 'Vidange', currentStock: 420, unit: 'Bidons', threshold: 200, stockStatus: 'optimal', tab: 'vidange' },
  { id: 7, name: 'Huile Moteur 5W30', subtitle: 'Quartz Ineo 5L', categoryLabel: 'Vidange', currentStock: 180, unit: 'Bidons', threshold: 150, stockStatus: 'optimal', tab: 'vidange' },
  { id: 8, name: 'Huile Boîte 75W80', subtitle: 'Transmission manuelle', categoryLabel: 'Vidange', currentStock: 65, unit: 'Bidons', threshold: 100, stockStatus: 'critique', tab: 'vidange' },
  { id: 9, name: 'Liquide Frein DOT4', subtitle: '500 ml', categoryLabel: 'Vidange', currentStock: 220, unit: 'Unités', threshold: 100, stockStatus: 'optimal', tab: 'vidange' },
  { id: 10, name: 'Huile Hydraulique 46', subtitle: 'Vérins et chargeuses', categoryLabel: 'Vidange', currentStock: 90, unit: 'Bidons', threshold: 120, stockStatus: 'critique', tab: 'vidange' },
  { id: 11, name: 'Shampooing Auto', subtitle: 'Concentré 5L', categoryLabel: 'Lavage', currentStock: 340, unit: 'L', threshold: 200, stockStatus: 'optimal', tab: 'lavage' },
  { id: 12, name: 'Cire Protectrice', subtitle: 'Cire liquide 1L', categoryLabel: 'Lavage', currentStock: 85, unit: 'Unités', threshold: 100, stockStatus: 'critique', tab: 'lavage' },
  { id: 13, name: 'Détergent Mousse', subtitle: 'Active mousse 20L', categoryLabel: 'Lavage', currentStock: 420, unit: 'L', threshold: 300, stockStatus: 'optimal', tab: 'lavage' },
  { id: 14, name: 'Chiffons Microfibres', subtitle: 'Lot de 50', categoryLabel: 'Lavage', currentStock: 18, unit: 'Paquets', threshold: 30, stockStatus: 'critique', tab: 'lavage' },
  { id: 15, name: 'Nettoyant Jantes', subtitle: 'Spray acide 750ml', categoryLabel: 'Lavage', currentStock: 150, unit: 'Unités', threshold: 80, stockStatus: 'optimal', tab: 'lavage' },
];

@Injectable({ providedIn: 'root' })
export class StockGestionApi {
  getSummary(): Observable<StockGestionSummary[]> {
    return of([...SEED_SUMMARIES]).pipe(delay(200));
  }

  getProducts(tab?: StockGestionTab): Observable<StockProduct[]> {
    const filtered = tab ? SEED_PRODUCTS.filter((p) => p.tab === tab) : [...SEED_PRODUCTS];
    return of(filtered).pipe(delay(200));
  }
}
