import { createSelector } from '@ngrx/store';
import { fournisseurFeature } from './fournisseur.reducer';

export const {
  selectFournisseurs,
  selectSearchQuery,
  selectLoading,
  selectSaving,
  selectError,
} = fournisseurFeature;

export const selectFilteredFournisseurs = createSelector(
  selectFournisseurs,
  selectSearchQuery,
  (fournisseurs, query) => {
    if (!query.trim()) {
      return fournisseurs;
    }
    const lower = query.toLowerCase();
    return fournisseurs.filter(
      (f) =>
        f.name.toLowerCase().includes(lower) ||
        f.phone.includes(lower) ||
        f.email.toLowerCase().includes(lower) ||
        f.ice.toLowerCase().includes(lower) ||
        f.city.toLowerCase().includes(lower),
    );
  },
);
