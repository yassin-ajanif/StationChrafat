import { createFeature, createReducer, on } from '@ngrx/store';
import { computeDocumentLinesTotalTTC, roundMoney } from '../../shared/components/document-lines-table/document-lines-table.component';
import { emptyPaymentSplit } from '../../shared/components/bon-recap-payments/bon-recap-payments.component';
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
import type { BonsStep3Livraison, BonsStep3LivraisonSave } from './journee.store';
import type { LivraisonLineDraft } from '../../ventes/state/store';
import { JourneeActions } from './journee.actions';

function nextLivraisonId(items: BonsStep3Livraison[]): number {
  return items.reduce((max, item) => Math.max(max, item.livraison.id), 0) + 1;
}

function nextDocumentLineId(items: BonsStep3Livraison[]): number {
  return (
    items.reduce(
      (max, item) =>
        Math.max(
          max,
          ...item.livraison.serviceLines.map((line) => line.id),
          ...item.livraison.productLines.map((line) => line.id),
          0,
        ),
      0,
    ) + 1
  );
}

function computeLivraisonMontant(
  serviceLines: LivraisonLineDraft[],
  productLines: LivraisonLineDraft[],
): number {
  return roundMoney(
    computeDocumentLinesTotalTTC(serviceLines) + computeDocumentLinesTotalTTC(productLines),
  );
}

function mapNewDocumentLine(line: LivraisonLineDraft, id: number) {
  return {
    id,
    reference: line.reference,
    designation: line.designation,
    quantity: line.quantity,
    unit: line.unit,
    unitPriceHT: line.unitPriceHT,
    discountPercent: line.discountPercent,
    vatPercent: line.vatPercent,
  };
}

function buildLivraisonFromSave(
  save: BonsStep3LivraisonSave,
  items: BonsStep3Livraison[],
  existingId?: number,
  existingLivraison?: BonsStep3Livraison['livraison'],
): BonsStep3Livraison['livraison'] {
  let nextLineId = nextDocumentLineId(items);
  const mapLines = (
    drafts: LivraisonLineDraft[],
    existingLines: BonsStep3Livraison['livraison']['serviceLines'],
  ) =>
    drafts.map((line, index) =>
      mapNewDocumentLine(line, existingLines[index]?.id ?? nextLineId++),
    );
  const draft = save.livraison;
  const serviceLines = mapLines(draft.serviceLines, existingLivraison?.serviceLines ?? []);
  const productLines = mapLines(draft.productLines, existingLivraison?.productLines ?? []);
  return {
    id: existingId ?? nextLivraisonId(items),
    numero: save.numero.trim(),
    client: draft.client.trim(),
    dateLivraison: draft.dateLivraison,
    statut: draft.statut,
    adresse: draft.adresse.trim(),
    description: draft.description.trim(),
    montant: computeLivraisonMontant(serviceLines, productLines),
    serviceLines,
    productLines,
    payments: draft.payments ?? emptyPaymentSplit(),
  };
}

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
  stockControlLoading: boolean;
  stockControlError: string | null;
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
  stockControlLoading: false,
  stockControlError: null,
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

    on(JourneeActions.patchStockControlStep6, (state, { patch }) => ({
      ...state,
      draft: {
        ...state.draft,
        stockControlStep6: { ...state.draft.stockControlStep6, ...patch },
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
      stockControlError: null,
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

    on(JourneeActions.addLivraison, (state, { livraison: save }) => {
      const items = state.draft.bonsStep3.items;
      return {
        ...state,
        draft: {
          ...state.draft,
          bonsStep3: {
            ...state.draft.bonsStep3,
            items: [
              ...items,
              {
                operatorId: save.operatorId,
                chefVidangeLavageId: save.chefVidangeLavageId,
                livraison: buildLivraisonFromSave(save, items),
              },
            ],
          },
        },
      };
    }),

    on(JourneeActions.updateLivraison, (state, { id, livraison: save }) => {
      const items = state.draft.bonsStep3.items;
      const existing = items.find((item) => item.livraison.id === id);
      if (!existing) {
        return state;
      }
      return {
        ...state,
        draft: {
          ...state.draft,
          bonsStep3: {
            ...state.draft.bonsStep3,
            items: items.map((item) =>
              item.livraison.id === id
                ? {
                    operatorId: save.operatorId,
                    chefVidangeLavageId: save.chefVidangeLavageId,
                    fuelTransmittedFromNozzles: item.fuelTransmittedFromNozzles,
                    livraison: buildLivraisonFromSave(save, items, id, existing.livraison),
                  }
                : item,
            ),
          },
        },
      };
    }),

    on(JourneeActions.removeLivraison, (state, { id }) => ({
      ...state,
      draft: {
        ...state.draft,
        bonsStep3: {
          ...state.draft.bonsStep3,
          items: state.draft.bonsStep3.items.filter((item) => item.livraison.id !== id),
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

    on(JourneeActions.loadStockControl, (state) => ({
      ...state,
      stockControlLoading: true,
      stockControlError: null,
    })),
    on(JourneeActions.loadStockControlSuccess, (state, { lines }) => {
      const step = state.draft.stockControlStep6;
      const merged =
        step.lines.length > 0
          ? lines.map((line) => {
              const existing = step.lines.find((entry) => entry.id === line.id);
              return existing
                ? {
                    ...line,
                    measuredStock: existing.measuredStock,
                  }
                : line;
            })
          : lines;
      return {
        ...state,
        stockControlLoading: false,
        draft: {
          ...state.draft,
          stockControlStep6: { ...step, lines: merged },
        },
      };
    }),
    on(JourneeActions.loadStockControlFailure, (state, { error }) => ({
      ...state,
      stockControlLoading: false,
      stockControlError: error,
    })),

    on(JourneeActions.updateStockControlMeasured, (state, { lineId, measuredStock }) => ({
      ...state,
      draft: {
        ...state.draft,
        stockControlStep6: {
          ...state.draft.stockControlStep6,
          lines: state.draft.stockControlStep6.lines.map((line) =>
            line.id === lineId ? { ...line, measuredStock } : line,
          ),
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
