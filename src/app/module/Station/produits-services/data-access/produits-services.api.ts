import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { CatalogueCategory, CatalogueItem, CatalogueItemDraft } from '../state/produits-services.store';

const SEED_CATEGORIES: CatalogueCategory[] = [
  { id: 1, kind: 'service', label: 'Nettoyage' },
  { id: 2, kind: 'service', label: 'Vidange' },
  { id: 3, kind: 'service', label: 'Graissage' },
  { id: 4, kind: 'service', label: 'Reparation' },
  { id: 5, kind: 'product', label: 'Carburant' },
  { id: 6, kind: 'product', label: 'Boutique' },
  { id: 7, kind: 'product', label: 'Lubrifiants' },
  { id: 8, kind: 'product', label: 'Pieces detachees' },
];

const SEED_ITEMS: CatalogueItem[] = [
  { id: 1, name: 'Gazole Excellium', type: 'produit', categoryId: 5, unitPrice: 14.50 },
  { id: 2, name: 'Lavage Complet', type: 'service', categoryId: 1, unitPrice: 80 },
  { id: 3, name: 'Quartz 9000 5W40', type: 'produit', categoryId: 7, unitPrice: 220 },
  { id: 4, name: 'Vidange Moteur', type: 'service', categoryId: 2, unitPrice: 150 },
  { id: 5, name: 'Total Quartz Ineo 5W30', type: 'produit', categoryId: 7, unitPrice: 250 },
  { id: 6, name: 'Nettoyage Interieur', type: 'service', categoryId: 1, unitPrice: 120 },
  { id: 7, name: 'Sans Plomb 95', type: 'produit', categoryId: 5, unitPrice: 15.80 },
  { id: 8, name: 'Boisson Fraiche', type: 'produit', categoryId: 6, unitPrice: 12 },
  { id: 9, name: 'Graissage Chassis', type: 'service', categoryId: 3, unitPrice: 60 },
  { id: 10, name: 'Filtre a Huile', type: 'produit', categoryId: 8, unitPrice: 95 },
];

let nextCategoryId = SEED_CATEGORIES.length + 1;
let nextItemId = SEED_ITEMS.length + 1;

@Injectable({ providedIn: 'root' })
export class ProduitsServicesApi {
  getCategories(): Observable<CatalogueCategory[]> {
    return of([...SEED_CATEGORIES]).pipe(delay(200));
  }

  getItems(): Observable<CatalogueItem[]> {
    return of([...SEED_ITEMS]).pipe(delay(200));
  }

  createItem(draft: CatalogueItemDraft): Observable<CatalogueItem> {
    const item: CatalogueItem = { id: nextItemId++, ...draft };
    SEED_ITEMS.push(item);
    return of(item).pipe(delay(200));
  }

  updateItem(id: number, draft: CatalogueItemDraft): Observable<CatalogueItem> {
    const idx = SEED_ITEMS.findIndex((i) => i.id === id);
    const updated = idx >= 0 ? { ...SEED_ITEMS[idx], ...draft } : { id, ...draft };
    if (idx >= 0) SEED_ITEMS[idx] = updated;
    return of(updated).pipe(delay(200));
  }

  deleteItem(id: number): Observable<void> {
    const idx = SEED_ITEMS.findIndex((i) => i.id === id);
    if (idx >= 0) SEED_ITEMS.splice(idx, 1);
    return of(undefined).pipe(delay(200));
  }

  createCategory(kind: 'service' | 'product', label: string): Observable<CatalogueCategory> {
    const cat: CatalogueCategory = { id: nextCategoryId++, kind, label };
    SEED_CATEGORIES.push(cat);
    return of(cat).pipe(delay(200));
  }

  updateCategory(id: number, patch: { label: string }): Observable<CatalogueCategory> {
    const idx = SEED_CATEGORIES.findIndex((c) => c.id === id);
    const updated =
      idx >= 0
        ? { ...SEED_CATEGORIES[idx], label: patch.label }
        : { id, kind: 'service' as const, label: patch.label };
    if (idx >= 0) {
      SEED_CATEGORIES[idx] = updated;
    }
    return of(updated).pipe(delay(200));
  }
}
