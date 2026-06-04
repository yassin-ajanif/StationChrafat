import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StationBon, StationBonDraftInput } from '../../shared/models/bon';
import { DepenseLine, DepenseLinePatch } from '../models/depense.model';
import { EncaissementClientOption, EncaissementLine, EncaissementLinePatch } from '../models/encaissement.model';
import { ValidationExtras } from '../models/journee-validation.model';
import { NozzleIndexLine } from '../models/nozzle-index.model';
import {
  JourneeDraftConfig,
  JourneeKpis,
  JourneeSummary,
  Operator,
  ShiftSlot,
} from '../models/journee.model';

export const JourneeActions = createActionGroup({
  source: 'Journee',
  events: {
    'Load List': emptyProps(),
    'Load List Success': props<{ journees: JourneeSummary[] }>(),
    'Load List Failure': props<{ error: string }>(),

    'Load Kpis': emptyProps(),
    'Load Kpis Success': props<{ kpis: JourneeKpis }>(),
    'Load Kpis Failure': props<{ error: string }>(),

    'Load Operators': emptyProps(),
    'Load Operators Success': props<{ operators: Operator[] }>(),
    'Load Operators Failure': props<{ error: string }>(),

    'Set Draft Config': props<{ config: Partial<JourneeDraftConfig> }>(),
    'Start Journee': props<{
      chefDePisteId: number;
      shiftSlot: ShiftSlot;
    }>(),
    'Start Journee Success': props<{ id: number; openedAt: string }>(),
    'Start Journee Failure': props<{ error: string }>(),

    'Reset Draft': emptyProps(),

    'Load Nozzle Indexes': emptyProps(),
    'Load Nozzle Indexes Success': props<{ lines: NozzleIndexLine[] }>(),
    'Load Nozzle Indexes Failure': props<{ error: string }>(),

    'Update Nozzle Index': props<{
      lineId: number;
      indexEntree?: number | null;
      indexSortie?: number | null;
    }>(),

    'Add Nozzle Bombiste': props<{ bombisteId: number }>(),
    'Remove Nozzle Bombiste': props<{ bombisteId: number }>(),

    'Update Nozzle Bombiste Payment': props<{
      bombisteId: number;
      cash?: number;
      tpe?: number;
      bons?: number;
    }>(),

    'Transmit Fuel Sales To Station Bons': emptyProps(),

    'Add Station Bon': props<{ bon: StationBonDraftInput }>(),
    'Update Station Bon': props<{ id: number; bon: StationBonDraftInput }>(),
    'Remove Station Bon': props<{ id: number }>(),

    'Set Station Bons Chef Id': props<{ chefVidangeLavageId: number | null }>(),

    'Load Encaissement Clients': emptyProps(),
    'Load Encaissement Clients Success': props<{ clients: EncaissementClientOption[] }>(),
    'Load Encaissement Clients Failure': props<{ error: string }>(),

    'Load Encaissements': emptyProps(),
    'Load Encaissements Success': props<{ lines: EncaissementLine[] }>(),
    'Load Encaissements Failure': props<{ error: string }>(),

    'Add Encaissement Line': emptyProps(),
    'Update Encaissement Line': props<{ id: number; patch: EncaissementLinePatch }>(),
    'Remove Encaissement Line': props<{ id: number }>(),

    'Load Depenses': emptyProps(),
    'Load Depenses Success': props<{ lines: DepenseLine[] }>(),
    'Load Depenses Failure': props<{ error: string }>(),

    'Add Depense Line': emptyProps(),
    'Update Depense Line': props<{ id: number; patch: DepenseLinePatch }>(),
    'Remove Depense Line': props<{ id: number }>(),

    'Load Validation Extras': emptyProps(),
    'Load Validation Extras Success': props<{ extras: ValidationExtras }>(),
    'Load Validation Extras Failure': props<{ error: string }>(),

    'Submit Journee': emptyProps(),
    'Submit Journee Success': emptyProps(),
    'Submit Journee Failure': props<{ error: string }>(),
  },
});
