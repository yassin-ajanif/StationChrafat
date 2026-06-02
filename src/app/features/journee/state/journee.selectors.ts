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
  buildNozzleBombisteGroups,
  canProceedNozzleStep,
  computeSessionSummary,
  mapLinesWithTotals,
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

export const selectLavageChefVidangeLavageId = createSelector(
  selectDraft,
  (draft) => draft.lavageChefVidangeLavageId,
);

export const selectFilteredLavageBons = createSelector(
  selectLavageBons,
  selectLavageChefVidangeLavageId,
  (bons, chefId) =>
    chefId == null ? [] : bons.filter((bon) => bon.chefVidangeLavageId === chefId),
);

export const selectLavageBonsTotal = createSelector(selectLavageBons, (bons) =>
  computeLavageBonsTotal(bons),
);

export const selectCanProceedLavageStep = createSelector(selectLavageBons, (bons) =>
  canProceedLavageStep(bons),
);

export const selectVidangeBons = createSelector(selectDraft, (draft) => draft.vidangeBons);

export const selectVidangeChefVidangeLavageId = createSelector(
  selectDraft,
  (draft) => draft.vidangeChefVidangeLavageId,
);

export const selectFilteredVidangeBons = createSelector(
  selectVidangeBons,
  selectVidangeChefVidangeLavageId,
  (bons, chefId) =>
    chefId == null ? [] : bons.filter((bon) => bon.chefVidangeLavageId === chefId),
);

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

export const selectSelectedNozzleBombisteIds = createSelector(
  selectDraft,
  (draft) => draft.selectedNozzleBombisteIds,
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

export const selectNozzleLinesWithTotals = createSelector(selectNozzleIndexes, (lines) =>
  mapLinesWithTotals(lines),
);

export const selectNozzleBombisteGroups = createSelector(
  selectNozzleIndexes,
  selectSelectedNozzleBombisteIds,
  selectOperators,
  selectDraft,
  (lines, selectedIds, operators, draft) => {
    const operatorNameById = new Map(operators.map((operator) => [operator.id, operator.name]));
    const paymentsByBombisteId = new Map(
      draft.nozzleBombistePayments.map((entry) => [entry.bombisteId, entry]),
    );
    return buildNozzleBombisteGroups(lines, selectedIds, operatorNameById, paymentsByBombisteId);
  },
);

export const selectNozzleSessionSummary = createSelector(
  selectNozzleIndexes,
  selectSelectedNozzleBombisteIds,
  (lines, selectedIds) => {
    const relevant =
      selectedIds.length === 0
        ? []
        : lines.filter((line) => selectedIds.includes(line.bombisteId));
    return computeSessionSummary(relevant);
  },
);

export const selectCanProceedNozzleStep = createSelector(
  selectNozzleIndexes,
  selectSelectedNozzleBombisteIds,
  (lines, selectedIds) => canProceedNozzleStep(lines, selectedIds),
);

export const selectJourneeValidationSummary = createSelector(
  selectDraft,
  selectOperators,
  selectValidationExtras,
  selectNozzleSessionSummary,
  selectNozzleBombisteGroups,
  selectLavageBons,
  selectVidangeBons,
  selectLavageBonsTotal,
  selectVidangeBonsTotal,
  selectEncaissementsTotal,
  selectDepensesTotal,
  (
    draft,
    operators,
    extras,
    nozzleSummary,
    bombisteGroups,
    lavageBons,
    vidangeBons,
    lavageTotal,
    vidangeTotal,
    encTotal,
    depTotal,
  ) => {
    if (!extras) {
      return null;
    }
    return buildJourneeValidationSummary({
      fuelSales: nozzleSummary.totalAmount,
      fuelSalesByBombiste: bombisteGroups.map((group) => ({
        bombisteId: group.bombisteId,
        bombisteName: group.bombisteName,
        liters: group.totals.liters,
        salesTotal: group.totals.amount,
        payments: group.payments,
      })),
      lavageBons,
      vidangeBons,
      servicesTotal: lavageTotal + vidangeTotal,
      encaissementsTotal: encTotal,
      depensesTotal: depTotal,
      encaissements: draft.encaissements,
      extras,
      operators,
      chefDePisteId: draft.config.chefDePisteId,
    });
  },
);
