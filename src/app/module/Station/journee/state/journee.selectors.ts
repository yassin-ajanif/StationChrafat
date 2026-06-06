import { createSelector } from '@ngrx/store';
import { computeStationBonsTotal, canProceedBonsStep } from '../../shared/models/bon';
import {
  buildJourneeValidationSummary,
  buildNozzleBombisteGroups,
  canProceedDepensesStep,
  canProceedEncaissementsStep,
  canProceedNozzleStep,
  computeDepensesTotal,
  computeEncaissementsTotal,
  computeSessionSummary,
  mapLinesWithTotals,
} from './journee.store';
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
  selectValidationExtras,
  selectValidationExtrasLoading,
  selectValidationExtrasError,
  selectSubmittingJournee,
  selectSubmitJourneeError,
} = journeeFeature;

export const selectStationBons = createSelector(selectDraft, (draft) => draft.stationBons);

export const selectStationBonsChefId = createSelector(
  selectDraft,
  (draft) => draft.stationBonsChefId,
);

export const selectFilteredStationBons = createSelector(
  selectStationBons,
  selectStationBonsChefId,
  (bons, chefId) =>
    chefId == null ? [] : bons.filter((bon) => bon.chefVidangeLavageId === chefId),
);

export const selectStationBonsTotal = createSelector(selectStationBons, (bons) =>
  computeStationBonsTotal(bons),
);

export const selectCanProceedBonsStep = createSelector(selectStationBons, (bons) =>
  canProceedBonsStep(bons),
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
  selectStationBons,
  selectStationBonsTotal,
  selectEncaissementsTotal,
  selectDepensesTotal,
  (
    draft,
    operators,
    extras,
    nozzleSummary,
    bombisteGroups,
    stationBons,
    bonsTotal,
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
      stationBons,
      servicesTotal: bonsTotal,
      encaissementsTotal: encTotal,
      depensesTotal: depTotal,
      encaissements: draft.encaissements,
      extras,
      operators,
      chefDePisteId: draft.config.chefDePisteId,
    });
  },
);
