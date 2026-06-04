export type CategoryKind = 'service' | 'product';

export interface CatalogueCategory {
  id: number;
  kind: CategoryKind;
  label: string;
}
