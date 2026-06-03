import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception } from '../models/achat';
import { Avoir, Commande, Devis, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';
import { CarburantActions } from './carburant.actions';

export interface CarburantState {
  stockOverview: StockOverview | null;
  stockLoading: boolean;
  stockError: string | null;
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  devisSaving: boolean;
  commandes: Commande[];
  commandesLoading: boolean;
  commandesError: string | null;
  livraisons: Livraison[];
  livraisonsLoading: boolean;
  livraisonsError: string | null;
  factures: Facture[];
  facturesLoading: boolean;
  facturesError: string | null;
  avoirs: Avoir[];
  avoirsLoading: boolean;
  avoirsError: string | null;
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
}

export const initialCarburantState: CarburantState = {
  stockOverview: null,
  stockLoading: false,
  stockError: null,
  devis: [],
  devisLoading: false,
  devisError: null,
  devisSaving: false,
  commandes: [],
  commandesLoading: false,
  commandesError: null,
  livraisons: [],
  livraisonsLoading: false,
  livraisonsError: null,
  factures: [],
  facturesLoading: false,
  facturesError: null,
  avoirs: [],
  avoirsLoading: false,
  avoirsError: null,
  devisAchat: [],
  devisAchatLoading: false,
  devisAchatError: null,
  devisAchatSaving: false,
  commandesAchat: [],
  commandesAchatLoading: false,
  commandesAchatError: null,
  commandesAchatSaving: false,
  receptions: [],
  receptionsLoading: false,
  receptionsError: null,
  receptionsSaving: false,
  facturesFournisseur: [],
  facturesFournisseurLoading: false,
  facturesFournisseurError: null,
  facturesFournisseurSaving: false,
  avoirsFournisseur: [],
  avoirsFournisseurLoading: false,
  avoirsFournisseurError: null,
  avoirsFournisseurSaving: false,
};

export const carburantFeature = createFeature({
  name: 'carburant',
  reducer: createReducer(
    initialCarburantState,

    on(CarburantActions.loadStock, (state) => ({
      ...state,
      stockLoading: true,
      stockError: null,
    })),
    on(CarburantActions.loadStockSuccess, (state, { overview }) => ({
      ...state,
      stockLoading: false,
      stockOverview: overview,
    })),
    on(CarburantActions.loadStockFailure, (state, { error }) => ({
      ...state,
      stockLoading: false,
      stockError: error,
    })),

    on(CarburantActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(CarburantActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(CarburantActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(CarburantActions.addDevis, CarburantActions.updateDevis, CarburantActions.removeDevis, (state) => ({
      ...state,
      devisSaving: true,
    })),
    on(CarburantActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: [...state.devis, devis],
    })),
    on(CarburantActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(CarburantActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(
      CarburantActions.addDevisFailure,
      CarburantActions.updateDevisFailure,
      CarburantActions.removeDevisFailure,
      (state) => ({
        ...state,
        devisSaving: false,
      }),
    ),

    on(CarburantActions.loadCommandes, (state) => ({
      ...state,
      commandesLoading: true,
      commandesError: null,
    })),
    on(CarburantActions.loadCommandesSuccess, (state, { commandes }) => ({
      ...state,
      commandesLoading: false,
      commandes,
    })),
    on(CarburantActions.loadCommandesFailure, (state, { error }) => ({
      ...state,
      commandesLoading: false,
      commandesError: error,
    })),

    on(CarburantActions.loadLivraisons, (state) => ({
      ...state,
      livraisonsLoading: true,
      livraisonsError: null,
    })),
    on(CarburantActions.loadLivraisonsSuccess, (state, { livraisons }) => ({
      ...state,
      livraisonsLoading: false,
      livraisons,
    })),
    on(CarburantActions.loadLivraisonsFailure, (state, { error }) => ({
      ...state,
      livraisonsLoading: false,
      livraisonsError: error,
    })),

    on(CarburantActions.loadFactures, (state) => ({
      ...state,
      facturesLoading: true,
      facturesError: null,
    })),
    on(CarburantActions.loadFacturesSuccess, (state, { factures }) => ({
      ...state,
      facturesLoading: false,
      factures,
    })),
    on(CarburantActions.loadFacturesFailure, (state, { error }) => ({
      ...state,
      facturesLoading: false,
      facturesError: error,
    })),

    on(CarburantActions.loadAvoirs, (state) => ({
      ...state,
      avoirsLoading: true,
      avoirsError: null,
    })),
    on(CarburantActions.loadAvoirsSuccess, (state, { avoirs }) => ({
      ...state,
      avoirsLoading: false,
      avoirs,
    })),
    on(CarburantActions.loadAvoirsFailure, (state, { error }) => ({
      ...state,
      avoirsLoading: false,
      avoirsError: error,
    })),

    on(CarburantActions.loadDevisAchat, (state) => ({
      ...state,
      devisAchatLoading: true,
      devisAchatError: null,
    })),
    on(CarburantActions.loadDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchat,
    })),
    on(CarburantActions.loadDevisAchatFailure, (state, { error }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchatError: error,
    })),

    on(CarburantActions.addDevisAchat, CarburantActions.updateDevisAchat, CarburantActions.removeDevisAchat, (state) => ({
      ...state,
      devisAchatSaving: true,
    })),
    on(CarburantActions.addDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: [...state.devisAchat, devisAchat],
    })),
    on(CarburantActions.updateDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.map((d) => (d.id === devisAchat.id ? devisAchat : d)),
    })),
    on(CarburantActions.removeDevisAchatSuccess, (state, { id }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.filter((d) => d.id !== id),
    })),
    on(
      CarburantActions.addDevisAchatFailure,
      CarburantActions.updateDevisAchatFailure,
      CarburantActions.removeDevisAchatFailure,
      (state) => ({
        ...state,
        devisAchatSaving: false,
      }),
    ),

    on(CarburantActions.loadCommandesAchat, (state) => ({
      ...state,
      commandesAchatLoading: true,
      commandesAchatError: null,
    })),
    on(CarburantActions.loadCommandesAchatSuccess, (state, { commandesAchat }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchat,
    })),
    on(CarburantActions.loadCommandesAchatFailure, (state, { error }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchatError: error,
    })),

    on(
      CarburantActions.addCommandeAchat,
      CarburantActions.updateCommandeAchat,
      CarburantActions.removeCommandeAchat,
      (state) => ({
        ...state,
        commandesAchatSaving: true,
      }),
    ),
    on(CarburantActions.addCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: [...state.commandesAchat, commandeAchat],
    })),
    on(CarburantActions.updateCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.map((c) => (c.id === commandeAchat.id ? commandeAchat : c)),
    })),
    on(CarburantActions.removeCommandeAchatSuccess, (state, { id }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.filter((c) => c.id !== id),
    })),
    on(
      CarburantActions.addCommandeAchatFailure,
      CarburantActions.updateCommandeAchatFailure,
      CarburantActions.removeCommandeAchatFailure,
      (state) => ({
        ...state,
        commandesAchatSaving: false,
      }),
    ),

    on(CarburantActions.loadReceptions, (state) => ({
      ...state,
      receptionsLoading: true,
      receptionsError: null,
    })),
    on(CarburantActions.loadReceptionsSuccess, (state, { receptions }) => ({
      ...state,
      receptionsLoading: false,
      receptions,
    })),
    on(CarburantActions.loadReceptionsFailure, (state, { error }) => ({
      ...state,
      receptionsLoading: false,
      receptionsError: error,
    })),

    on(CarburantActions.addReception, CarburantActions.updateReception, CarburantActions.removeReception, (state) => ({
      ...state,
      receptionsSaving: true,
    })),
    on(CarburantActions.addReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: [...state.receptions, reception],
    })),
    on(CarburantActions.updateReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.map((r) => (r.id === reception.id ? reception : r)),
    })),
    on(CarburantActions.removeReceptionSuccess, (state, { id }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.filter((r) => r.id !== id),
    })),
    on(
      CarburantActions.addReceptionFailure,
      CarburantActions.updateReceptionFailure,
      CarburantActions.removeReceptionFailure,
      (state) => ({ ...state, receptionsSaving: false }),
    ),

    on(CarburantActions.loadFacturesFournisseur, (state) => ({
      ...state,
      facturesFournisseurLoading: true,
      facturesFournisseurError: null,
    })),
    on(CarburantActions.loadFacturesFournisseurSuccess, (state, { facturesFournisseur }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseur,
    })),
    on(CarburantActions.loadFacturesFournisseurFailure, (state, { error }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseurError: error,
    })),

    on(
      CarburantActions.addFactureFournisseur,
      CarburantActions.updateFactureFournisseur,
      CarburantActions.removeFactureFournisseur,
      (state) => ({ ...state, facturesFournisseurSaving: true }),
    ),
    on(CarburantActions.addFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: [...state.facturesFournisseur, factureFournisseur],
    })),
    on(CarburantActions.updateFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.map((f) =>
        f.id === factureFournisseur.id ? factureFournisseur : f,
      ),
    })),
    on(CarburantActions.removeFactureFournisseurSuccess, (state, { id }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.filter((f) => f.id !== id),
    })),
    on(
      CarburantActions.addFactureFournisseurFailure,
      CarburantActions.updateFactureFournisseurFailure,
      CarburantActions.removeFactureFournisseurFailure,
      (state) => ({ ...state, facturesFournisseurSaving: false }),
    ),

    on(CarburantActions.loadAvoirsFournisseur, (state) => ({
      ...state,
      avoirsFournisseurLoading: true,
      avoirsFournisseurError: null,
    })),
    on(CarburantActions.loadAvoirsFournisseurSuccess, (state, { avoirsFournisseur }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseur,
    })),
    on(CarburantActions.loadAvoirsFournisseurFailure, (state, { error }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseurError: error,
    })),

    on(
      CarburantActions.addAvoirFournisseur,
      CarburantActions.updateAvoirFournisseur,
      CarburantActions.removeAvoirFournisseur,
      (state) => ({ ...state, avoirsFournisseurSaving: true }),
    ),
    on(CarburantActions.addAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: [...state.avoirsFournisseur, avoirFournisseur],
    })),
    on(CarburantActions.updateAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.map((a) =>
        a.id === avoirFournisseur.id ? avoirFournisseur : a,
      ),
    })),
    on(CarburantActions.removeAvoirFournisseurSuccess, (state, { id }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.filter((a) => a.id !== id),
    })),
    on(
      CarburantActions.addAvoirFournisseurFailure,
      CarburantActions.updateAvoirFournisseurFailure,
      CarburantActions.removeAvoirFournisseurFailure,
      (state) => ({ ...state, avoirsFournisseurSaving: false }),
    ),
  ),
});
