import { createSelector } from '@ngrx/store';
import { VentesModule } from '../models/ventes.model';
import { ventesFeature } from './ventes.reducer';

export const {
  selectVentesState,
  selectDevis,
  selectDevisLoading,
  selectDevisError,
  selectSaving,
  selectSaveError,
} = ventesFeature;

export const selectDevisByModule = (module: VentesModule) =>
  createSelector(selectDevis, (devis) => devis.filter((d) => d.module === module));
