import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Devis, DevisDraft, VentesModule } from '../models/ventes.model';

export const VentesActions = createActionGroup({
  source: 'Ventes',
  events: {
    'Load Devis': props<{ module: VentesModule }>(),
    'Load Devis Success': props<{ devis: Devis[] }>(),
    'Load Devis Failure': props<{ error: string }>(),

    'Add Devis': props<{ draft: DevisDraft; module: VentesModule }>(),
    'Add Devis Success': props<{ devis: Devis }>(),
    'Add Devis Failure': props<{ error: string }>(),

    'Update Devis': props<{ id: number; draft: DevisDraft }>(),
    'Update Devis Success': props<{ devis: Devis }>(),
    'Update Devis Failure': props<{ error: string }>(),

    'Remove Devis': props<{ id: number }>(),
    'Remove Devis Success': props<{ id: number }>(),
    'Remove Devis Failure': props<{ error: string }>(),
  },
});
