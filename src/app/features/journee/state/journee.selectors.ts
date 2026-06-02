import { createSelector } from '@ngrx/store';
import {
  computeDepensesTotal,
  canProceedDepensesStep,
} from '../models/depense.model';
import {
  computeEncaissementsTotal,
  canProceedEncaissementsStep,
} from '../models/encaissement.model';
import { buildJourneeValidationSummary } from '../models/journee-validation.model';
import {
  computeLavageBonsTotal,
  canProceedLavageStep,
} from '../models/lavage-bon.model';
import {
  canProceedNozzleStep,
  computeLineQuantity,
  computeLineTotal,
  computeSessionSummary,
} from '../models/nozzle-index.model';
import {
  computeVidangeBonsTotal,
  canProceedVidangeStep,
} from '../models/vidange-bon.model';
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
  selectLavageBonsLoading,
  selectLavageBonsError,
  selectVidangeBonsLoading,
  selectVidangeBonsError,
  selectEncaissementClients,
  selectEncaissementClientsLoading,
  selectEncaissementClientsError,
  selectEncaissementsLoading,
  selectEncaissementsError,
  selectDepensesLoading,
  selectDepensesError,
  selectValidationExtras,
  selectValidationExtrasLoading,
  selectValidationExtrasError,
  selectSubmittingJournee,
  selectSubmitJourneeError,
} = journeeFeature;

export const selectLavageBons = createSelector(selectDraft, (draft) => draft.lavageBons);

export const selectLavageBonsTotal = createSelector(selectLavageBons, (bons) =>
  computeLavageBonsTotal(bons),
);

export const selectCanProceedLavageStep = createSelector(selectLavageBons, (bons) =>
  canProceedLavageStep(bons),
);

export const selectVidangeBons = createSelector(selectDraft, (draft) => draft.vidangeBons);

export const selectVidangeBonsTotal = createSelector(selectVidangeBons, (bons) =>
  computeVidangeBonsTotal(bons),
);

export const selectCanProceedVidangeStep = createSelector(selectVidangeBons, (bons) =>
  canProceedVidangeStep(bons),
);

export const selectEncaissements = createSelector(
  selectDraft,
  (draft) => draft.encaissements,
);

export const selectEncaissementsTotal = createSelector(selectEncaissements, (lines) =>
  computeEncaissementsTotal(lines),
);

export const selectCanProceedEncaissementsStep = createSelector(
  selectEncaissements,
  (lines) => canProceedEncaissementsStep(lines),
);

export const selectDepenses = createSelector(selectDraft, (draft) => draft.depenses);

export const selectDepensesTotal = createSelector(selectDepenses, (lines) =>
  computeDepensesTotal(lines),
);

export const selectCanProceedDepensesStep = createSelector(selectDepenses, (lines) =>
  canProceedDepensesStep(lines),
);

export const selectNozzleIndexes = createSelector(
  selectDraft,
  (draft) => draft.nozzleIndexes,
);

export const selectNozzleLinesWithTotals = createSelector(selectNozzleIndexes, (lines) =>
  lines.map((line) => ({
    line,
    quantity: computeLineQuantity(line),
    total: computeLineTotal(line),
  })),
);

export const selectNozzleSessionSummary = createSelector(selectNozzleIndexes, (lines) =>
  computeSessionSummary(lines),
);

export const selectCanProceedNozzleStep = createSelector(selectNozzleIndexes, (lines) =>
  canProceedNozzleStep(lines),
);

export const selectJourneeValidationSummary = createSelector(
  selectDraft,
  selectOperators,
  selectValidationExtras,
  selectNozzleSessionSummary,
  selectLavageBonsTotal,
  selectVidangeBonsTotal,
  selectEncaissementsTotal,
  selectDepensesTotal,
  (draft, operators, extras, nozzleSummary, lavageTotal, vidangeTotal, encTotal, depTotal) => {
    if (!extras) {
      return null;
    }
    return buildJourneeValidationSummary({
      fuelSales: nozzleSummary.totalAmount,
      servicesTotal: lavageTotal + vidangeTotal,
      encaissementsTotal: encTotal,
      depensesTotal: depTotal,
      encaissements: draft.encaissements,
      extras,
      operators,
      chefDePisteId: draft.config.chefDePisteId,
      bombisteId: draft.config.bombisteId,
    });
  },
);
