import { createSelector } from '@ngrx/store';
import { JOURNEE_WIZARD_STEPS } from '../journee-wizard.steps';
import { JourneeDraft } from './journee.store';
import { journeeFeature } from './journee.reducer';

export const {
  selectJourneeState,
  selectJournees,
  selectListLoading,
  selectListError,
  selectKpis,
  selectKpisLoading,
  selectOperators,
  selectOperatorsLoading,
  selectDraft,
  selectStartingJournee,
  selectStartError,
  selectNozzleIndexesLoading,
  selectNozzleIndexesError,
  selectEncaissementClients,
  selectEncaissementClientsLoading,
  selectEncaissementClientsError,
  selectEncaissementsLoading,
  selectEncaissementsError,
  selectDepensesLoading,
  selectDepensesError,
  selectSubmittingJournee,
  selectSubmitJourneeError,
} = journeeFeature;

export const selectConfigurationStep1 = createSelector(
  selectDraft,
  (draft) => draft.configurationStep1,
);

export const selectIndexPistolesStep2 = createSelector(
  selectDraft,
  (draft) => draft.indexPistolesStep2,
);

export const selectBonsStep3 = createSelector(selectDraft, (draft) => draft.bonsStep3);

export const selectEncaissementsStep4 = createSelector(
  selectDraft,
  (draft) => draft.encaissementsStep4,
);

export const selectDepensesStep6 = createSelector(selectDraft, (draft) => draft.depensesStep6);

export const selectJourneeDraftId = createSelector(
  selectConfigurationStep1,
  (step) => step.journeeId,
);

export const selectStationBons = createSelector(selectBonsStep3, (step) => step.items);

export const selectStationBonsChefId = createSelector(selectBonsStep3, (step) => step.chefId);

export const selectFilteredStationBons = createSelector(
  selectStationBons,
  selectStationBonsChefId,
  (bons, chefId) => {
    const fuelBons = bons.filter((bon) => bon.fuelTransmittedFromNozzles);
    const manualBons =
      chefId == null
        ? []
        : bons.filter(
            (bon) => !bon.fuelTransmittedFromNozzles && bon.chefVidangeLavageId === chefId,
          );
    return [...fuelBons, ...manualBons];
  },
);

export const selectEncaissements = createSelector(
  selectEncaissementsStep4,
  (step) => step.lines,
);

export const selectDepenses = createSelector(selectDepensesStep6, (step) => step.lines);

export const selectNozzleIndexes = createSelector(selectIndexPistolesStep2, (step) => step.lines);

export const selectSelectedNozzleBombisteIds = createSelector(
  selectIndexPistolesStep2,
  (step) => step.selectedBombisteIds,
);

export const selectAvailableNozzleBombistes = createSelector(
  selectOperators,
  selectNozzleIndexes,
  selectSelectedNozzleBombisteIds,
  (operators, lines, selectedIds) => {
    const idsWithNozzles = new Set(lines.map((line) => line.bombisteId));
    return operators.filter(
      (operator) => idsWithNozzles.has(operator.id) && !selectedIds.includes(operator.id),
    );
  },
);

const DRAFT_STEP_KEYS: (keyof JourneeDraft)[] = [
  'configurationStep1',
  'indexPistolesStep2',
  'bonsStep3',
  'encaissementsStep4',
  'depensesStep6',
];

export const selectCanSubmitJournee = createSelector(selectDraft, (draft) =>
  DRAFT_STEP_KEYS.every((key) => draft[key].isValid),
);

export interface InvalidWizardStep {
  order: number;
  path: string;
  labelKey: string;
}

export const selectInvalidWizardSteps = createSelector(
  selectDraft,
  (draft): InvalidWizardStep[] =>
    JOURNEE_WIZARD_STEPS.filter((step, index) => {
      const key = DRAFT_STEP_KEYS[index];
      return key != null && !draft[key].isValid;
    }).map((step) => ({
      order: step.order,
      path: step.path,
      labelKey: step.labelKey,
    })),
);

export const selectWizardStepValidityByPath = createSelector(
  selectDraft,
  (draft): Record<string, boolean> => ({
    'configuration-step1': draft.configurationStep1.isValid,
    'index-pistoles-step2': draft.indexPistolesStep2.isValid,
    'bons-step3': draft.bonsStep3.isValid,
    'encaissements-step4': draft.encaissementsStep4.isValid,
    'depenses-step5': draft.depensesStep6.isValid,
  }),
);
