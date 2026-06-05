import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception, RetourFournisseur } from './store';
import { AchatActions } from './achat.actions';

export interface AchatState {
  devisAchat: DevisAchat[];
  devisAchatLoading: boolean;
  devisAchatError: string | null;
  devisAchatSaving: boolean;
  commandesAchat: CommandeAchat[];
  commandesAchatLoading: boolean;
  commandesAchatError: string | null;
  commandesAchatSaving: boolean;
  receptions: Reception[];
  receptionsLoading: boolean;
  receptionsError: string | null;
  receptionsSaving: boolean;
  facturesFournisseur: FactureFournisseur[];
  facturesFournisseurLoading: boolean;
  facturesFournisseurError: string | null;
  facturesFournisseurSaving: boolean;
  avoirsFournisseur: AvoirFournisseur[];
  avoirsFournisseurLoading: boolean;
  avoirsFournisseurError: string | null;
  avoirsFournisseurSaving: boolean;
  retoursFournisseur: RetourFournisseur[];
  retoursFournisseurLoading: boolean;
  retoursFournisseurError: string | null;
  retoursFournisseurSaving: boolean;
}

const initialAchatState: AchatState = {
  devisAchat: [], devisAchatLoading: false, devisAchatError: null, devisAchatSaving: false,
  commandesAchat: [], commandesAchatLoading: false, commandesAchatError: null, commandesAchatSaving: false,
  receptions: [], receptionsLoading: false, receptionsError: null, receptionsSaving: false,
  facturesFournisseur: [], facturesFournisseurLoading: false, facturesFournisseurError: null, facturesFournisseurSaving: false,
  avoirsFournisseur: [], avoirsFournisseurLoading: false, avoirsFournisseurError: null, avoirsFournisseurSaving: false,
  retoursFournisseur: [], retoursFournisseurLoading: false, retoursFournisseurError: null, retoursFournisseurSaving: false,
};

export const achatFeature = createFeature({
  name: 'Achat',
  reducer: createReducer(
    initialAchatState,

    on(AchatActions.loadDevisAchat, (s) => ({ ...s, devisAchatLoading: true, devisAchatError: null })),
    on(AchatActions.loadDevisAchatSuccess, (s, { devisAchat }) => ({ ...s, devisAchatLoading: false, devisAchat })),
    on(AchatActions.loadDevisAchatFailure, (s, { error }) => ({ ...s, devisAchatLoading: false, devisAchatError: error })),
    on(AchatActions.addDevisAchat, (s) => ({ ...s, devisAchatSaving: true })),
    on(AchatActions.addDevisAchatSuccess, (s, { devisAchat }) => ({ ...s, devisAchatSaving: false, devisAchat: [...s.devisAchat, devisAchat] })),
    on(AchatActions.updateDevisAchat, (s) => ({ ...s, devisAchatSaving: true })),
    on(AchatActions.updateDevisAchatSuccess, (s, { devisAchat }) => ({ ...s, devisAchatSaving: false, devisAchat: s.devisAchat.map((d) => (d.id === devisAchat.id ? devisAchat : d)) })),
    on(AchatActions.removeDevisAchat, (s) => ({ ...s, devisAchatSaving: true })),
    on(AchatActions.removeDevisAchatSuccess, (s, { id }) => ({ ...s, devisAchatSaving: false, devisAchat: s.devisAchat.filter((d) => d.id !== id) })),
    on(AchatActions.addDevisAchatFailure, AchatActions.updateDevisAchatFailure, AchatActions.removeDevisAchatFailure, (s) => ({ ...s, devisAchatSaving: false })),

    on(AchatActions.loadCommandesAchat, (s) => ({ ...s, commandesAchatLoading: true, commandesAchatError: null })),
    on(AchatActions.loadCommandesAchatSuccess, (s, { commandesAchat }) => ({ ...s, commandesAchatLoading: false, commandesAchat })),
    on(AchatActions.loadCommandesAchatFailure, (s, { error }) => ({ ...s, commandesAchatLoading: false, commandesAchatError: error })),
    on(AchatActions.addCommandeAchat, (s) => ({ ...s, commandesAchatSaving: true })),
    on(AchatActions.addCommandeAchatSuccess, (s, { commandeAchat }) => ({ ...s, commandesAchatSaving: false, commandesAchat: [...s.commandesAchat, commandeAchat] })),
    on(AchatActions.updateCommandeAchat, (s) => ({ ...s, commandesAchatSaving: true })),
    on(AchatActions.updateCommandeAchatSuccess, (s, { commandeAchat }) => ({ ...s, commandesAchatSaving: false, commandesAchat: s.commandesAchat.map((c) => (c.id === commandeAchat.id ? commandeAchat : c)) })),
    on(AchatActions.removeCommandeAchat, (s) => ({ ...s, commandesAchatSaving: true })),
    on(AchatActions.removeCommandeAchatSuccess, (s, { id }) => ({ ...s, commandesAchatSaving: false, commandesAchat: s.commandesAchat.filter((c) => c.id !== id) })),
    on(AchatActions.addCommandeAchatFailure, AchatActions.updateCommandeAchatFailure, AchatActions.removeCommandeAchatFailure, (s) => ({ ...s, commandesAchatSaving: false })),

    on(AchatActions.loadReceptions, (s) => ({ ...s, receptionsLoading: true, receptionsError: null })),
    on(AchatActions.loadReceptionsSuccess, (s, { receptions }) => ({ ...s, receptionsLoading: false, receptions })),
    on(AchatActions.loadReceptionsFailure, (s, { error }) => ({ ...s, receptionsLoading: false, receptionsError: error })),
    on(AchatActions.addReception, (s) => ({ ...s, receptionsSaving: true })),
    on(AchatActions.addReceptionSuccess, (s, { reception }) => ({ ...s, receptionsSaving: false, receptions: [...s.receptions, reception] })),
    on(AchatActions.updateReception, (s) => ({ ...s, receptionsSaving: true })),
    on(AchatActions.updateReceptionSuccess, (s, { reception }) => ({ ...s, receptionsSaving: false, receptions: s.receptions.map((r) => (r.id === reception.id ? reception : r)) })),
    on(AchatActions.removeReception, (s) => ({ ...s, receptionsSaving: true })),
    on(AchatActions.removeReceptionSuccess, (s, { id }) => ({ ...s, receptionsSaving: false, receptions: s.receptions.filter((r) => r.id !== id) })),
    on(AchatActions.addReceptionFailure, AchatActions.updateReceptionFailure, AchatActions.removeReceptionFailure, (s) => ({ ...s, receptionsSaving: false })),

    on(AchatActions.loadFacturesFournisseur, (s) => ({ ...s, facturesFournisseurLoading: true, facturesFournisseurError: null })),
    on(AchatActions.loadFacturesFournisseurSuccess, (s, { facturesFournisseur }) => ({ ...s, facturesFournisseurLoading: false, facturesFournisseur })),
    on(AchatActions.loadFacturesFournisseurFailure, (s, { error }) => ({ ...s, facturesFournisseurLoading: false, facturesFournisseurError: error })),
    on(AchatActions.addFactureFournisseur, (s) => ({ ...s, facturesFournisseurSaving: true })),
    on(AchatActions.addFactureFournisseurSuccess, (s, { factureFournisseur }) => ({ ...s, facturesFournisseurSaving: false, facturesFournisseur: [...s.facturesFournisseur, factureFournisseur] })),
    on(AchatActions.updateFactureFournisseur, (s) => ({ ...s, facturesFournisseurSaving: true })),
    on(AchatActions.updateFactureFournisseurSuccess, (s, { factureFournisseur }) => ({ ...s, facturesFournisseurSaving: false, facturesFournisseur: s.facturesFournisseur.map((f) => (f.id === factureFournisseur.id ? factureFournisseur : f)) })),
    on(AchatActions.removeFactureFournisseur, (s) => ({ ...s, facturesFournisseurSaving: true })),
    on(AchatActions.removeFactureFournisseurSuccess, (s, { id }) => ({ ...s, facturesFournisseurSaving: false, facturesFournisseur: s.facturesFournisseur.filter((f) => f.id !== id) })),
    on(AchatActions.addFactureFournisseurFailure, AchatActions.updateFactureFournisseurFailure, AchatActions.removeFactureFournisseurFailure, (s) => ({ ...s, facturesFournisseurSaving: false })),

    on(AchatActions.loadAvoirsFournisseur, (s) => ({ ...s, avoirsFournisseurLoading: true, avoirsFournisseurError: null })),
    on(AchatActions.loadAvoirsFournisseurSuccess, (s, { avoirsFournisseur }) => ({ ...s, avoirsFournisseurLoading: false, avoirsFournisseur })),
    on(AchatActions.loadAvoirsFournisseurFailure, (s, { error }) => ({ ...s, avoirsFournisseurLoading: false, avoirsFournisseurError: error })),
    on(AchatActions.addAvoirFournisseur, (s) => ({ ...s, avoirsFournisseurSaving: true })),
    on(AchatActions.addAvoirFournisseurSuccess, (s, { avoirFournisseur }) => ({ ...s, avoirsFournisseurSaving: false, avoirsFournisseur: [...s.avoirsFournisseur, avoirFournisseur] })),
    on(AchatActions.updateAvoirFournisseur, (s) => ({ ...s, avoirsFournisseurSaving: true })),
    on(AchatActions.updateAvoirFournisseurSuccess, (s, { avoirFournisseur }) => ({ ...s, avoirsFournisseurSaving: false, avoirsFournisseur: s.avoirsFournisseur.map((a) => (a.id === avoirFournisseur.id ? avoirFournisseur : a)) })),
    on(AchatActions.removeAvoirFournisseur, (s) => ({ ...s, avoirsFournisseurSaving: true })),
    on(AchatActions.removeAvoirFournisseurSuccess, (s, { id }) => ({ ...s, avoirsFournisseurSaving: false, avoirsFournisseur: s.avoirsFournisseur.filter((a) => a.id !== id) })),
    on(AchatActions.addAvoirFournisseurFailure, AchatActions.updateAvoirFournisseurFailure, AchatActions.removeAvoirFournisseurFailure, (s) => ({ ...s, avoirsFournisseurSaving: false })),

    on(AchatActions.loadRetoursFournisseur, (s) => ({ ...s, retoursFournisseurLoading: true, retoursFournisseurError: null })),
    on(AchatActions.loadRetoursFournisseurSuccess, (s, { retoursFournisseur }) => ({ ...s, retoursFournisseurLoading: false, retoursFournisseur })),
    on(AchatActions.loadRetoursFournisseurFailure, (s, { error }) => ({ ...s, retoursFournisseurLoading: false, retoursFournisseurError: error })),
    on(AchatActions.addRetourFournisseur, (s) => ({ ...s, retoursFournisseurSaving: true })),
    on(AchatActions.addRetourFournisseurSuccess, (s, { retourFournisseur }) => ({ ...s, retoursFournisseurSaving: false, retoursFournisseur: [...s.retoursFournisseur, retourFournisseur] })),
    on(AchatActions.updateRetourFournisseur, (s) => ({ ...s, retoursFournisseurSaving: true })),
    on(AchatActions.updateRetourFournisseurSuccess, (s, { retourFournisseur }) => ({ ...s, retoursFournisseurSaving: false, retoursFournisseur: s.retoursFournisseur.map((r) => (r.id === retourFournisseur.id ? retourFournisseur : r)) })),
    on(AchatActions.removeRetourFournisseur, (s) => ({ ...s, retoursFournisseurSaving: true })),
    on(AchatActions.removeRetourFournisseurSuccess, (s, { id }) => ({ ...s, retoursFournisseurSaving: false, retoursFournisseur: s.retoursFournisseur.filter((r) => r.id !== id) })),
    on(AchatActions.addRetourFournisseurFailure, AchatActions.updateRetourFournisseurFailure, AchatActions.removeRetourFournisseurFailure, (s) => ({ ...s, retoursFournisseurSaving: false })),
  ),
});
