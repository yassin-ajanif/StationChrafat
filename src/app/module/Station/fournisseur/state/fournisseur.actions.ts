import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Fournisseur, FournisseurDraft } from './fournisseur.store';

export const FournisseurActions = createActionGroup({
  source: 'Fournisseur',
  events: {
    'Load Fournisseurs': emptyProps(),
    'Load Fournisseurs Success': props<{ fournisseurs: Fournisseur[] }>(),
    'Load Fournisseurs Failure': props<{ error: string }>(),

    'Add Fournisseur': props<{ draft: FournisseurDraft }>(),
    'Add Fournisseur Success': props<{ fournisseur: Fournisseur }>(),
    'Add Fournisseur Failure': props<{ error: string }>(),

    'Update Fournisseur': props<{ id: number; draft: FournisseurDraft }>(),
    'Update Fournisseur Success': props<{ fournisseur: Fournisseur }>(),
    'Update Fournisseur Failure': props<{ error: string }>(),

    'Remove Fournisseur': props<{ id: number }>(),
    'Remove Fournisseur Success': props<{ id: number }>(),
    'Remove Fournisseur Failure': props<{ error: string }>(),

    'Set Search Query': props<{ query: string }>(),
  },
});
