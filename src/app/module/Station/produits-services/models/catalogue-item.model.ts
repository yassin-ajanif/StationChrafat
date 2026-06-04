export type CatalogueItemType = 'produit' | 'service';

export interface CatalogueItem {
  id: number;
  name: string;
  type: CatalogueItemType;
  categoryId: number;
  unitPrice: number;
}

export interface CatalogueItemDraft {
  name: string;
  type: CatalogueItemType;
  categoryId: number;
  unitPrice: number;
}
