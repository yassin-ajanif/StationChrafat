import { createFeature, createReducer, on } from '@ngrx/store';
import {
  JourneeDraft,
  JourneeKpis,
  JourneeSummary,
  Operator,
} from '../models/journee.model';
import { EncaissementClientOption } from '../models/encaissement.model';
import { createEmptyEncaissementLine } from '../models/encaissement.model';
import { createEmptyDepenseLine } from '../models/depense.model';
import { emptyBombisteNozzlePayment } from '../models/nozzle-index.model';
import { emptyPaymentSplit } from '../models/payment-split.model';
import { ValidationExtras } from '../models/journee-validation.model';
import { JourneeActions } from './journee.actions';


export interface JourneeState {
  journees: JourneeSummary[];
  listLoading: boolean;
  listError: string | null;
  kpis: JourneeKpis | null;
  kpisLoading: boolean;
  operators: Operator[];
  operatorsLoading: boolean;
  draft: JourneeDraft;
  startingJournee: boolean;
  startError: string | null;
  nozzleIndexesLoading: boolean;
  nozzleIndexesError: string | null;
  encaissementClients: EncaissementClientOption[];
  encaissementClientsLoading: boolean;
  encaissementClientsError: string | null;
  encaissementsLoading: boolean;
  encaissementsError: string | null;
  depensesLoading: boolean;
  depensesError: string | null;
  validationExtras: ValidationExtras | null;
  validationExtrasLoading: boolean;
  validationExtrasError: string | null;
  submittingJournee: boolean;
  submitJourneeError: string | null;
}

const emptyDraft = (): JourneeDraft => ({
  id: null,
  config: {
    chefDePisteId: null,
    shiftSlot: null,
    openedAt: new Date().toISOString(),
  },
  selectedNozzleBombisteIds: [],
  nozzleBombistePayments: [],
  stationBonsChefId: null,
  nozzleIndexes: [],
  stationBons: [],
  encaissements: [],
  depenses: [],
});

export const initialJourneeState: JourneeState = {
  journees: [],
  listLoading: false,
  listError: null,
  kpis: null,
  kpisLoading: false,
  operators: [],
  operatorsLoading: false,
  draft: emptyDraft(),
  startingJournee: false,
  startError: null,
  nozzleIndexesLoading: false,
  nozzleIndexesError: null,
  encaissementClients: [],
  encaissementClientsLoading: false,
  encaissementClientsError: null,
  encaissementsLoading: false,
  encaissementsError: null,
  depensesLoading: false,
  depensesError: null,
  validationExtras: null,
  validationExtrasLoading: false,
  validationExtrasError: null,
  submittingJournee: false,
  submitJourneeError: null,
};

export const journeeFeature = createFeature({
  name: 'journee',
  reducer: createReducer(
    initialJourneeState,

    on(JourneeActions.loadList, (state) => ({
      ...state,
      listLoading: true,
      listError: null,
    })),
    on(JourneeActions.loadListSuccess, (state, { journees }) => ({
      ...state,
      listLoading: false,
      journees,
    })),
    on(JourneeActions.loadListFailure, (state, { error }) => ({
      ...state,
      listLoading: false,
      listError: error,
    })),

    on(JourneeActions.loadKpis, (state) => ({ ...state, kpisLoading: true })),
    on(JourneeActions.loadKpisSuccess, (state, { kpis }) => ({
      ...state,
      kpisLoading: false,
      kpis,
    })),
    on(JourneeActions.loadKpisFailure, (state) => ({ ...state, kpisLoading: false })),

    on(JourneeActions.loadOperators, (state) => ({ ...state, operatorsLoading: true })),
    on(JourneeActions.loadOperatorsSuccess, (state, { operators }) => ({
      ...state,
      operatorsLoading: false,
      operators,
    })),
    on(JourneeActions.loadOperatorsFailure, (state) => ({ ...state, operatorsLoading: false })),

    on(JourneeActions.setDraftConfig, (state, { config }) => ({
      ...state,
      draft: {
        ...state.draft,
        config: { ...state.draft.config, ...config },
      },
      startError: null,
    })),

    on(JourneeActions.startJournee, (state) => ({
      ...state,
      startingJournee: true,
      startError: null,
    })),
    on(JourneeActions.startJourneeSuccess, (state, { id, openedAt }) => ({
      ...state,
      startingJournee: false,
      draft: {
        ...state.draft,
        id,
        config: { ...state.draft.config, openedAt },
      },
    })),
    on(JourneeActions.startJourneeFailure, (state, { error }) => ({
      ...state,
      startingJournee: false,
      startError: error,
    })),

    on(JourneeActions.resetDraft, (state) => ({
      ...state,
      draft: emptyDraft(),
      startError: null,
      nozzleIndexesError: null,
      encaissementClientsError: null,
      encaissementsError: null,
      depensesError: null,
      validationExtrasError: null,
      submitJourneeError: null,
    })),

    on(JourneeActions.loadNozzleIndexes, (state) => ({
      ...state,
      nozzleIndexesLoading: true,
      nozzleIndexesError: null,
    })),
    on(JourneeActions.loadNozzleIndexesSuccess, (state, { lines }) => {
      const merged = lines.map((line) => {
        const existing = state.draft.nozzleIndexes.find((l) => l.id === line.id);
        if (!existing) {
          return line;
        }
        return {
          ...line,
          indexEntree: existing.indexEntree ?? line.indexEntree,
          indexSortie: existing.indexSortie ?? line.indexSortie,
        };
      });
      return {
        ...state,
        nozzleIndexesLoading: false,
        draft: { ...state.draft, nozzleIndexes: merged },
      };
    }),
    on(JourneeActions.loadNozzleIndexesFailure, (state, { error }) => ({
      ...state,
      nozzleIndexesLoading: false,
      nozzleIndexesError: error,
    })),

    on(JourneeActions.transmitFuelSalesToStationBons, (state) => state),

    on(JourneeActions.addStationBon, (state, { bon }) => {
      const nextBonId =
        state.draft.stationBons.reduce((max, b) => Math.max(max, b.id), 0) + 1;
      let nextLineId =
        state.draft.stationBons.reduce(
          (max, b) =>
            Math.max(
              max,
              ...b.serviceLines.map((l) => l.id),
              ...b.productLines.map((l) => l.id),
              0,
            ),
          0,
        ) + 1;
      const mapLine = (line: (typeof bon.serviceLines)[number]) => ({
        id: nextLineId++,
        reference: line.reference,
        designation: line.designation,
        quantity: line.quantity,
        unit: line.unit,
        unitPriceHT: line.unitPriceHT,
        discountPercent: line.discountPercent,
        vatPercent: line.vatPercent,
      });
      return {
        ...state,
        draft: {
          ...state.draft,
          stationBons: [
            ...state.draft.stationBons,
            {
              id: nextBonId,
              bonNumber: bon.bonNumber.trim(),
              partnerRef: bon.partnerRef.trim(),
              chefVidangeLavageId: bon.chefVidangeLavageId,
              serviceLines: bon.serviceLines.map(mapLine),
              productLines: bon.productLines.map(mapLine),
              payments: bon.payments ?? emptyPaymentSplit(),
            },
          ],
        },
      };
    }),

    on(JourneeActions.updateStationBon, (state, { id, bon }) => {
      const existing = state.draft.stationBons.find((b) => b.id === id);
      if (!existing) {
        return state;
      }
      let nextLineId =
        state.draft.stationBons.reduce(
          (max, b) =>
            Math.max(
              max,
              ...b.serviceLines.map((l) => l.id),
              ...b.productLines.map((l) => l.id),
              0,
            ),
          0,
        ) + 1;
      const mapLine = (
        line: (typeof bon.serviceLines)[number],
        index: number,
        existingLines: typeof existing.serviceLines,
      ) => ({
        id: existingLines[index]?.id ?? nextLineId++,
        reference: line.reference,
        designation: line.designation,
        quantity: line.quantity,
        unit: line.unit,
        unitPriceHT: line.unitPriceHT,
        discountPercent: line.discountPercent,
        vatPercent: line.vatPercent,
      });
      return {
        ...state,
        draft: {
          ...state.draft,
          stationBons: state.draft.stationBons.map((b) =>
            b.id === id
              ? {
                  ...b,
                  bonNumber: bon.bonNumber.trim(),
                  partnerRef: bon.partnerRef.trim(),
                  chefVidangeLavageId: bon.chefVidangeLavageId,
                  serviceLines: bon.serviceLines.map((line, index) =>
                    mapLine(line, index, existing.serviceLines),
                  ),
                  productLines: bon.productLines.map((line, index) =>
                    mapLine(line, index, existing.productLines),
                  ),
                  payments: bon.payments ?? emptyPaymentSplit(),
                }
              : b,
          ),
        },
      };
    }),

    on(JourneeActions.removeStationBon, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        stationBons: state.draft.stationBons.filter((b) => b.id !== id),
      },
    })),

    on(JourneeActions.setStationBonsChefId, (state, { chefVidangeLavageId }) => ({
      ...state,
      draft: {
        ...state.draft,
        stationBonsChefId: chefVidangeLavageId,
      },
    })),

    on(JourneeActions.loadEncaissementClients, (state) => ({
      ...state,
      encaissementClientsLoading: true,
      encaissementClientsError: null,
    })),
    on(JourneeActions.loadEncaissementClientsSuccess, (state, { clients }) => ({
      ...state,
      encaissementClientsLoading: false,
      encaissementClients: clients,
    })),
    on(JourneeActions.loadEncaissementClientsFailure, (state, { error }) => ({
      ...state,
      encaissementClientsLoading: false,
      encaissementClientsError: error,
    })),

    on(JourneeActions.loadEncaissements, (state) => ({
      ...state,
      encaissementsLoading: true,
      encaissementsError: null,
    })),
    on(JourneeActions.loadEncaissementsSuccess, (state, { lines }) => {
      const merged =
        state.draft.encaissements.length > 0 ? state.draft.encaissements : lines;
      return {
        ...state,
        encaissementsLoading: false,
        draft: { ...state.draft, encaissements: merged },
      };
    }),
    on(JourneeActions.loadEncaissementsFailure, (state, { error }) => ({
      ...state,
      encaissementsLoading: false,
      encaissementsError: error,
    })),

    on(JourneeActions.addEncaissementLine, (state) => {
      const nextId =
        state.draft.encaissements.reduce((max, line) => Math.max(max, line.id), 0) + 1;
      return {
        ...state,
        draft: {
          ...state.draft,
          encaissements: [
            ...state.draft.encaissements,
            createEmptyEncaissementLine(nextId),
          ],
        },
      };
    }),

    on(JourneeActions.updateEncaissementLine, (state, { id, patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        encaissements: state.draft.encaissements.map((line) =>
          line.id === id ? { ...line, ...patch } : line,
        ),
      },
    })),

    on(JourneeActions.removeEncaissementLine, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        encaissements: state.draft.encaissements.filter((line) => line.id !== id),
      },
    })),

    on(JourneeActions.loadDepenses, (state) => ({
      ...state,
      depensesLoading: true,
      depensesError: null,
    })),
    on(JourneeActions.loadDepensesSuccess, (state, { lines }) => {
      const merged = state.draft.depenses.length > 0 ? state.draft.depenses : lines;
      return {
        ...state,
        depensesLoading: false,
        draft: { ...state.draft, depenses: merged },
      };
    }),
    on(JourneeActions.loadDepensesFailure, (state, { error }) => ({
      ...state,
      depensesLoading: false,
      depensesError: error,
    })),

    on(JourneeActions.addDepenseLine, (state) => {
      const nextId =
        state.draft.depenses.reduce((max, line) => Math.max(max, line.id), 0) + 1;
      return {
        ...state,
        draft: {
          ...state.draft,
          depenses: [...state.draft.depenses, createEmptyDepenseLine(nextId)],
        },
      };
    }),

    on(JourneeActions.updateDepenseLine, (state, { id, patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        depenses: state.draft.depenses.map((line) =>
          line.id === id ? { ...line, ...patch } : line,
        ),
      },
    })),

    on(JourneeActions.removeDepenseLine, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        depenses: state.draft.depenses.filter((line) => line.id !== id),
      },
    })),

    on(JourneeActions.loadValidationExtras, (state) => ({
      ...state,
      validationExtrasLoading: true,
      validationExtrasError: null,
    })),
    on(JourneeActions.loadValidationExtrasSuccess, (state, { extras }) => ({
      ...state,
      validationExtrasLoading: false,
      validationExtras: extras,
    })),
    on(JourneeActions.loadValidationExtrasFailure, (state) => ({
      ...state,
      validationExtrasLoading: false,
    })),

    on(JourneeActions.submitJournee, (state) => ({
      ...state,
      submittingJournee: true,
      submitJourneeError: null,
    })),
    on(JourneeActions.submitJourneeSuccess, (state) => ({
      ...state,
      submittingJournee: false,
      draft: emptyDraft(),
      validationExtras: null,
    })),
    on(JourneeActions.submitJourneeFailure, (state, { error }) => ({
      ...state,
      submittingJournee: false,
      submitJourneeError: error,
    })),

    on(JourneeActions.updateNozzleIndex, (state, { lineId, indexEntree, indexSortie }) => ({
      ...state,
      draft: {
        ...state.draft,
        nozzleIndexes: state.draft.nozzleIndexes.map((line) => {
          if (line.id !== lineId) {
            return line;
          }
          return {
            ...line,
            ...(indexEntree !== undefined && { indexEntree }),
            ...(indexSortie !== undefined && { indexSortie }),
          };
        }),
      },
    })),

    on(JourneeActions.addNozzleBombiste, (state, { bombisteId }) => {
      const selected = state.draft.selectedNozzleBombisteIds;
      if (selected.includes(bombisteId)) {
        return state;
      }
      const hasPayment = state.draft.nozzleBombistePayments.some(
        (entry) => entry.bombisteId === bombisteId,
      );
      return {
        ...state,
        draft: {
          ...state.draft,
          selectedNozzleBombisteIds: [...selected, bombisteId],
          nozzleBombistePayments: hasPayment
            ? state.draft.nozzleBombistePayments
            : [
                ...state.draft.nozzleBombistePayments,
                { bombisteId, ...emptyBombisteNozzlePayment() },
              ],
        },
      };
    }),

    on(JourneeActions.removeNozzleBombiste, (state, { bombisteId }) => ({
      ...state,
      draft: {
        ...state.draft,
        selectedNozzleBombisteIds: state.draft.selectedNozzleBombisteIds.filter(
          (id) => id !== bombisteId,
        ),
        nozzleBombistePayments: state.draft.nozzleBombistePayments.filter(
          (entry) => entry.bombisteId !== bombisteId,
        ),
      },
    })),

    on(JourneeActions.updateNozzleBombistePayment, (state, { bombisteId, cash, tpe, bons }) => {
      const existing = state.draft.nozzleBombistePayments.find(
        (entry) => entry.bombisteId === bombisteId,
      );
      const nextEntry = {
        bombisteId,
        cash: cash ?? existing?.cash ?? 0,
        tpe: tpe ?? existing?.tpe ?? 0,
        bons: bons ?? existing?.bons ?? 0,
      };
      const nozzleBombistePayments = existing
        ? state.draft.nozzleBombistePayments.map((entry) =>
            entry.bombisteId === bombisteId ? nextEntry : entry,
          )
        : [...state.draft.nozzleBombistePayments, nextEntry];

      return {
        ...state,
        draft: {
          ...state.draft,
          nozzleBombistePayments,
        },
      };
    }),
  ),
});
