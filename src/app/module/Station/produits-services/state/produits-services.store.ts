export type CategoryKind = 'service' | 'product';

export interface CatalogueCategory {
  id: number;
  kind: CategoryKind;
  label: string;
}

export interface CategoryDraft {
  kind: CategoryKind;
  label: string;
}

export const EMPTY_CATEGORY_DRAFT: CategoryDraft = {
  kind: 'service',
  label: '',
};

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

export const EMPTY_DRAFT: CatalogueItemDraft = {
  name: '',
  type: 'produit',
  categoryId: 0,
  unitPrice: 0,
};
