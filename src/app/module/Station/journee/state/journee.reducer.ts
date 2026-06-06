import { createFeature, createReducer, on } from '@ngrx/store';
import { emptyPaymentSplit } from '../../shared/components/bon-dialog/bon-dialog.component';
import {
  DEFAULT_DEPENSE_PAYMENT_MODE,
  DepenseLine,
  EncaissementClientOption,
  EncaissementLine,
  initialJourneeDraft,
  JourneeDraft,
  JourneeKpis,
  JourneeSummary,
  Operator,
} from './journee.store';
import { JourneeActions } from './journee.actions';

function createEmptyEncaissementLine(id: number): EncaissementLine {
  return { id, clientId: null, paymentMode: '', amount: 0, note: '' };
}

function createEmptyDepenseLine(id: number): DepenseLine {
  return {
    id,
    expenseType: '',
    description: '',
    amount: 0,
    paymentMode: DEFAULT_DEPENSE_PAYMENT_MODE,
    note: '',
  };
}

const emptyDraft = (): JourneeDraft => initialJourneeDraft();

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
  submittingJournee: boolean;
  submitJourneeError: string | null;
}

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

    on(JourneeActions.patchConfigurationStep1, (state, { patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        configurationStep1: { ...state.draft.configurationStep1, ...patch },
      },
      startError: null,
    })),

    on(JourneeActions.patchIndexPistolesStep2, (state, { patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        indexPistolesStep2: { ...state.draft.indexPistolesStep2, ...patch },
      },
    })),

    on(JourneeActions.patchBonsStep3, (state, { patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        bonsStep3: { ...state.draft.bonsStep3, ...patch },
      },
    })),

    on(JourneeActions.patchEncaissementsStep4, (state, { patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        encaissementsStep4: { ...state.draft.encaissementsStep4, ...patch },
      },
    })),

    on(JourneeActions.patchDepensesStep6, (state, { patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        depensesStep6: { ...state.draft.depensesStep6, ...patch },
      },
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
        configurationStep1: {
          ...state.draft.configurationStep1,
          journeeId: id,
          openedAt,
          isValid: true,
        },
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
      submitJourneeError: null,
    })),

    on(JourneeActions.loadNozzleIndexes, (state) => ({
      ...state,
      nozzleIndexesLoading: true,
      nozzleIndexesError: null,
    })),
    on(JourneeActions.loadNozzleIndexesSuccess, (state, { lines }) => {
      const step2 = state.draft.indexPistolesStep2;
      const merged = lines.map((line) => {
        const existing = step2.lines.find((l) => l.id === line.id);
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
        draft: {
          ...state.draft,
          indexPistolesStep2: { ...step2, lines: merged },
        },
      };
    }),
    on(JourneeActions.loadNozzleIndexesFailure, (state, { error }) => ({
      ...state,
      nozzleIndexesLoading: false,
      nozzleIndexesError: error,
    })),

    on(JourneeActions.transmitFuelSalesToStationBons, (state) => state),

    on(JourneeActions.addStationBon, (state, { bon }) => {
      const items = state.draft.bonsStep3.items;
      const nextBonId = items.reduce((max, b) => Math.max(max, b.id), 0) + 1;
      let nextLineId =
        items.reduce(
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
          bonsStep3: {
            ...state.draft.bonsStep3,
            items: [
              ...items,
              {
                id: nextBonId,
                bonNumber: bon.bonNumber.trim(),
                partnerRef: bon.partnerRef.trim(),
                chefVidangeLavageId: bon.chefVidangeLavageId,
                operatorId: bon.operatorId,
                dateLivraison: bon.dateLivraison,
                statut: bon.statut,
                adresse: bon.adresse.trim(),
                description: bon.description.trim(),
                serviceLines: bon.serviceLines.map(mapLine),
                productLines: bon.productLines.map(mapLine),
                payments: bon.payments ?? emptyPaymentSplit(),
              },
            ],
          },
        },
      };
    }),

    on(JourneeActions.updateStationBon, (state, { id, bon }) => {
      const items = state.draft.bonsStep3.items;
      const existing = items.find((b) => b.id === id);
      if (!existing) {
        return state;
      }
      let nextLineId =
        items.reduce(
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
          bonsStep3: {
            ...state.draft.bonsStep3,
            items: items.map((b) =>
              b.id === id
                ? {
                    ...b,
                    bonNumber: bon.bonNumber.trim(),
                    partnerRef: bon.partnerRef.trim(),
                    chefVidangeLavageId: bon.chefVidangeLavageId,
                    operatorId: bon.operatorId,
                    dateLivraison: bon.dateLivraison,
                    statut: bon.statut,
                    adresse: bon.adresse.trim(),
                    description: bon.description.trim(),
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
        },
      };
    }),

    on(JourneeActions.removeStationBon, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        bonsStep3: {
          ...state.draft.bonsStep3,
          items: state.draft.bonsStep3.items.filter((b) => b.id !== id),
        },
      },
    })),

    on(JourneeActions.setStationBonsChefId, (state, { chefVidangeLavageId }) => ({
      ...state,
      draft: {
        ...state.draft,
        bonsStep3: {
          ...state.draft.bonsStep3,
          chefId: chefVidangeLavageId,
        },
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
      const step4 = state.draft.encaissementsStep4;
      const merged = step4.lines.length > 0 ? step4.lines : lines;
      return {
        ...state,
        encaissementsLoading: false,
        draft: {
          ...state.draft,
          encaissementsStep4: { ...step4, lines: merged },
        },
      };
    }),
    on(JourneeActions.loadEncaissementsFailure, (state, { error }) => ({
      ...state,
      encaissementsLoading: false,
      encaissementsError: error,
    })),

    on(JourneeActions.addEncaissementLine, (state) => {
      const lines = state.draft.encaissementsStep4.lines;
      const nextId = lines.reduce((max, line) => Math.max(max, line.id), 0) + 1;
      return {
        ...state,
        draft: {
          ...state.draft,
          encaissementsStep4: {
            ...state.draft.encaissementsStep4,
            lines: [...lines, createEmptyEncaissementLine(nextId)],
          },
        },
      };
    }),

    on(JourneeActions.updateEncaissementLine, (state, { id, patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        encaissementsStep4: {
          ...state.draft.encaissementsStep4,
          lines: state.draft.encaissementsStep4.lines.map((line) =>
            line.id === id ? { ...line, ...patch } : line,
          ),
        },
      },
    })),

    on(JourneeActions.removeEncaissementLine, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        encaissementsStep4: {
          ...state.draft.encaissementsStep4,
          lines: state.draft.encaissementsStep4.lines.filter((line) => line.id !== id),
        },
      },
    })),

    on(JourneeActions.loadDepenses, (state) => ({
      ...state,
      depensesLoading: true,
      depensesError: null,
    })),
    on(JourneeActions.loadDepensesSuccess, (state, { lines }) => {
      const step6 = state.draft.depensesStep6;
      const merged = step6.lines.length > 0 ? step6.lines : lines;
      return {
        ...state,
        depensesLoading: false,
        draft: {
          ...state.draft,
          depensesStep6: { ...step6, lines: merged },
        },
      };
    }),
    on(JourneeActions.loadDepensesFailure, (state, { error }) => ({
      ...state,
      depensesLoading: false,
      depensesError: error,
    })),

    on(JourneeActions.addDepenseLine, (state) => {
      const lines = state.draft.depensesStep6.lines;
      const nextId = lines.reduce((max, line) => Math.max(max, line.id), 0) + 1;
      return {
        ...state,
        draft: {
          ...state.draft,
          depensesStep6: {
            ...state.draft.depensesStep6,
            lines: [...lines, createEmptyDepenseLine(nextId)],
          },
        },
      };
    }),

    on(JourneeActions.updateDepenseLine, (state, { id, patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        depensesStep6: {
          ...state.draft.depensesStep6,
          lines: state.draft.depensesStep6.lines.map((line) =>
            line.id === id ? { ...line, ...patch } : line,
          ),
        },
      },
    })),

    on(JourneeActions.removeDepenseLine, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        depensesStep6: {
          ...state.draft.depensesStep6,
          lines: state.draft.depensesStep6.lines.filter((line) => line.id !== id),
        },
      },
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
        indexPistolesStep2: {
          ...state.draft.indexPistolesStep2,
          lines: state.draft.indexPistolesStep2.lines.map((line) => {
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
      },
    })),

    on(JourneeActions.addNozzleBombiste, (state, { bombisteId }) => {
      const step2 = state.draft.indexPistolesStep2;
      const selected = step2.selectedBombisteIds;
      if (selected.includes(bombisteId)) {
        return state;
      }
      const hasPayment = step2.bombistePayments.some((entry) => entry.bombisteId === bombisteId);
      return {
        ...state,
        draft: {
          ...state.draft,
          indexPistolesStep2: {
            ...step2,
            selectedBombisteIds: [...selected, bombisteId],
            bombistePayments: hasPayment
              ? step2.bombistePayments
              : [...step2.bombistePayments, { bombisteId, ...emptyPaymentSplit() }],
          },
        },
      };
    }),

    on(JourneeActions.removeNozzleBombiste, (state, { bombisteId }) => ({
      ...state,
      draft: {
        ...state.draft,
        indexPistolesStep2: {
          ...state.draft.indexPistolesStep2,
          selectedBombisteIds: state.draft.indexPistolesStep2.selectedBombisteIds.filter(
            (id) => id !== bombisteId,
          ),
          bombistePayments: state.draft.indexPistolesStep2.bombistePayments.filter(
            (entry) => entry.bombisteId !== bombisteId,
          ),
        },
      },
    })),

    on(JourneeActions.updateNozzleBombistePayment, (state, { bombisteId, cash, tpe, bons }) => {
      const step2 = state.draft.indexPistolesStep2;
      const existing = step2.bombistePayments.find((entry) => entry.bombisteId === bombisteId);
      const nextEntry = {
        bombisteId,
        cash: cash ?? existing?.cash ?? 0,
        tpe: tpe ?? existing?.tpe ?? 0,
        bons: bons ?? existing?.bons ?? 0,
      };
      const bombistePayments = existing
        ? step2.bombistePayments.map((entry) =>
            entry.bombisteId === bombisteId ? nextEntry : entry,
          )
        : [...step2.bombistePayments, nextEntry];

      return {
        ...state,
        draft: {
          ...state.draft,
          indexPistolesStep2: { ...step2, bombistePayments },
        },
      };
    }),
  ),
});
