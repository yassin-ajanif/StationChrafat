import { createSelector } from '@ngrx/store';
import { stockGestionFeature } from './stock-gestion.reducer';

const {
  selectSummaries,
  selectAllProducts,
  selectActiveTab,
  selectSearchQuery,
  selectCurrentPage,
  selectPageSize,
  selectLoading,
  selectError,
} = stockGestionFeature;

export {
  selectSummaries,
  selectActiveTab,
  selectSearchQuery,
  selectCurrentPage,
  selectPageSize,
  selectLoading,
  selectError,
};

export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectActiveTab,
  selectSearchQuery,
  (products, tab, query) => {
    let filtered = products.filter((p) => p.tab === tab);
    if (query) {
      const lower = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.subtitle.toLowerCase().includes(lower),
      );
    }
    return filtered;
  },
);

export const selectTotalPages = createSelector(
  selectFilteredProducts,
  selectPageSize,
  (products, pageSize) => Math.max(1, Math.ceil(products.length / pageSize)),
);

export const selectPaginatedProducts = createSelector(
  selectFilteredProducts,
  selectCurrentPage,
  selectPageSize,
  (products, page, size) => {
    const start = (page - 1) * size;
    return products.slice(start, start + size);
  },
);

export const selectPaginationLabel = createSelector(
  selectFilteredProducts,
  selectCurrentPage,
  selectPageSize,
  (products, page, size) => {
    if (products.length === 0) return '0 résultat';
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, products.length);
    return `${start}–${end} / ${products.length}`;
  },
);

export const selectVisiblePages = createSelector(
  selectTotalPages,
  selectCurrentPage,
  (total, current) => {
    const range: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  },
);
