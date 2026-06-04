import { createSelector } from '@ngrx/store';
import { produitsServicesFeature } from './produits-services.reducer';

export const {
  selectServiceCategories,
  selectProductCategories,
  selectItems,
  selectSearchQuery,
  selectSelectedCategoryId,
  selectLoading,
  selectSaving,
  selectError,
} = produitsServicesFeature;

export const selectFilteredItems = createSelector(
  selectItems,
  selectSearchQuery,
  selectSelectedCategoryId,
  (items, query, categoryId) => {
    let filtered = items;
    if (query) {
      const lower = query.toLowerCase();
      filtered = filtered.filter((i) => i.name.toLowerCase().includes(lower));
    }
    if (categoryId != null) {
      filtered = filtered.filter((i) => i.categoryId === categoryId);
    }
    return filtered;
  },
);

export const selectCategoriesByKind = (kind: 'service' | 'product') =>
  createSelector(
    selectServiceCategories,
    selectProductCategories,
    (service, product) => (kind === 'service' ? service : product),
  );
