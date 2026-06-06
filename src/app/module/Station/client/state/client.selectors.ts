import { createSelector } from '@ngrx/store';
import { clientFeature } from './client.reducer';

export const {
  selectClients,
  selectSearchQuery,
  selectLoading,
  selectSaving,
  selectError,
} = clientFeature;

export const selectFilteredClients = createSelector(
  selectClients,
  selectSearchQuery,
  (clients, query) => {
    if (!query.trim()) {
      return clients;
    }
    const lower = query.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        c.ice.toLowerCase().includes(lower) ||
        c.city.toLowerCase().includes(lower),
    );
  },
);
