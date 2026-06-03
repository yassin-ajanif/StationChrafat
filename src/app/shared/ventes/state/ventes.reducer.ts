import { createFeature, createReducer, on } from '@ngrx/store';
import { Devis } from '../models/ventes.model';
import { VentesActions } from './ventes.actions';

export interface VentesState {
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  saving: boolean;
  saveError: string | null;
}

export const initialVentesState: VentesState = {
  devis: [],
  devisLoading: false,
  devisError: null,
  saving: false,
  saveError: null,
};

export const ventesFeature = createFeature({
  name: 'ventes',
  reducer: createReducer(
    initialVentesState,

    on(VentesActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(VentesActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(VentesActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(VentesActions.addDevis, (state) => ({
      ...state,
      saving: true,
      saveError: null,
    })),
    on(VentesActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      saving: false,
      devis: [...state.devis, devis],
    })),
    on(VentesActions.addDevisFailure, (state, { error }) => ({
      ...state,
      saving: false,
      saveError: error,
    })),

    on(VentesActions.updateDevis, (state) => ({
      ...state,
      saving: true,
      saveError: null,
    })),
    on(VentesActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      saving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(VentesActions.updateDevisFailure, (state, { error }) => ({
      ...state,
      saving: false,
      saveError: error,
    })),

    on(VentesActions.removeDevis, (state) => ({
      ...state,
      saving: true,
      saveError: null,
    })),
    on(VentesActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      saving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(VentesActions.removeDevisFailure, (state, { error }) => ({
      ...state,
      saving: false,
      saveError: error,
    })),
  ),
});
