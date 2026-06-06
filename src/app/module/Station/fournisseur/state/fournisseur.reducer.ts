import { createFeature, createReducer, on } from '@ngrx/store';
import { Fournisseur } from './fournisseur.store';
import { FournisseurActions } from './fournisseur.actions';

export interface FournisseurState {
  fournisseurs: Fournisseur[];
  searchQuery: string;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initial: FournisseurState = {
  fournisseurs: [],
  searchQuery: '',
  loading: false,
  saving: false,
  error: null,
};

export const fournisseurFeature = createFeature({
  name: 'fournisseur',
  reducer: createReducer(
    initial,

    on(FournisseurActions.loadFournisseurs, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(FournisseurActions.loadFournisseursSuccess, (state, { fournisseurs }) => ({
      ...state,
      loading: false,
      fournisseurs,
    })),
    on(FournisseurActions.loadFournisseursFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(FournisseurActions.addFournisseur, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(FournisseurActions.addFournisseurSuccess, (state, { fournisseur }) => ({
      ...state,
      saving: false,
      fournisseurs: [...state.fournisseurs, fournisseur],
    })),
    on(FournisseurActions.addFournisseurFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(FournisseurActions.updateFournisseur, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(FournisseurActions.updateFournisseurSuccess, (state, { fournisseur }) => ({
      ...state,
      saving: false,
      fournisseurs: state.fournisseurs.map((f) => (f.id === fournisseur.id ? fournisseur : f)),
    })),
    on(FournisseurActions.updateFournisseurFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(FournisseurActions.removeFournisseur, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(FournisseurActions.removeFournisseurSuccess, (state, { id }) => ({
      ...state,
      saving: false,
      fournisseurs: state.fournisseurs.filter((f) => f.id !== id),
    })),
    on(FournisseurActions.removeFournisseurFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(FournisseurActions.setSearchQuery, (state, { query }) => ({
      ...state,
      searchQuery: query,
    })),
  ),
});
