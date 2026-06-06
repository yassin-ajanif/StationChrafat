import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CatalogueCategory, CatalogueItem, CatalogueItemDraft, CategoryDraft } from './produits-services.store';

export const ProduitsServicesActions = createActionGroup({
  source: 'ProduitsServices',
  events: {
    'Load Catalogue': emptyProps(),
    'Load Catalogue Success': props<{
      serviceCategories: CatalogueCategory[];
      productCategories: CatalogueCategory[];
      items: CatalogueItem[];
    }>(),
    'Load Catalogue Failure': props<{ error: string }>(),

    'Add Item': props<{ draft: CatalogueItemDraft }>(),
    'Add Item Success': props<{ item: CatalogueItem }>(),
    'Add Item Failure': props<{ error: string }>(),

    'Update Item': props<{ id: number; draft: CatalogueItemDraft }>(),
    'Update Item Success': props<{ item: CatalogueItem }>(),
    'Update Item Failure': props<{ error: string }>(),

    'Remove Item': props<{ id: number }>(),
    'Remove Item Success': props<{ id: number }>(),
    'Remove Item Failure': props<{ error: string }>(),

    'Add Category': props<{ draft: CategoryDraft }>(),
    'Add Category Success': props<{ category: CatalogueCategory }>(),
    'Add Category Failure': props<{ error: string }>(),

    'Update Category': props<{ id: number; draft: CategoryDraft }>(),
    'Update Category Success': props<{ category: CatalogueCategory }>(),
    'Update Category Failure': props<{ error: string }>(),

    'Set Search Query': props<{ query: string }>(),
    'Set Selected Category': props<{ categoryId: number | null }>(),
  },
});
